import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../components/header/header.component';
// import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import { FooterComponent } from '../components/footer/footer.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { EmailMenuComponent } from '../../pages/email-menu/email-menu.component';

@NgModule({
  declarations: [HeaderComponent,FooterComponent, EmailMenuComponent],
  imports: [CommonModule, IonicModule, FileUploadModule],
  exports: [HeaderComponent,FooterComponent, IonicModule, FileUploadModule,EmailMenuComponent]
})
export class SharedModuleModule { }
