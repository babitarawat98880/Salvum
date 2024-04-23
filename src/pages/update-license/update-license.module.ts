import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateLicensePageRoutingModule } from './update-license-routing.module';

import { UpdateLicensePage } from './update-license.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateLicensePageRoutingModule
  ],
  declarations: [UpdateLicensePage]
})
export class UpdateLicensePageModule {}
