import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagejobPage } from './managejob.page';

const routes: Routes = [
  {
    path: '',
    component: ManagejobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagejobPageRoutingModule {}
