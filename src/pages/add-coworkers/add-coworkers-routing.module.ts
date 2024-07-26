import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCoworkersPage } from './add-coworkers.page';

const routes: Routes = [
  {
    path: '',
    component: AddCoworkersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCoworkersPageRoutingModule {}
