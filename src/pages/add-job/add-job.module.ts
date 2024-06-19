import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddJobPageRoutingModule } from './add-job-routing.module';
import { TagInputModule } from 'ngx-chips';
import { AddJobPage } from './add-job.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddJobPageRoutingModule,
    TagInputModule,
    ReactiveFormsModule
  ],
  declarations: [AddJobPage]
})
export class AddJobPageModule {}
