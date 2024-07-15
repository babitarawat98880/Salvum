import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmailfilesPage } from './smailfiles.page';

const routes: Routes = [
  {
    path: '',
    component: SmailfilesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmailfilesPageRoutingModule {}
