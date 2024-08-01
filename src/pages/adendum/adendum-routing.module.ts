import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdendumPage } from './adendum.page';

const routes: Routes = [
  {
    path: '',
    component: AdendumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdendumPageRoutingModule {}
