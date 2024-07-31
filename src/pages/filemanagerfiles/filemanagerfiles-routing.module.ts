import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilemanagerfilesPage } from './filemanagerfiles.page';

const routes: Routes = [
  {
    path: '',
    component: FilemanagerfilesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilemanagerfilesPageRoutingModule {}
