import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddfolderPage } from './addfolder.page';

const routes: Routes = [
  {
    path: '',
    component: AddfolderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddfolderPageRoutingModule {}
