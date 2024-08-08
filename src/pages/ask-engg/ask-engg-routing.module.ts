import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AskEnggPage } from './ask-engg.page';

const routes: Routes = [
  {
    path: '',
    component: AskEnggPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AskEnggPageRoutingModule {}
