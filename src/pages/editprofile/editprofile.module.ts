import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditprofilePageRoutingModule } from './editprofile-routing.module';
import { EditprofilePage } from './editprofile.page';
import { FileUploadModule } from "ng2-file-upload"; 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileUploadModule,
    EditprofilePageRoutingModule
  ],
  declarations: [EditprofilePage]
})
export class EditprofilePageModule {}
