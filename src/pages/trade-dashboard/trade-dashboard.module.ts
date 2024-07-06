import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeDashboardPageRoutingModule } from './trade-dashboard-routing.module';

import { TradeDashboardPage } from './trade-dashboard.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradeDashboardPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [TradeDashboardPage]
})
export class TradeDashboardPageModule {}
