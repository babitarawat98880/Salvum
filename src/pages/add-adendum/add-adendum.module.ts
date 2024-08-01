import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAdendumPageRoutingModule } from './add-adendum-routing.module';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { AddAdendumPage } from './add-adendum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModuleModule,
    AddAdendumPageRoutingModule
  ],
  declarations: [AddAdendumPage]
})
export class AddAdendumPageModule {}
