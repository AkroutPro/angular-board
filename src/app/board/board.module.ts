import { NgModule } from '@angular/core';
import { BoardComponent } from './board.component';
import { BoardRoutingModule } from './board-routing.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoardService } from '../shared/services/board.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  BOARD_CONFIG,
  createBoardConfig,
} from '../shared/configs/board.config';

@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    BoardRoutingModule,
  ],
  providers: [
    {
      provide: BOARD_CONFIG,
      useFactory: createBoardConfig,
      deps: [FormBuilder], // Inject FormBuilder dependency
    },
    BoardService,
  ],
})
export class BoardModule {}
