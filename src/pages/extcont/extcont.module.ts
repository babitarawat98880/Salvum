import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtcontPageRoutingModule } from './extcont-routing.module';

import { ExtcontPage } from './extcont.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtcontPageRoutingModule
  ],
  declarations: [ExtcontPage]
})
export class ExtcontPageModule {}
