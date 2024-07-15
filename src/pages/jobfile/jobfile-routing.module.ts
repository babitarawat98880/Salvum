import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobfilePage } from './jobfile.page';

const routes: Routes = [
  {
    path: '',
    component: JobfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobfilePageRoutingModule {}
