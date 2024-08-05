import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RfiMailsPageRoutingModule } from './rfi-mails-routing.module';

import { RfiMailsPage } from './rfi-mails.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RfiMailsPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [RfiMailsPage]
})
export class RfiMailsPageModule {}
