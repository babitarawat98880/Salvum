import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassworddetailPageRoutingModule } from './passworddetail-routing.module';

import { PassworddetailPage } from './passworddetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassworddetailPageRoutingModule
  ],
  declarations: [PassworddetailPage]
})
export class PassworddetailPageModule {}
