import { NgModule, } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx/index';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Device } from '@ionic-native/device';
import { DatePipe } from '@angular/common';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
// import { DragulaModule } from 'ng2-dragula';
import { PushNotificationModule } from 'ng-push-notification';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PushNotificationModule.forRoot({
      dir: 'auto',
      lang: 'en-US',
      renotify: false,
      sticky: false,
      noscreen: false,
      silent: true,
      closeDelay: 6000,
      icon: 'assets/img/logo-icon.png'
  }),
    // DragulaModule.forRoot()
  ],
  providers: [
      Camera,
      File,
      FileTransfer,
      FilePath,
      DatePipe,
      //{provide: ErrorHandler, useClass: IonicErrorHandler},
      // Camera,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
