import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddtransmittalPage } from './addtransmittal.page';

const routes: Routes = [
  {
    path: '',
    component: AddtransmittalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddtransmittalPageRoutingModule {}
