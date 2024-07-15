import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupslistPage } from './groupslist.page';

const routes: Routes = [
  {
    path: '',
    component: GroupslistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupslistPageRoutingModule {}
