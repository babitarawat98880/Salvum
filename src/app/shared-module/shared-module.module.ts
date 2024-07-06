import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../components/header/header.component';
// import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeAgoPipe } from 'time-ago-pipe';
import { EmailMenuComponent } from '../../pages/email-menu/email-menu.component';

@NgModule({
  declarations: [HeaderComponent, EmailMenuComponent],
  imports: [CommonModule, IonicModule],
  exports: [HeaderComponent, IonicModule, FileUploadModule, EmailMenuComponent]
})
export class SharedModuleModule { }
