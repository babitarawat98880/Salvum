import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RfiMailsPage } from './rfi-mails.page';

const routes: Routes = [
  {
    path: '',
    component: RfiMailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RfiMailsPageRoutingModule {}
