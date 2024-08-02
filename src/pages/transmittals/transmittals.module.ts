import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransmittalsPageRoutingModule } from './transmittals-routing.module';

import { TransmittalsPage } from './transmittals.page';

import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2DropdownModule,
    OrderModule,
    TransmittalsPageRoutingModule
  ],
  declarations: [TransmittalsPage]
})
export class TransmittalsPageModule {}
