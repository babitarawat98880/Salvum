import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitemailPageRoutingModule } from './invitemail-routing.module';

import { InvitemailPage } from './invitemail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvitemailPageRoutingModule
  ],
  declarations: [InvitemailPage]
})
export class InvitemailPageModule {}
