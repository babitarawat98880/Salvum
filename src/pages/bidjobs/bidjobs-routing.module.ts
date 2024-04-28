import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BidjobsPage } from './bidjobs.page';

const routes: Routes = [
  {
    path: '',
    component: BidjobsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BidjobsPageRoutingModule {}
