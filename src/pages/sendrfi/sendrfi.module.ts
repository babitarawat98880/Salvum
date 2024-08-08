import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendrfiPageRoutingModule } from './sendrfi-routing.module';

import { SendrfiPage } from './sendrfi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendrfiPageRoutingModule
  ],
  declarations: [SendrfiPage]
})
export class SendrfiPageModule {}
