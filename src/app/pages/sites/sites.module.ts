import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SitesPageRoutingModule } from './sites-routing.module';

import { SitesPage } from './sites.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SitesPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [SitesPage]
})
export class SitesPageModule {}
