import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { IonicModule } from '@ionic/angular';
import { SmallInboxPageRoutingModule } from './small-inbox-routing.module';
import { SmallInboxPage } from './small-inbox.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,
    IonicModule,
    SmallInboxPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [SmallInboxPage],
  
})
export class SmallInboxPageModule {}
