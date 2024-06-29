import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditsitePageRoutingModule } from './editsite-routing.module';

import { EditsitePage } from './editsite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditsitePageRoutingModule
  ],
  declarations: [EditsitePage]
})
export class EditsitePageModule {}
