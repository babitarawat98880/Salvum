import { Component, OnInit } from '@angular/core';
import { NavController, NavParams , AlertController,ToastController,LoadingController, ModalController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-contactslist',
  templateUrl: './contactslist.page.html',
  styleUrls: ['./contactslist.page.scss'],
})
export class ContactslistPage {
  yourLevel:any='';
  folder_name:any='';
  contactLevel:any='';
  all_contacts:any;
  selected_contacts:any = [];
  userId:any ='';
  share_page:string;
  hidden_content:any;
  hidden_content_level:any;
  share_page_type:any;
  page_type:any;
  companyId:any;
  license_page:any;
  filterTradeId:any;
  alltrades:any;
  jobId:any;
  enable_level1:any;
  enable_level2:any;
  enable_level3:any;
  enable_level4:any;
  allowed_levels:any;
  all_companies:any;
  show_priv:any;
  time_limitation:boolean = false;
  from_trade_contacts:boolean = false;
  availableUpto: String = new Date().toISOString();
    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams , 
      public APIService: APIService, 
      public alertCtrl: AlertController, 
      public modalController: ModalController,
      public componentService: ComponentService) {
  
      this.share_page = navParams.get('share_page');
      this.page_type = navParams.get('page_type');
      this.share_page_type = navParams.get('share_page_type');
      this.show_priv = navParams.get('show_priv');
      if(navParams.get('from_trade_contacts') == '1'){
        this.from_trade_contacts = true;
      }
      this.hidden_content = true;
      this.hidden_content_level = true;
      var All_contacts :any= [];
      this.userId = localStorage.getItem('userinfo');
      this.companyId = localStorage.getItem('switched_comp');
  
      if(this.navParams.get('trade_check') == '1')
      {
        this.filterTradeId = localStorage.getItem('filterTradeId');
        if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
          this.filterTradeId = '0';
        }
        this.jobId = navParams.get('jobId');
        this.APIService.getData('trades',this.jobId).subscribe((alltrades)=>{
          this.alltrades = alltrades;
        },
        err => {
            this.showTechnicalError();
        });
      }
  
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
      var loginId = this.userId;
      //for external contacts
      if(navParams.get('is_external') == '1')
      {
        this.componentService.showLoader();
        this.APIService.getData('getContacts',this.userId).subscribe((allContacts:any)=>{
          this.all_contacts = allContacts.data;
          if(this.all_contacts != '')
          {
            var Contacts:any = [];
            this.all_contacts.forEach(function(value){
                Contacts.push({
                  email : value.externalContacts
                });
            });
            this.all_contacts = Contacts;
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
          }
          this.componentService.dismissLoader();
          },
          err => {
              this.componentService.dismissLoader();
              this.showTechnicalError();
          });
      }
      else
      {
        if(navParams.get('license_page') != undefined)
          {
            this.license_page = '1';
            // if(this.page_type == '1'){
            //   this.companyProvider.userCompaniesList(this.userId).subscribe((result)=>{
            //     this.all_companies = result;
            //   });
            // }
             this.componentService.showLoader();
             
            this.APIService.getData('associateEmployeesList',this.companyId+'/'+this.userId ).subscribe((employees:any)=>{
            All_contacts = [];
            var loginId = this.userId;
            employees.forEach(function(data){
              if(data.status == '1' && data.toId != loginId){
                var obj = {
                    email : data.employee_email,
                    memberstatus : '2',
                    name : data.employee_name,
                    userId : data.toId,
                    privilege : '0'
                  };
                All_contacts.push(obj);
              }
            });
            this.all_contacts = All_contacts;
            this.componentService.dismissLoader();
          },
          err => {
              this.componentService.dismissLoader();
              this.showTechnicalError();
          });
          }
          else{
             this.componentService.showLoader();
             
            this.APIService.getData('getContactList',this.userId).subscribe((allContacts:any)=>{
              allContacts.forEach(function(data){
                if(data.memberstatus == '2' && data.senderSetLevelStatus == '1' && data.recevierSetLevelStatus == '1')
                {
                  data.privilege = '2';
                  var allow_level = '';
                  if(data.senderId != loginId)
                    {
                      allow_level = data.reciverSetLevel;
                    }
                    else
                    {
                      allow_level = data.senderSetLevel;
                    }
                  if(allowed_levels.indexOf(allow_level) >= 0)
                  {
                    All_contacts.push(data);
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
          }
        
      }
      
    }
    dismiss()
    {
      this.modalController.dismiss();
    }
    addContacts(folder_name,time_limitation,availableUpto,yourLevel,contactLevel,tradeId)
    {
      if(this.selected_contacts.length == 0)
      {
        this.dismiss();
      }
  
      else if(this.selected_contacts.length > 1)
        {
          if(this.navParams.get('trade_check') == '1')
            {
              if(this.filterTradeId == '0')
                {
                  // if(tradeId == undefined || tradeId == '')
                  // {
                  //   let toast = this.toastCtrl.create({
                  //     message: 'Please select trade.',
                  //     duration: 3000,
                  //     cssClass: 'danger',
                  //     position: 'top'
                  //    });
                  //    toast.present(); 
                  //    return false;
                  // }
                  tradeId = 0;
                }
                else
                {
                  tradeId = localStorage.getItem('filterTradeId');
                }
                localStorage.setItem('current_tradeId_s',tradeId);
            }
  
          if(this.share_page == '1')
          {
            if(folder_name == undefined || folder_name == '')
            {
              this.componentService.presentToast('Please enter valid folder name.','danger');
             return false;
            }
            else if(yourLevel == undefined || yourLevel == '')
            {
              this.componentService.presentToast('Please select your level.','danger');
              return false;
            }
            else if(time_limitation == true && (availableUpto == undefined || availableUpto == ''))
            {
              this.componentService.presentToast('Please select available upto time.','danger'); 
                 return false;
            }
            else
            {
              availableUpto = time_limitation == false ? null : availableUpto;
              localStorage.setItem('s_folder_name',folder_name);
              localStorage.setItem('s_availableUpto',availableUpto);
              localStorage.setItem('s_yourLevel',yourLevel);
              this.modalController.dismiss(this.selected_contacts);
            }
          }
         
          else
          {
            this.modalController.dismiss(this.selected_contacts);
          }
        }
        else
        {
          if(this.navParams.get('trade_check') == '1')
            {
              if(this.filterTradeId == '0')
                {
                  tradeId = 0;
                }
                else
                {
                  tradeId = localStorage.getItem('filterTradeId');
                }
                localStorage.setItem('current_tradeId_s',tradeId);
            }
          if(this.share_page_type == '1')
          {
            var d ={
              'fromId': this.userId,
              'toId':this.selected_contacts[0].userId
            }
            this.APIService.sendData('checkShareFolderAccept',d).subscribe((result:any)=>{
                  if(result.data.count > 0)
                  {
                    if(this.hidden_content_level == true)
                    {
                      this.hidden_content_level = false;
                      return false;
                    }
                    if(contactLevel == '' || contactLevel == undefined)
                    {
                      this.componentService.presentToast('Please select level.','danger');
                    
                       return false;
                    }
                    localStorage.setItem('s_isAccept','1');
                    localStorage.setItem('s_contactLevel',contactLevel);
                    this.modalController.dismiss(this.selected_contacts);
                  }
                  else
                  {
                    this.hidden_content_level == true;
                    localStorage.setItem('s_isAccept','0');
                    localStorage.setItem('s_contactLevel','5');
                    this.modalController.dismiss(this.selected_contacts);
                  }
                },
                err => {
                    this.showTechnicalError();
                });
          }
       
          else
          {
            this.modalController.dismiss(this.selected_contacts);
          }
        }
    }
    insertContactToArray(event,contact){
      console.log(event,"++++",contact)
        if(event.target.checked == true)
        {
          this.selected_contacts.push(contact);
        }
        else
        {
          this.removeArray(this.selected_contacts, contact);
        }
  
        if(this.selected_contacts.length > 1)
        {
          if(this.share_page == '1')
          {
            this.hidden_content = false;
            this.hidden_content_level == true;
          }
        }
        else
        {
          if(this.share_page == '1')
          {
            this.hidden_content = true;
          }
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
  
    showTechnicalError(type = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');
    }
  }
  