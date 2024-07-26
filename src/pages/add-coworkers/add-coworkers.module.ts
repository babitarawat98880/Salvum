import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCoworkersPageRoutingModule } from './add-coworkers-routing.module';

import { AddCoworkersPage } from './add-coworkers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCoworkersPageRoutingModule
  ],
  declarations: [AddCoworkersPage]
})
export class AddCoworkersPageModule {}
