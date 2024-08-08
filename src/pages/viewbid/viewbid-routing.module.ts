import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewbidPage } from './viewbid.page';

const routes: Routes = [
  {
    path: '',
    component: ViewbidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewbidPageRoutingModule {}
