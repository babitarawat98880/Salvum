import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddtransmittalPageRoutingModule } from './addtransmittal-routing.module';
import { AddtransmittalPage } from './addtransmittal.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddtransmittalPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [AddtransmittalPage]
})
export class AddtransmittalPageModule {}
