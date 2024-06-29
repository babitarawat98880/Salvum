import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SitesdetailPage } from './sitesdetail.page';

const routes: Routes = [
  {
    path: '',
    component: SitesdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SitesdetailPageRoutingModule {}
