import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupslistPageRoutingModule } from './groupslist-routing.module';

import { GroupslistPage } from './groupslist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GroupslistPageRoutingModule
  ],
  declarations: [GroupslistPage]
})
export class GroupslistPageModule {}
