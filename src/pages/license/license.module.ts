import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicensePageRoutingModule } from './license-routing.module';

import { LicensePage } from './license.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicensePageRoutingModule,
    SharedModuleModule
  ],
  declarations: [LicensePage]
})
export class LicensePageModule {}
