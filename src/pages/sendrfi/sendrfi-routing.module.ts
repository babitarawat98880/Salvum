import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendrfiPage } from './sendrfi.page';

const routes: Routes = [
  {
    path: '',
    component: SendrfiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendrfiPageRoutingModule {}
