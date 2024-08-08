import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewrfiPageRoutingModule } from './viewrfi-routing.module';

import { ViewrfiPage } from './viewrfi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewrfiPageRoutingModule
  ],
  declarations: [ViewrfiPage]
})
export class ViewrfiPageModule {}
