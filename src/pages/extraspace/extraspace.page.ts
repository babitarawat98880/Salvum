import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-extraspace',
  templateUrl: './extraspace.page.html',
  styleUrls: ['./extraspace.page.scss'],
})
export class ExtraspacePage {

  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  extraSpace = 'SpacePackages';
  extraSpaceArr:any=[];
  page_type: any;
  isBrowser = localStorage.getItem('isBrowser');
    constructor(public navCtrl: NavController,
       public http:HttpClient,
      public componentService: ComponentService,
      public APIService: APIService) {
    this.http = http;
    this.page_type = history.state.page_type;
    }
  
    ngOnInit() { 
          this.componentService.showLoader();
          return this.http.get(this.API_ENDPOINT_URL+this.extraSpace)
              .subscribe((data:any) => {
                console.log(data)
              this.componentService.dismissLoader()
               this.extraSpaceArr = data;
              },
              err => {
                 this.componentService.dismissLoader();
                  this.showTechnicalError();
              });
    }
  
     showTechnicalError(type = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');
    }
  
    GoToPayMentPage(extra){
      if(this.page_type == '1')
      {
        localStorage.setItem('preState', 'extra_space');
      }
      else
      {
        localStorage.setItem('preState', 'extra');
      }
      console.log(extra, "ex")
      this.navCtrl.navigateForward('payment', { state: { extra}} );
    }
  
    root(){
      this.navCtrl.navigateRoot(['dashboard', 0]);
    };
  
    package(){
      this.navCtrl.navigateRoot('pricing');
    };
  }