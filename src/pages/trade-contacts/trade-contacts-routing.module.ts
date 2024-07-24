import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeContactsPage } from './trade-contacts.page';

const routes: Routes = [
  {
    path: '',
    component: TradeContactsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeContactsPageRoutingModule {}
