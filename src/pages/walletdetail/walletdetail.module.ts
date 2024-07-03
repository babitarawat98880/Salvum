import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletdetailPageRoutingModule } from './walletdetail-routing.module';

import { WalletdetailPage } from './walletdetail.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletdetailPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [WalletdetailPage]
})
export class WalletdetailPageModule {}
