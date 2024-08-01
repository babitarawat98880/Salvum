import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdendumPageRoutingModule } from './adendum-routing.module';

import { AdendumPage } from './adendum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdendumPageRoutingModule
  ],
  declarations: [AdendumPage]
})
export class AdendumPageModule {}
