import { Component, OnInit } from '@angular/core';
import { NavController, Platform, ModalController, AlertController} from '@ionic/angular';
import { EventService } from '../../services/event.service';
import * as CryptoJS from 'crypto-js';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';
import {Http} from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  password: string = "level1";
  isAndroid: boolean = false;
  showHelpText: boolean = false;
  data : any = '';
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  level0 : string;
  level1 : string;
  level2 : string;
  level3 : string;
  level4 : string;
  current_email:any;
  alllevel:any;
  isBrowser: any;
  secondary_emails: any = [];
  options = {
  }
  constructor(
    public APIService:APIService,
    public navCtrl: NavController,
    public platform: Platform,
    public modalCtrl:ModalController,
    public alertCtrl: AlertController,
    public componentService:ComponentService,
    public events :EventService
) {
    this.isAndroid = platform.is('android');
   
    if(localStorage.getItem('job_alert_popup') == '1'){
      this.showHelpText = true;
      localStorage.removeItem('job_alert_popup');
    }
    if(localStorage.getItem('job_alert_popup_on_job') == '1'){
      this.showHelpText = true;
      localStorage.removeItem('job_alert_popup_on_job');
    }
  }
  ngOnInit() {
    this.isBrowser = localStorage.getItem('isBrowser');
    this.alllevel = JSON.parse(localStorage.getItem('alllevel')  || '{}');
    var userId  = localStorage.getItem('userinfo');
    if(this.alllevel){
      this.alllevel.forEach((value:any) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId || '{}');
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
        
          this.level1 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          
           this.level2 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
           this.level3 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
           this.level4 = 'false';
          
        }
      });
    }

    console.log(this.isBrowser, "isBrowser")
  }
  ionViewDidLoad() {
    this.alllevel = JSON.parse(localStorage.getItem('alllevel')  || '{}');
    var userId  = localStorage.getItem('userinfo');
    if(this.alllevel){
      this.alllevel.forEach((value:any) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId || '{}');
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
        
          this.level1 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          
           this.level2 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
           this.level3 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
           this.level4 = 'false';
          
        }
      });
    }

   
    var userdata = {
      userId : localStorage.getItem('userinfo')
    }
   this.componentService.showLoader();
    this.APIService.sendData('viewUser', userdata).subscribe((data:any) => {
     this.componentService.dismissLoader()
      this.data = data
      this.current_email = data.email;
      console.log(data, "userdata")
      if(data != null){
        localStorage.setItem('userImage', data.image);
        localStorage.setItem('userName', data.name);
        this.events.publish('username:changed', data);
      } 
    },
    (err:any) => {
      this.componentService.dismissLoader();
        this.showTechnicalError(null);
    });
  }

  showTechnicalError(type :any){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast( 'Technical error, Please '+msg, 'info')
  }
 

  ionViewWillUnload() {
    this.events.unsubscribe('openLevel:changed');
  }

  getAllEmails(){
    var userId  = localStorage.getItem('userinfo');
    this.APIService.getData('getUserEmails',userId).subscribe(data => {
      this.secondary_emails = data;
      // if(this.navParams.get('unconnected') == '1'){
      //   var invite_email = this.navParams.get('invite_email');
      //   var bidJobId = this.navParams.get('bidJobId');
      //   this.addEmails(invite_email,bidJobId);
      // }
    },
    err => {
        this.showTechnicalError(null);
    });
  }

  async verifyEmail(id:any,email:any){
    let modal = await this.modalCtrl.create({
      component: 'AddEmailPage',
      componentProps:{ verify : '1',email:email,id:id}
      //   modal.onDidDismiss(data => {
      // if(data == true)
      //   {  
      //     this.getAllEmails();
      //   }
      // })
    });
    await modal.present();
  }

  // async assignCompany(id:any,alertIds:any,companyIds:any){
  //   let modal = await this.modalCtrl.create('AssignCompanyPage',{
  //       id:id,
  //       alertIds:alertIds,
  //       companyIds:companyIds
  //     });
  //   await modal.present();
  // }

 async makePrimary(id:any,email:any){
    var userId  = localStorage.getItem('userinfo');
    let confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'After make this email primary, you have to log into Salvum with this new primary e-mail and all generic notifications will now be sent to this e-mail.',
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
            this.APIService.sendData('makeEmailPrimary',{'_id': id, userId: userId, email: email}).subscribe((result:any)=>{
              if(result.status == 1)
              {
                 this.componentService.dismissLoader();
                 this.componentService.presentToast('Email preference updated.', 'success')
          
                     this.current_email = email;
                     this.getAllEmails();
              }
              else
              {
                this.componentService.dismissLoader();
                this.componentService.presentToast('Error, plz try later.', 'danger')

            }
          },
            (err:any) => {
               this.componentService.dismissLoader()
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    await confirm.present();
  }


  async deleteEmails(id:any,isVerified:any){
    var msg = isVerified == '1' ? 'After removing this email, job updates will no longer be sent to this e-mail.' : '';
    var title_msg = isVerified == '1' ? '?' : ' you want to remove?';
    let confirm = await this.alertCtrl.create({
      header: 'Are you sure'+title_msg,
      message: msg,
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
           this.componentService.showLoader()
            this.APIService.sendData('deleteEmails',{'_id' : id}).subscribe((deleted:any)=>{
              if(deleted.status == 1)
              {
                 this.componentService.dismissLoader();
                 this.componentService.presentToast('Email removed.','success')
                 this.getAllEmails();
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


openEditprofilePage(data:any)
{
	this.navCtrl.navigateForward('EditprofilePage' ,data);
}

openChangepasswordPage(){
  localStorage.setItem('selectedLevelValue', '1');
	this.navCtrl.navigateForward('ChangepasswordPage');
};

root(){
  this.navCtrl.navigateRoot('DashboardPage'); 
}


  getUrl(data:any){
    if(data.website.startsWith("http:")){
      data.website = data.website;
    }else{
      data.website = 'https://' + data.website;
    }
  }

  unlock(){
    this.level1 = 'true';
    this.level2 = 'true';
    this.level3 = 'true';
    this.level4 = 'true';
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '{}');
    var userId  = localStorage.getItem('userinfo');
  
    this.alllevel.forEach((value:any) => {
        var decrypted = CryptoJS.AES.decrypt(value, userId || '{}');
      if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
      
        this.level1 = 'false';

      }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
        
         this.level2 = 'false';

      }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
         this.level3 = 'false';

      }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
         this.level4 = 'false';
        
      }
    });  
  };

  // openAppBrowser(url : string){
  //   let target = "_blank";
  //   this.theInAppBrowser.create(url, target, this.options);
  // };

  async addEmails(invite_email = null,bidJobId = null){
    console.log("addEmails")
    let modal = await this.modalCtrl.create({
      component: 'AddEmailPage',
      componentProps: { 
        invite_email : invite_email,
        bidJobId : bidJobId
      }
    });
    // modal.onDidDismiss(data => {
    //   if(data == true)
    //     {  
    //       this.getAllEmails();
    //     }
    // });
     await modal.present();
   
  }
}

