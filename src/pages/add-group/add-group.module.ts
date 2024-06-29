import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddGroupPageRoutingModule } from './add-group-routing.module';

import { AddGroupPage } from './add-group.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddGroupPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [AddGroupPage]
})
export class AddGroupPageModule {}
