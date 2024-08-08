import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AskEnggPageRoutingModule } from './ask-engg-routing.module';

import { AskEnggPage } from './ask-engg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AskEnggPageRoutingModule
  ],
  declarations: [AskEnggPage]
})
export class AskEnggPageModule {}
