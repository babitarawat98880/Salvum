import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RfisPageRoutingModule } from './rfis-routing.module';

import { RfisPage } from './rfis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RfisPageRoutingModule
  ],
  declarations: [RfisPage]
})
export class RfisPageModule {}
