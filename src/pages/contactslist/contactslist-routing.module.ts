import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactslistPage } from './contactslist.page';

const routes: Routes = [
  {
    path: '',
    component: ContactslistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactslistPageRoutingModule {}
