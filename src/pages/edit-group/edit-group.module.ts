import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditGroupPageRoutingModule } from './edit-group-routing.module';

import { EditGroupPage } from './edit-group.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditGroupPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [EditGroupPage]
})
export class EditGroupPageModule {}
