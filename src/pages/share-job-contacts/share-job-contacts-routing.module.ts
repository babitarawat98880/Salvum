import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareJobContactsPage } from './share-job-contacts.page';

const routes: Routes = [
  {
    path: '',
    component: ShareJobContactsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareJobContactsPageRoutingModule {}
