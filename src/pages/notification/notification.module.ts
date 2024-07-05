import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TimeAgoPipe } from 'time-ago-pipe';
import { NotificationPageRoutingModule } from './notification-routing.module';
import { NotificationPage } from './notification.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [NotificationPage]
})
export class NotificationPageModule {}
