import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtcontPage } from './extcont.page';

const routes: Routes = [
  {
    path: '',
    component: ExtcontPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtcontPageRoutingModule {}
