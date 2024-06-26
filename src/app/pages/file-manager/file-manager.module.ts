import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FileManagerPageRoutingModule } from './file-manager-routing.module';

import { FileManagerPage } from './file-manager.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileManagerPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [FileManagerPage]
})
export class FileManagerPageModule {}
