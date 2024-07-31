import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddfolderPageRoutingModule } from './addfolder-routing.module';

import { AddfolderPage } from './addfolder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddfolderPageRoutingModule
  ],
  declarations: [AddfolderPage]
})
export class AddfolderPageModule {}
