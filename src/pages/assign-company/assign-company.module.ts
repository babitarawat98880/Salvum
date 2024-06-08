import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignCompanyPageRoutingModule } from './assign-company-routing.module';

import { AssignCompanyPage } from './assign-company.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignCompanyPageRoutingModule
  ],
  declarations: [AssignCompanyPage]
})
export class AssignCompanyPageModule {}
