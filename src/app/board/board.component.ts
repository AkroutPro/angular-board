import { Component, inject } from '@angular/core';
import { ColumnModel } from '../shared/models/column.model';
import { Observable } from 'rxjs';
import { BoardService } from '../shared/services/board.service';
import { ItemModel } from '../shared/models/item.model';
import { map } from 'rxjs/operators';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  private readonly boardService = inject(BoardService);
  columns$: Observable<ColumnModel[]> = this.boardService.getColumns().pipe(
    map(columns =>
      columns.map(column => {
        const sortedItems = [...column.items].sort(
          (a, b) => a.number - b.number
        );
        return { ...column, items: sortedItems };
      })
    )
  );

  addNewItemByColumn(column: ColumnModel): void {
    this.boardService.addNewItemByColumn(column);
  }

  removeItem(item: ItemModel): void {
    this.boardService.removeItem(item);
  }

  startEditItem(item: ItemModel): void {
    item.editedNumber = item.number;
    item.editing = true;
  }

  confirmItemEdit(item: ItemModel): void {
    this.boardService.updateItem(item);
  }

  cancelItemEdit(item: ItemModel): void {
    item.editing = false;
  }

  onDrop(event: CdkDragDrop<ItemModel[]>): void {
    if (event.previousContainer === event.container) {
      // Moved within the same column
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const sourceColumn = event.item.data.column; // Get the source column
      const itemToMove = event.item.data.item; // Get the item being dragged
      // Moved to a different column
      transferArrayItem(
        sourceColumn.items,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.boardService.moveItemToColumn(event.container.id, itemToMove);
    }
  }
  getConnectedListIds(columns: ColumnModel[], columnKey: string): string[] {
    // to fix (use the columns observable subscription instead)
    return columns.filter(col => col.key !== columnKey).map(col => col.key);
  }
}
