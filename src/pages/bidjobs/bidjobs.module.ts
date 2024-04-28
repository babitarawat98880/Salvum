import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BidjobsPageRoutingModule } from './bidjobs-routing.module';

import { BidjobsPage } from './bidjobs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BidjobsPageRoutingModule
  ],
  declarations: [BidjobsPage]
})
export class BidjobsPageModule {}
