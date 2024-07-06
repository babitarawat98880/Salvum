import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagejobPageRoutingModule } from './managejob-routing.module';

import { ManagejobPage } from './managejob.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagejobPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [ManagejobPage]
})
export class ManagejobPageModule {}
