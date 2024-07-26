import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController,ToastController,LoadingController, MenuController} from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.page.html',
  styleUrls: ['./addcontact.page.scss'],
})
export class AddcontactPage {
  userId : any;
  jobId : any;
  already : any;
  trade_page : any;
  alltrades : any;
  filterTradeId : any;
  invite_name : any;
  invite_email : any; 
  invite_title : any;
  invite_company : any;
  isMember : any;
  isEdit : any;
  tradeId : any;
  contactId : any;
  coworkerId : any;
  show_privilege : any;
  invite_phone : any = '';
  privilege : any = '0';
  isCoworker : any = '0';
  unique_id : any = '0';
  isMultiple : any;
  constructor(
      public modalCtrl: ModalController, 
      public navCtrl: NavController, 
      public navParams: NavParams, 
      public APIService: APIService, 
      public alertCtrl: AlertController, 
      public componentService: ComponentService, 
      public menuCtrl: MenuController) {
  
        this.userId = localStorage.getItem('userinfo');
        this.jobId = navParams.get('jobId');
        this.trade_page = navParams.get('trade_page');
        this.isEdit = navParams.get('isEdit');
        this.isMultiple = navParams.get('isMultiple');
        if(this.isEdit == 1){
          var contact = navParams.get('data');
          this.invite_name = contact.invite_name;
          this.invite_email = contact.invite_email;
          this.invite_title = contact.invite_title;
          this.privilege = contact.privilege;
          this.invite_company = contact.invite_company;
          this.invite_phone = contact.invite_phone;
          this.tradeId = contact.tradeId;
          this.isMember = contact.isMember;
          this.contactId = contact._id;
          this.coworkerId = contact.inviteId;
          this.isCoworker = contact.isCoworker;
          this.unique_id = contact.unique_id;
        }
        if(this.trade_page == '1')
        {
          this.filterTradeId = '1';
          this.already = navParams.get('already');
          this.show_privilege = '0';
        }
        else
        {
          this.filterTradeId = localStorage.getItem('filterTradeId');
          if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
            this.filterTradeId = '0';
          }
        }
  
        this.APIService.getData('trades',this.jobId).subscribe((alltrades)=>{
          this.alltrades = alltrades;
        },
        err => {
            this.showTechnicalError();
        });
    }
  
    addContactEvent(invite_name,invite_email,invite_title,invite_company,invite_phone,tradeId,privilege)
    {
      if(invite_name == '' || invite_name == undefined || invite_name == null)
      {
        this.componentService.presentToast('Please enter name.','danger');
      }
      else if(invite_email == undefined || invite_email == '' || invite_email == null)
      {
        this.componentService.presentToast('Please enter email.','danger');
      }
      else
      {
        if(this.filterTradeId == '0')
        {
          if(tradeId == undefined || tradeId == '' || tradeId == null || tradeId == 'null')
          {
            this.componentService.presentToast('Please select trade.','danger');
         
             return false;
          }
        }
        else
        {
          tradeId = localStorage.getItem('filterTradeId');
        }
        var contactArray = {
          isMember: '0',
            userId: this.userId,
            inviteId: '0',
            status: '0',
            invite_email: invite_email,
            invite_name: invite_name,
            invite_company: invite_company,
            invite_phone: invite_phone,
            invite_title: invite_title,
            privilege: privilege,
            isEdit: this.isEdit,
            contactId: this.contactId,
            tradeId: tradeId,
            is_multi: '1'
        };
        this.componentService.showLoader();
        this.APIService.sendData('addInviteBiddersManually/'+this.jobId+'/'+0,contactArray).subscribe((contacts:any)=>{
          this.componentService.dismissLoader(); 
              if(contacts.status == '1')
              {
                  this.modalCtrl.dismiss('1');
              }
              else if(contacts.status == '0')
              {
                this.componentService.presentToast('Contact already added.','danger');
               }
              else 
              {
                this.modalCtrl.dismiss('0');
              }
            },
            err => {
                this.componentService.dismissLoader();;
                this.showTechnicalError('1');
            });
      }
    }
  
    addContactTrade(invite_name,invite_email,invite_title,invite_company,invite_phone,privilege)
    {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if(invite_name == '' || invite_name == undefined || invite_name == null)
      {
        this.componentService.presentToast('Please enter name.','danger');
      }
      else if(invite_email == undefined || invite_email == '' || invite_email == null)
      {
        this.componentService.presentToast('Please enter email.','danger');
      }
      else if(reg.test(invite_email) == false)
      {
        this.componentService.presentToast('Please enter valid email address.','danger');
      }
      else
      {
        if(this.already.indexOf(invite_email) >= 0)
        {
        this.componentService.presentToast('Contact already added.','danger');
       return false;
        }
        var contactArray = {
            _id : null,
            isMember: '0',
            userId: this.userId,
            inviteId: '0',
            status: '1',
            invite_email: invite_email,
            invite_name: invite_name,
            invite_company: invite_company,
            invite_phone: invite_phone,
            invite_title: invite_title,
            privilege: privilege,
            bid_status: '1'
        };
        this.modalCtrl.dismiss(contactArray);
        
      }
    }
  
    editContactTrade(privilege,tradeId){
      if(privilege == undefined || privilege == null || privilege == ''){
        this.componentService.presentToast('Privilege is required.','danger');
      }
      else if(tradeId == undefined || tradeId == null || tradeId == '' || tradeId == 'null'){
        this.componentService.presentToast('Please select trade.','danger');
      }
      else{
        var contactArray = {
            invite_email: this.invite_email,
            invite_name: this.invite_name,
            invite_company: this.invite_company,
            invite_phone: this.invite_phone,
            invite_title: this.invite_title,
            privilege: privilege,
            isEdit: this.isEdit,
            contactId: this.contactId,
            tradeId: tradeId,
            is_multi : '1'
        };
        this.componentService.showLoader();
        if(this.isCoworker == '1'){
          this.APIService.sendData('editCoworkers',{jobId:this.jobId,tradeId:tradeId,privilege:privilege,unique_id:this.unique_id}).subscribe((contacts:any)=>{
            this.componentService.dismissLoader(); 
              if(contacts.status == '1'){
                this.modalCtrl.dismiss('1');
              }
              else{
                this.componentService.presentToast('Error,Plz try later.','danger');
              }
          });
        }
        else{
          this.APIService.sendData('addInviteBiddersManually/'+this.jobId+'/'+0,contactArray).subscribe((contacts:any)=>{
            this.componentService.dismissLoader(); 
              if(contacts.status == '1'){
                this.modalCtrl.dismiss('1');
              }
              else{
                this.componentService.presentToast('Error,Plz try later.','danger');
                }
          });
        }
      }
    }
  
    showTechnicalError(type:any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');
     
    }
  
    dismiss()
    {
      this.modalCtrl.dismiss();
    }
  
  }
  