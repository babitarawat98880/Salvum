import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeDashboardPageRoutingModule } from './trade-dashboard-routing.module';

import { TradeDashboardPage } from './trade-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradeDashboardPageRoutingModule
  ],
  declarations: [TradeDashboardPage]
})
export class TradeDashboardPageModule {}
