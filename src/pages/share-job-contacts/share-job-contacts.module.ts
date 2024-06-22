import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShareJobContactsPageRoutingModule } from './share-job-contacts-routing.module';

import { ShareJobContactsPage } from './share-job-contacts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareJobContactsPageRoutingModule
  ],
  declarations: [ShareJobContactsPage]
})
export class ShareJobContactsPageModule {}
