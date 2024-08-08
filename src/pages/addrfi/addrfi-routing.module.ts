import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddrfiPage } from './addrfi.page';

const routes: Routes = [
  {
    path: '',
    component: AddrfiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddrfiPageRoutingModule {}
