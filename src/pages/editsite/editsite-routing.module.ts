import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditsitePage } from './editsite.page';

const routes: Routes = [
  {
    path: '',
    component: EditsitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditsitePageRoutingModule {}
