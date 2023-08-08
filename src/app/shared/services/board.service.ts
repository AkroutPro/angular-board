import { inject, Injectable } from '@angular/core';
import { ColumnModel } from '../models/column.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemModel } from '../models/item.model';
import { BOARD_CONFIG } from '../configs/board.config';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private boardConfig = inject(BOARD_CONFIG);
  columns: ColumnModel[] = this.boardConfig.columns;
  private columnsSubject = new BehaviorSubject<ColumnModel[]>(this.columns);
  getColumns(): Observable<ColumnModel[]> {
    return this.columnsSubject.asObservable();
  }
  addNewItemByColumn(column: ColumnModel): void {
    const newNumber = column.form.value.newNumber;
    const numberExist = column.items.some(item => item.number === newNumber);
    if (newNumber !== undefined && newNumber !== null && !numberExist) {
      const newItem = {
        parentKey: column.key,
        number: newNumber,
        color: this.getNumberColor(newNumber),
        editing: false,
      };
      column.items.push(newItem);
      column.form.reset();
      // update columns
      this.columns = this.columns.map(col => {
        if (col.key === column.key) {
          return {
            ...column,
          };
        }
        return {
          ...col,
        };
      });
      // Update the columns and emit the change
      this.columnsSubject.next(this.columns);
    }
  }
  removeItem(item: ItemModel): void {
    this.columns = this.columns.map(col => {
      if (col.key === item.parentKey) {
        return {
          ...col,
          items: [...col.items.filter(i => i.number !== item.number)],
        };
      }
      return {
        ...col,
      };
    });
    this.columnsSubject.next(this.columns);
  }
  updateItem(item: ItemModel): void {
    this.columns = this.columns.map(col => {
      if (col.key === item.parentKey) {
        return {
          ...col,
          items: [
            ...col.items.map((i: ItemModel) => {
              if (i.number == item.number && item.editedNumber) {
                return {
                  ...i,
                  number: item.editedNumber,
                  editing: false,
                  color: this.getNumberColor(item.editedNumber),
                };
              }
              return {
                ...i,
              };
            }),
          ],
        };
      }
      return {
        ...col,
      };
    });
    this.columnsSubject.next(this.columns);
  }
  getNumberColor(number: number): string {
    let result = '';
    if (number % 3 === 0) {
      result = 'green';
      if (number % 5 === 0) {
        result = 'yellow';
      }
    } else if (number % 5 === 0) {
      result = 'blue';
    } else {
      result = 'red';
    }
    return result;
  }
  moveItemToColumn(destColumnKey: string, itemToMove: ItemModel): void {
    this.columns = this.columns.map((column: ColumnModel) => {
      // Remove the item from its parent column;
      if (column.key === itemToMove.parentKey) {
        return {
          ...column,
          items: [
            ...column.items.filter(item => item.number !== itemToMove.number),
          ],
        };
      } else if (
        column.key === destColumnKey &&
        !column.items.some(item => item.number === itemToMove.number)
      ) {
        // Update the target column items
        return {
          ...column,
          items: [...column.items, { ...itemToMove, parentKey: column.key }],
        };
      } else {
        return {
          ...column,
        };
      }
    });
    this.columnsSubject.next(this.columns);
  }
}
