import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradePageRoutingModule } from './trade-routing.module';

import { TradePage } from './trade.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradePageRoutingModule,
    SharedModuleModule
  ],
  declarations: [TradePage]
})
export class TradePageModule {}
