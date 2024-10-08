import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewbidPageRoutingModule } from './viewbid-routing.module';

import { ViewbidPage } from './viewbid.page';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
import { ExpandableListModule } from 'angular2-expandable-list';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewbidPageRoutingModule,
    Ng2DropdownModule,
    OrderModule,
    SharedModuleModule
    // ExpandableListModule
  ],
  declarations: [ViewbidPage]
})
export class ViewbidPageModule {}
