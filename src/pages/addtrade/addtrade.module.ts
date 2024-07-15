import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddtradePageRoutingModule } from './addtrade-routing.module';

import { AddtradePage } from './addtrade.page';
import { NgCalendarModule  } from 'ionic2-calendar';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddtradePageRoutingModule,
    NgCalendarModule,
    SharedModuleModule
  ],
  declarations: [AddtradePage]
})
export class AddtradePageModule {}
