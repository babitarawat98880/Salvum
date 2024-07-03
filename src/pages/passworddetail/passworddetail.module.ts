import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassworddetailPageRoutingModule } from './passworddetail-routing.module';

import { PassworddetailPage } from './passworddetail.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassworddetailPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [PassworddetailPage]
})
export class PassworddetailPageModule {}
