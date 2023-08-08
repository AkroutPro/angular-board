import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Paths } from './shared/enums/paths.enum';

const routes: Routes = [
  {
    path: Paths.board,
    loadChildren: () =>
      import('./board/board.module').then(mod => mod.BoardModule),
  },
  {
    path: '**',
    redirectTo: Paths.board,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
