import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadfilePageRoutingModule } from './uploadfile-routing.module';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { UploadfilePage } from './uploadfile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModuleModule,
    UploadfilePageRoutingModule
  ],
  declarations: [UploadfilePage]
})
export class UploadfilePageModule {}
