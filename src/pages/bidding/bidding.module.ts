import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiddingPageRoutingModule } from './bidding-routing.module';

import { BiddingPage } from './bidding.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiddingPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [BiddingPage]
})
export class BiddingPageModule {}
