import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobphotosPageRoutingModule } from './jobphotos-routing.module';

import { JobphotosPage } from './jobphotos.page';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobphotosPageRoutingModule,
    Ng2DropdownModule,
    OrderModule,
    SharedModuleModule
  ],
  declarations: [JobphotosPage]
})
export class JobphotosPageModule {}
