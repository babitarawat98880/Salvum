import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExportBidPageRoutingModule } from './export-bid-routing.module';

import { ExportBidPage } from './export-bid.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExportBidPageRoutingModule
  ],
  declarations: [ExportBidPage]
})
export class ExportBidPageModule {}
