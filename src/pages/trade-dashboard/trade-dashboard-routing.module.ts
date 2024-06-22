import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeDashboardPage } from './trade-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: TradeDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeDashboardPageRoutingModule {}
