import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SitesdetailPageRoutingModule } from './sitesdetail-routing.module';

import { SitesdetailPage } from './sitesdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SitesdetailPageRoutingModule
  ],
  declarations: [SitesdetailPage]
})
export class SitesdetailPageModule {}
