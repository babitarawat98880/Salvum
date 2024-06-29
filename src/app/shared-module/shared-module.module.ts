import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../components/header/header.component';
// import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, IonicModule],
  exports: [HeaderComponent, IonicModule,FileUploadModule]
})
export class SharedModuleModule { }
