import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobphotosPage } from './jobphotos.page';

const routes: Routes = [
  {
    path: '',
    component: JobphotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobphotosPageRoutingModule {}
