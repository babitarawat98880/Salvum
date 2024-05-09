import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagegroupPage } from './managegroup.page';

const routes: Routes = [
  {
    path: '',
    component: ManagegroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagegroupPageRoutingModule {}
