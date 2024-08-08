import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewrfiPage } from './viewrfi.page';

const routes: Routes = [
  {
    path: '',
    component: ViewrfiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewrfiPageRoutingModule {}
