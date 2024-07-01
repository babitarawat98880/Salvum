import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassworddetailPage } from './passworddetail.page';

const routes: Routes = [
  {
    path: '',
    component: PassworddetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassworddetailPageRoutingModule {}
