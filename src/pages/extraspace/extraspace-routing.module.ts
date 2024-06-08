import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtraspacePage } from './extraspace.page';

const routes: Routes = [
  {
    path: '',
    component: ExtraspacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtraspacePageRoutingModule {}
