import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SitesdetailPageRoutingModule } from './sitesdetail-routing.module';

import { SitesdetailPage } from './sitesdetail.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SitesdetailPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [SitesdetailPage]
})
export class SitesdetailPageModule {}
