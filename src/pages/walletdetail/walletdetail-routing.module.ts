import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletdetailPage } from './walletdetail.page';

const routes: Routes = [
  {
    path: '',
    component: WalletdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletdetailPageRoutingModule {}
