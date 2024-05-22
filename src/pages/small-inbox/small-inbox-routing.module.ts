import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmallInboxPage } from './small-inbox.page';

const routes: Routes = [
  {
    path: '',
    component: SmallInboxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmallInboxPageRoutingModule {}
