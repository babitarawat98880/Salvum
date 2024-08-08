import { Component, OnInit } from '@angular/core';
import { NavController, NavParams , ModalController, AlertController,ToastController,LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-share-job-contacts',
  templateUrl: './share-job-contacts.page.html',
  styleUrls: ['./share-job-contacts.page.scss'],
})
export class ShareJobContactsPage {

  all_contacts:any = [];
  selected_contacts:any = [];
  userId:any;
  companyId:any;
  enable_level1:any;
  enable_level2:any;
  enable_level3:any;
  enable_level4:any;
  allowed_levels:any;
    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams , 
      public modalController: ModalController, 
      public componentService: ComponentService, 
      public alertCtrl: AlertController, 
      public toastCtrl: ToastController,
      public APIService: APIService) {
      var All_contacts:any = [];
      this.userId = localStorage.getItem('userinfo');
      this.companyId = navParams.get('companyId');
      this.allowed_levels = [];
      var levels_array = JSON.parse(localStorage.getItem('alllevel') ||'');
      if(levels_array){
        levels_array.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, this.userId);
          if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
            this.enable_level1  = 'false';
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
            this.enable_level2  = 'false';
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
            this.enable_level3  = 'false';
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
            this.enable_level4  = 'false';
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
            this.enable_level1 = 'true';
            this.enable_level2 = 'true';
            this.enable_level3 = 'true';
            this.enable_level4 = 'true';
          }
        });
      }
  
      if(this.enable_level1 == 'false') 
      {
        this.allowed_levels.push('1');
      }
      if(this.enable_level2 == 'false')
      {
        this.allowed_levels.push('2');
      }
      if(this.enable_level3 == 'false')
      {
        this.allowed_levels.push('3');
      }
      if(this.enable_level4 == 'false')
      {
        this.allowed_levels.push('4');
      }
  
      var allowed_levels = this.allowed_levels;
      this.componentService.showLoader();
      this.APIService.getData('associateEmployeesList',this.companyId+'/'+this.userId).subscribe((allEmployees:any)=>{
        var Emps:any = [];
        allEmployees.forEach(function(emp){
          if(emp.status == '1')
          {
            Emps.push(emp.toId);
          }
        });
          this.APIService.getData('getContactList',this.userId).subscribe((allContacts:any)=>{
            allContacts.forEach(function(data){
              if(data.memberstatus == '2' && Emps.indexOf(data.userId) >=0 && data.senderSetLevelStatus == '1' && data.recevierSetLevelStatus == '1') //&& data.amount > 0
              {
                if(allowed_levels.indexOf(data.reciverSetLevel) >= 0)
                {
                  var obj = {
                    email : data.email,
                    memberstatus : data.memberstatus,
                    name : data.name,
                    userId : data.userId,
                    privilege : '0'
                  };
                  All_contacts.push(obj);
                }
              }
            });
            this.all_contacts = All_contacts;
            if(navParams.get('already') != undefined)
            {
              All_contacts = [];
              var already_added = navParams.get('already');
              this.all_contacts.forEach(function(value){
                if(already_added.indexOf(value.email) == -1)
                {
                  All_contacts.push(value);
                }
              });
              this.all_contacts = All_contacts;
            }
            this.componentService.dismissLoader();
          },
          err => {
            this.componentService.dismissLoader();
              this.showTechnicalError();
          });
        },
        err => {
          this.componentService.dismissLoader();
            this.showTechnicalError();
        });
    }
  
    showTechnicalError(type = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast( 'Technical error, Please '+msg,'info');
    }
  
    dismiss()
    {
      this.modalController.dismiss({});
    }
    addContacts()
    {
      if(this.selected_contacts.length == 0)
      {
        this.dismiss();
      }
    else
      {
        this.modalController.dismiss(this.selected_contacts);
      }
    }
    insertContactToArray(evn,contact){
      var event = evn.target;
        if(event.checked == true)
        {
          this.selected_contacts.push(contact);
        }
        else
        {
          this.removeArray(this.selected_contacts, contact);
        }
    }
    removeArray(arr,what) {
       var a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }
  
  }
  