import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagegroupPageRoutingModule } from './managegroup-routing.module';

import { ManagegroupPage } from './managegroup.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagegroupPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [ManagegroupPage]
})
export class ManagegroupPageModule {}
