import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmailfilesPageRoutingModule } from './smailfiles-routing.module';

import { SmailfilesPage } from './smailfiles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmailfilesPageRoutingModule
  ],
  declarations: [SmailfilesPage]
})
export class SmailfilesPageModule {}
