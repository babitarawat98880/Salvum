import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignCompanyPage } from './assign-company.page';

const routes: Routes = [
  {
    path: '',
    component: AssignCompanyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignCompanyPageRoutingModule {}
