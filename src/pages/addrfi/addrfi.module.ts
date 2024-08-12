import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddrfiPageRoutingModule } from './addrfi-routing.module';

import { AddrfiPage } from './addrfi.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddrfiPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [AddrfiPage]
})
export class AddrfiPageModule {}
