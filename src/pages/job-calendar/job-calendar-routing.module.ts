import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobCalendarPage } from './job-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: JobCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobCalendarPageRoutingModule {}
