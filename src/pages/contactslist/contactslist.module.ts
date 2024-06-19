import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactslistPageRoutingModule } from './contactslist-routing.module';

import { ContactslistPage } from './contactslist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactslistPageRoutingModule
  ],
  declarations: [ContactslistPage]
})
export class ContactslistPageModule {}
