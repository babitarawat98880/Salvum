import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletdetailPageRoutingModule } from './walletdetail-routing.module';

import { WalletdetailPage } from './walletdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletdetailPageRoutingModule
  ],
  declarations: [WalletdetailPage]
})
export class WalletdetailPageModule {}
