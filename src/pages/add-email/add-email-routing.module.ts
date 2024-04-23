import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEmailPage } from './add-email.page';

const routes: Routes = [
  {
    path: '',
    component: AddEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEmailPageRoutingModule {}
