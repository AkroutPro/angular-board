import { ItemModel } from './item.model';
import { FormGroup } from '@angular/forms';

export interface ColumnModel {
  key: string;
  name: string;
  items: ItemModel[];
  form: FormGroup;
}
