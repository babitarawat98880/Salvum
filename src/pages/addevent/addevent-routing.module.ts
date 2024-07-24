import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddeventPage } from './addevent.page';

const routes: Routes = [
  {
    path: '',
    component: AddeventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddeventPageRoutingModule {}
