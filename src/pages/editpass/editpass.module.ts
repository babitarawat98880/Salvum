import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

import { EditpassPageRoutingModule } from './editpass-routing.module';

import { EditpassPage } from './editpass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModuleModule,
    EditpassPageRoutingModule
  ],
  declarations: [EditpassPage]
})
export class EditpassPageModule {}
