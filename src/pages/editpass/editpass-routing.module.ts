import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditpassPage } from './editpass.page';

const routes: Routes = [
  {
    path: '',
    component: EditpassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditpassPageRoutingModule {}
