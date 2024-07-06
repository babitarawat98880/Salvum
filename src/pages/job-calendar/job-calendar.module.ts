import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JobCalendarPageRoutingModule } from './job-calendar-routing.module';
import { NgCalendarModule  } from 'ionic2-calendar';
import { JobCalendarPage } from './job-calendar.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
    JobCalendarPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [JobCalendarPage]
})
export class JobCalendarPageModule {}
