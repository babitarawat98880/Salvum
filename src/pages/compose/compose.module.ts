import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComposePageRoutingModule } from './compose-routing.module';

import { CKEditorModule } from 'ng2-ckeditor';
import { TagInputModule } from 'ngx-chips';
import { ComposePage } from './compose.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CKEditorModule,
    TagInputModule, 
    ComposePageRoutingModule,
    SharedModuleModule
  ],
  declarations: [ComposePage]
})
export class ComposePageModule {}
