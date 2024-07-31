import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilemanagerfilesPageRoutingModule } from './filemanagerfiles-routing.module';

import { FilemanagerfilesPage } from './filemanagerfiles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilemanagerfilesPageRoutingModule
  ],
  declarations: [FilemanagerfilesPage]
})
export class FilemanagerfilesPageModule {}
