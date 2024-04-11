import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEmailPageRoutingModule } from './add-email-routing.module';

import { AddEmailPage } from './add-email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEmailPageRoutingModule
  ],
  declarations: [AddEmailPage]
})
export class AddEmailPageModule {}
