import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagegroupPageRoutingModule } from './managegroup-routing.module';

import { ManagegroupPage } from './managegroup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagegroupPageRoutingModule
  ],
  declarations: [ManagegroupPage]
})
export class ManagegroupPageModule {}
