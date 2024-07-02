import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditprofilePageRoutingModule } from './editprofile-routing.module';
import { EditprofilePage } from './editprofile.page';
import { FileUploadModule } from "ng2-file-upload"; 
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileUploadModule,
    EditprofilePageRoutingModule,
    SharedModuleModule
  ],
  declarations: [EditprofilePage]
})
export class EditprofilePageModule {}
