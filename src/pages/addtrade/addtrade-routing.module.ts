import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddtradePage } from './addtrade.page';

const routes: Routes = [
  {
    path: '',
    component: AddtradePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddtradePageRoutingModule {}
