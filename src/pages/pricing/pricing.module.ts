import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PricingPageRoutingModule } from './pricing-routing.module';

import { PricingPage } from './pricing.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PricingPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [PricingPage]
})
export class PricingPageModule {}
