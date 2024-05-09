import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';
import { map } from "rxjs/operators";
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage  {
  data:any =[];
  license: any = [];
  extraSpace:any =[];
  dataLength:any;
  pack_data:any = [];
  isExtraspace:any;
  isBrowser:any;
  getUserMembership='getUserMembership';
  getUserLicensesData='getUserLicensesData';
  getSpacePackages='getSpacePackages';
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  constructor(
    public toastCtrl: ToastController,
     public navCtrl: NavController,
     public componentService:ComponentService,
     public loadingCtrl: LoadingController,
     public http:HttpClient,
     public APIService:APIService) {
  }

  ngOnInit() {
   this.isBrowser = localStorage.getItem('isBrowser');
    this.componentService.showLoader()
      var userId = localStorage.getItem('userinfo');
      this.APIService.getData(this.getUserMembership,userId).subscribe((data:any)=>{
        this.data = data;
        console.log(data)
        var packs_data:any = [];
        data.forEach(function(pack_data:any){
          if(pack_data.amount > 0)
          {
            packs_data.push(pack_data);
          }
        });
        this.pack_data = packs_data;
        this.APIService.getData(this.getUserLicensesData,userId).subscribe((data:any)=>{
            var unique:any = [];
            data.forEach(function(d:any) {
              var found = false;
                unique.forEach(function(u:any) {
                    if(u.transactionId == d.transactionId) {
                        found = true;
                    }
                });
                if(!found) {
                    unique.push(d);
                }
            });
            this.license = unique;
            this.APIService.getData(this.getSpacePackages,userId).subscribe((data:any)=>{
            this.componentService.dismissLoader()
             this.isExtraspace = data;
              for (var i = 0; i < data.length; i += 1) {
                var todayDate = new Date(data[i].created_date).toISOString().slice(0,10);
                data[i].created_date = todayDate
                this.extraSpace = data;
              }
            })  
        })
      }, (err:any) => {
        this.componentService.dismissLoader()
         this.showTechnicalError();
     })
     
    }

  showTechnicalError(type = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast( 'Technical error, Please '+msg,'info');
  }

  root(){
    this.navCtrl.navigateRoot('dashboard');
  };
}
