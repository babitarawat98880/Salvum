import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadfilePage } from './uploadfile.page';

const routes: Routes = [
  {
    path: '',
    component: UploadfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadfilePageRoutingModule {}
