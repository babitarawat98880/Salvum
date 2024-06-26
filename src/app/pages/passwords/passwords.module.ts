import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordsPageRoutingModule } from './passwords-routing.module';

import { PasswordsPage } from './passwords.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordsPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [PasswordsPage]
})
export class PasswordsPageModule {}
