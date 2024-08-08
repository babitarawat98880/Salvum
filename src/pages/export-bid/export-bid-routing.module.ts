import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExportBidPage } from './export-bid.page';

const routes: Routes = [
  {
    path: '',
    component: ExportBidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportBidPageRoutingModule {}
