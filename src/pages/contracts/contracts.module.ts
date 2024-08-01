import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractsPageRoutingModule } from './contracts-routing.module';

import { ContractsPage } from './contracts.page';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractsPageRoutingModule,
    Ng2DropdownModule,
    OrderModule,
  ],
  declarations: [ContractsPage]
})
export class ContractsPageModule {}
