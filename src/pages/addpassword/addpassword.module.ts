import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddpasswordPageRoutingModule } from './addpassword-routing.module';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

import { AddpasswordPage } from './addpassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModuleModule,
    AddpasswordPageRoutingModule
  ],
  declarations: [AddpasswordPage]
})
export class AddpasswordPageModule {}
