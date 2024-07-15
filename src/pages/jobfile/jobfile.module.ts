import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobfilePageRoutingModule } from './jobfile-routing.module';

import { JobfilePage } from './jobfile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobfilePageRoutingModule
  ],
  declarations: [JobfilePage]
})
export class JobfilePageModule {}
