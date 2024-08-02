import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdendumPageRoutingModule } from './adendum-routing.module';

import { AdendumPage } from './adendum.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdendumPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [AdendumPage]
})
export class AdendumPageModule {}
