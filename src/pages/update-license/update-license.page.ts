import { Component, OnInit } from '@angular/core';
import {  NavController,ToastController,LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';
@Component({
  selector: 'app-update-license',
  templateUrl: './update-license.page.html',
  styleUrls: ['./update-license.page.scss'],
})
export class UpdateLicensePage {
  userId:any;
  license_key:any;
    constructor(
      public navCtrl: NavController, 
      public loadingCtrl: LoadingController, 
      public toastCtrl: ToastController, 
      public route: ActivatedRoute, 
      public modalController:ModalController,
      public componentService:ComponentService,
      public APIService:APIService) {
      this.userId = localStorage.getItem('userinfo');
      this.route.queryParams.subscribe(params => {
        console.log(this.route.snapshot.paramMap.get('autoFilled'));
        this.license_key = this.route.snapshot.paramMap.get('autoFilled') 
      });
     
    }
  
    dismiss(status:any){
     this.modalController.dismiss(status);
    }
  
    clearVal(){
      this.license_key = '';
    }
  
    showTechnicalError(type :any){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');
    }
  
    addKey(license_key:any){
      if(license_key == undefined || license_key == ''){
      this.componentService.presentToast('Please enter license key.','danger'); 
             return false;
          }
          else{
            this.componentService.showLoader()
            var postData = {
              'licenseKey':license_key,
              'userId': this.userId
            }
            
            this.APIService.sendData('addLicenseKey',postData).subscribe((formdata:any)=>{
              this.componentService.dismissLoader();
              if(formdata.status == '1'){
                localStorage.setItem('job_alert_popup_on_job','1');
                this.dismiss('1');
              }
              else if(formdata.status == '2'){
            this.componentService.presentToast('Error, Invalid license key.','danger');

              }
              else if(formdata.status == '3'){
            this.componentService.presentToast('License key has expired,Please try another one.','danger');

              }
              else if(formdata.status == '4'){
            this.componentService.presentToast('License key is already in use,Please try another one.','danger');

              }
              else if(formdata.status == '5'){
            this.componentService.presentToast('You have already activated this license key.','danger');
              }
              else if(formdata.status == '9'){
            this.componentService.presentToast('You have already one active license key.','danger');

              }
              else {
            this.componentService.presentToast('Error, please try later.','danger');

              }
            },
            (err:any) => {
               this.componentService.dismissLoader()
                this.showTechnicalError('1');
            });
          }
    }
  }
  
