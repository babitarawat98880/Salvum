import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtraspacePageRoutingModule } from './extraspace-routing.module';

import { ExtraspacePage } from './extraspace.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtraspacePageRoutingModule
  ],
  declarations: [ExtraspacePage]
})
export class ExtraspacePageModule {}
