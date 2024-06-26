import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BidjobsPageRoutingModule } from './bidjobs-routing.module';

import { BidjobsPage } from './bidjobs.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BidjobsPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [BidjobsPage]
})
export class BidjobsPageModule {}
