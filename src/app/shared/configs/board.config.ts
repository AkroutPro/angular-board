import { InjectionToken } from '@angular/core';
import { FormBuilder } from '@angular/forms'; // Make sure to import FormBuilder and FormGroup
import { ColumnModel } from '../models/column.model';

export interface BoardConfig {
  columns: ColumnModel[];
}
export function createBoardConfig(formBuilder: FormBuilder): BoardConfig {
  return {
    columns: [
      {
        name: 'Column1',
        key: 'col1',
        items: [],
        form: formBuilder.group({ newNumber: null }),
      },
      {
        name: 'Column2',
        key: 'col2',
        items: [],
        form: formBuilder.group({ newNumber: null }),
      },
      {
        name: 'Column3',
        key: 'col3',
        items: [],
        form: formBuilder.group({ newNumber: null }),
      },
    ],
  };
}

// Token to inject
export const BOARD_CONFIG = new InjectionToken<BoardConfig>('board.config');
