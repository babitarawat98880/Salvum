import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, ModalController, AlertController} from '@ionic/angular';
import {Http} from '@angular/http';
// import { AlllicenseserviceProvider } from '../../providers/alllicenseservice/alllicenseservice';
import { EventService } from '../../services/event.service';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';

import * as copy from 'copy-to-clipboard';
@Component({
  selector: 'app-license',
  templateUrl: './license.page.html',
  styleUrls: ['./license.page.scss'],
})
export class LicensePage  {
  licenses:any = [];
  shared_licenses: any;
  subscription_amount:any;
  currentDate:any;
  showAssigned:any = '0';
  showAssigned_shared:any = '0';
  autoFilled:any;
  loginId:any = localStorage.getItem('userinfo');
  isBrowser = localStorage.getItem('isBrowser');
  assignLicense:any = [];
  assignLicense1:any= [];
  constructor(
    public navCtrl: NavController,
    public componentService:ComponentService, 
    public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController, 
    public modalCtrl:ModalController, 
    public alertCtrl:AlertController, 
    public events: EventService,
    public APIService:APIService) {
    // this.http = http;
    var date = new Date().toISOString();;
    this.currentDate = Date.parse(date);
    this.getAllLicenses();
    this.getUsersubscriptions();
  }

  ionViewDidLoad() {
   
  };

  showTechnicalError(type = null || ''){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please '+msg,'info')
  }

  getAllLicenses(){
   this.componentService.showLoader();
    var userId = localStorage.getItem('userinfo');
    var companyId = localStorage.getItem('switched_comp');
  
    this.APIService.getData('getUserLicenses',userId+'/'+companyId+'/'+'0').subscribe((data:any)=>{
        this.licenses = data;
        this.APIService.getData('getUserLicenses',userId+'/'+companyId+'/'+'1').subscribe((shared_data:any)=>{
           this.componentService.dismissLoader();
            this.shared_licenses = shared_data;
            console.log(shared_data)
            var autoFilled = ''; 
            var showAssigned = '0';
            var showAssigned_shared = '0';
            var currentDate = this.currentDate;
            if(this.licenses.length > 0)
            {
              data.forEach(function(myLicenses:any){
                if(currentDate < myLicenses.status && showAssigned == '0')
                {
                  showAssigned = '1';
                }
                if(myLicenses.user_name !== null)
                {
                  if(myLicenses.usedBy == userId)
                  {
                     autoFilled = myLicenses.license_number;
                  }
                }
              });
              this.autoFilled = autoFilled;
              this.showAssigned = showAssigned;
            }

            if(this.shared_licenses.length > 0)
            {
              // console.log(this.shared_licenses)
              this.shared_licenses.forEach(function(myLicenses:any){
                if(myLicenses.privileges.indexOf(userId) >= 0 && showAssigned_shared == '0')
                {           
                  showAssigned_shared = '1';
                }
                if(myLicenses.user_name !== null)
                {
                  if(myLicenses.usedBy == userId)
                  {
                     autoFilled = myLicenses.license_number;
                  }
                }
              });
              this.autoFilled = autoFilled;
              this.showAssigned_shared = showAssigned_shared;
            }
            
        },
        (err:any) => {
            this.componentService.dismissLoader();
            this.showTechnicalError();
        });
    },
    err => {
       this.componentService.dismissLoader();
        this.showTechnicalError();
    });
  }

  async deActivateLicense(licenseId:any){
    let confirm = await this.alertCtrl.create({
      header: 'Are you sure you want to unassign this license?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.componentService.showLoader();
            var data = {
              'licenseId':licenseId,
              'userId': this.loginId
            }
            this.APIService.sendData('deActivateLicense',data).subscribe((result:any)=>{
              if(result.status == 1){
                this.componentService.dismissLoader();
                this.componentService.presentToast('License unassigned successfully.', 'success')
                this.getAllLicenses();
              }
              else{
                  this.componentService.dismissLoader();
                  this.componentService.presentToast('Error, plz try later.', 'danger')
                
              }
            },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    await confirm.present();
  }

  getUsersubscriptions(){
    var userId = localStorage.getItem('userinfo');
    this.APIService.getData('getUserCurrentSubscription',userId).subscribe((subscription:any)=>{  
      this.subscription_amount = subscription.amount;
    },
    (err:any) => {
        this.showTechnicalError();
    });
  }

  openAddmorelicensePage(){
    if(this.subscription_amount > '0')
    {
      this.navCtrl.navigateForward('AddmorelicensePage');
    }
    else
    {
      this.componentService.presentToast('Access Denied,Please upgrade your package first.','info');
    }
  };
  
  root(){
    this.navCtrl.navigateRoot('DashboardPage');
  };

  parseDate(license:any, date:any){
    license.status = Date.parse(date);
    //console.log(license);
    return;
  };

  async updateLicense(){
    let modal = await this.modalCtrl.create({ 
    component: 'UpdateLicensePage',
    componentProps:{   autoFilled:this.autoFilled
    }});
  
    modal.onDidDismiss().then((data:any)  => {
      if(data != null &&data != undefined)
      {
        if(data == '1')
        {
          this.getAllLicenses();
          this.events.publish('is_license_activated:changed', '');
          this.componentService.presentToast('License has been updated successfully.','success');
        }
      }
   });
    await modal.present();
  }

  listCheckbox(isChecked:any, license:any){
    if (this.assignLicense.indexOf(license._id) == -1) {
      this.assignLicense.push(license._id);
    } else {
      for (var i = 0; i < this.assignLicense.length; i++) {
          if (this.assignLicense[i] == license._id) {
              this.assignLicense.splice(i, 1);
          }
      }
    }
  };

  listCheckbox1(isChecked:any, license:any){

    if (this.assignLicense1.indexOf(license._id) == -1) {
      this.assignLicense1.push(license._id);
    } else {
      for (var i = 0; i < this.assignLicense1.length; i++) {
          if (this.assignLicense1[i] == license._id) {
              this.assignLicense1.splice(i, 1);
          }
      }
    }
  };

  assignLicenseToUsers(type:any){
    if(type == '1')
    {
      if(this.assignLicense.length == 0){
        this.componentService.presentToast('Select atleast one record.','info')
  
      }
      else
      {
        this.callAssignLicense(type);
      }
    }
    else if(type == '0')
    {
      if(this.assignLicense1.length == 0){
        this.componentService.presentToast('Select atleast one record.','info')
      }
      else
      {
        this.callAssignLicense(type);
      }
    }
  }

  async callAssignLicense(type:any)
  {
    var assignLicenses:any = [];
      if(type == '1')
      {
        assignLicenses = this.assignLicense;
      }
      else
      {
        assignLicenses = this.assignLicense1;
      }
      //var userId = localStorage.getItem('userinfo'); 
      let modal = await this.modalCtrl.create({ 
        component: 'ContactslistPage',
        componentProps:{  license_page : '1',
        page_type : type
        }});
      
        modal.onDidDismiss().then((data:any)  => {
      
        if(data != null && data != undefined)
        {
          if(data.length != undefined)
          {
           this.componentService.showLoader();
            var contacts:any = [];
            var privileges:any= [];
            for(var i=0; i < data.length; i++){
              contacts.push(data[i].userId);
              if(data[i].privilege == '1')
              {
                privileges.push(data[i].userId);
              }
            }
            var userName = localStorage.getItem('userName');
            var loginid = localStorage.getItem('userinfo');
            var sendData = {
              licenses: assignLicenses,
               contacts: contacts,
                userName: userName, 
                privileges: privileges, 
                oginId: loginid} 
            this.APIService.sendData('assignLicense',sendData).subscribe((data:any)=>{
              this.componentService.dismissLoader();
              if(data.n == '1')
              {
                this.getAllLicenses();
                this.assignLicense = [];
                this.assignLicense1 = [];
                this.componentService.presentToast('Licenses has been assigned successfully.','success')
          
              }
              else
              {
                this.componentService.presentToast('Error, please try later.','danger')

            
              }
            },
            (err:any) => {
               this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
          }
        }
      });
     await modal.present();
  }

  async removeUser(licenseId:any,userId:any)
  { 
    let confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.componentService.showLoader();
            var loginId = localStorage.getItem('userinfo');
            var data = {
            'licenseId':licenseId,
            'userId': userId,
            'loginId': loginId
            }
            this.APIService.sendData('removeUserFromLicense', data).subscribe((deleted:any)=>{
              if(deleted.status == 1)
              {
             this.componentService.dismissLoader();
             this.componentService.presentToast('User unassigned successfully.','success')
             this.getAllLicenses();
              }
              else
              {
                 this.componentService.dismissLoader();
                 this.componentService.presentToast('Error, plz try later.','danger')

              }
            },
            (err:any) => {
               this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    await confirm.present();
  }

  copyKey(licenseKey:any)
  {
    copy(licenseKey);
    copy(licenseKey);
    this.componentService.presentToast('Copy to clipboard.','success');
  }

  async removeAssignedLicense(licenseId:any,userId:any)
  {
    let confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
           this.componentService.showLoader();
            var loginId = localStorage.getItem('userinfo');
            var data = {
              'licenseId':licenseId,
              'userId': userId,
              'loginId': loginId
              }
            this.APIService.sendData('removeUserFromLicense', data).subscribe((deleted:any)=>{
              if(deleted.status == 1)
              {
               this.componentService.dismissLoader();
               this.componentService.presentToast('License updated successfully.','success');

                   this.getAllLicenses();
              }
              else
              {
                this.componentService.dismissLoader();
                this.componentService.presentToast( 'Error, plz try later.','danger');
                  
              }
            },
            (err:any) => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    await confirm.present();
  }
}
