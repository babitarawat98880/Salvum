import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvitemailPage } from './invitemail.page';

const routes: Routes = [
  {
    path: '',
    component: InvitemailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitemailPageRoutingModule {}
