import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeContactsPageRoutingModule } from './trade-contacts-routing.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
import { TradeContactsPage } from './trade-contacts.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2DropdownModule,
    OrderModule,
    TradeContactsPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [TradeContactsPage]
})
export class TradeContactsPageModule {}
