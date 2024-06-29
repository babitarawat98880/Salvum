import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

import { AddwebsitePageRoutingModule } from './addwebsite-routing.module';
import { AddwebsitePage } from './addwebsite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModuleModule,
    AddwebsitePageRoutingModule
  ],
  declarations: [AddwebsitePage]
})
export class AddwebsitePageModule {}
