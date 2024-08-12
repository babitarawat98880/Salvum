import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RfisPageRoutingModule } from './rfis-routing.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
import { RfisPage } from './rfis.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
// import { PdfmakeModule } from 'ng-pdf-make';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RfisPageRoutingModule,
    Ng2DropdownModule,
    OrderModule,
    SharedModuleModule
  ],
  declarations: [RfisPage]
})
export class RfisPageModule {}
