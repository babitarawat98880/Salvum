import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddtransmittalPageRoutingModule } from './addtransmittal-routing.module';
import { AddtransmittalPage } from './addtransmittal.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddtransmittalPageRoutingModule
  ],
  declarations: [AddtransmittalPage]
})
export class AddtransmittalPageModule {}
