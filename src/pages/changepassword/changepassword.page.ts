import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, NavParams, Platform,ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { EventService } from '../../services/event.service';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage {
  levelFirst : string;
  levelSecond : string;
  levelThird: string;
  levelFourth : string;
  alllevel:any;
  password: string = "level1";
  isAndroid: boolean = false;
  isLevel : any
  data : object = {};
  isOn:boolean = false;
  isBrowser:any;
  leveldataUrl ='allleveldata';
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    platform: Platform, 
    public http: HttpClient,
    public toastCtrl: ToastController,
    public events: EventService,
    public componentService: ComponentService,
    public APIService:APIService) {
	  this.isAndroid = platform.is('android');
    this.isLevel = localStorage.getItem('selectedLevelValue');

    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId  = localStorage.getItem('userinfo');
    var openedLevelInStorage = 0;
    if(this.alllevel){
      this.alllevel.forEach((value:any) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId || '');
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.levelFirst = 'false';
          openedLevelInStorage = 1;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          this.levelSecond = 'false';
          openedLevelInStorage = 2;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
          this.levelThird = 'false';
          openedLevelInStorage = 3;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
          this.levelFourth = 'false';
          openedLevelInStorage = 4;
        }
      });
    }

    if(Number(this.isLevel) > openedLevelInStorage){
      this.isLevel = String(openedLevelInStorage);
    }

    this.isBrowser = localStorage.getItem('isBrowser');
    this.APIService.getData('allleveldata',userId+'/'+this.isLevel)
    .subscribe((data:any) => {
     
      this.data = data.data;
      //if(data.data.email || data.data.contact){
        this.isOn = data.data.isOn;
      //}
    },
    (err:any) => {
        this.showTechnicalError();
    });
    events.subscribe('openLevel:changed', data => {  
      this.locksClicked();
    });
  }

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }

  ionViewDidLoad() {
  }
  
  locksClicked(){
    this.isOn  = false;
    this.levelFirst = 'true';
    this.levelSecond = 'true';
    this.levelThird = 'true';
    this.levelFourth = 'true';
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId  = localStorage.getItem('userinfo');
    var openedLevelInStorage = 0;
    if(this.alllevel){
      this.alllevel.forEach((value:any) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId || '');
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.levelFirst = 'false';
          openedLevelInStorage = 1;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          this.levelSecond = 'false';
          openedLevelInStorage = 2;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
          this.levelThird = 'false';
          openedLevelInStorage = 3;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
          this.levelFourth = 'false';
          openedLevelInStorage = 4;
        }
      });
    }

    if(Number(this.isLevel) > openedLevelInStorage){
      this.isLevel = String(openedLevelInStorage);
    }
    
    localStorage.setItem('selectedLevelValue', this.isLevel);
    this.isBrowser = localStorage.getItem('isBrowser');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });
    return this.http.get(this.API_ENDPOINT_URL+this.leveldataUrl+ "/" + userId + "/" + '1')
    .pipe(map(res => res))
    .subscribe((data:any) => {
      this.data = data.data
      if(data.data.email != '' || data.data.contact != ''){
        this.isOn = data.data.isOn;
      }
    },
    (err:any) => {
        this.showTechnicalError();
    });
  };

  changelevel(level:any){
    this.isOn = false;
    this.data = {};
    localStorage.setItem('selectedLevelValue', level);
    this.isLevel = level;
    var userId = localStorage.getItem('userinfo');
    return this.APIService.getData('allleveldata',userId+'/'+level)
    .subscribe((data:any) => {
      this.data = data.data;
      //if(data.data.email != '' || data.data.contact != ''){
        this.isOn = data.data.isOn;
      //}
    },
    (err:any) => {
        this.showTechnicalError();
    });
  }

  updatePassword(update){
    update.isOn = this.isOn;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var isValidEmail = reg.test(update.email);
    // console.log(update.newpassword);
    if(update.newpassword != '' && update.newpassword != undefined && ( typeof(update.newpassword) != undefined) ){
      if(!update.currentpassword){
       
        this.componentService.presentToast('Please enter your current password.','danger');

      }else if(!update.newpassword){
       
        this.componentService.presentToast('Please enter your new password.','danger');

      }else if(update.currentpassword != update.password && update.confirm != ''){
        this.componentService.presentToast('Your current password does\'t match.','danger');

      }else if (update.newpassword != update.confirm && update.confirm != '' || update.newpassword != update.confirm && update.newpassword != ''){
        this.componentService.presentToast('Password and confirm password does\'t match.','danger');


      }else if(update.isOn == true && (update.contact == '' || update.contact == null)&& update.level == 4){
        if(update.level == 3){
        this.componentService.presentToast(  'Please enter email address.','danger');

        }else{
        this.componentService.presentToast( 'Please enter contact number.','danger');

          
        }
      }else if( update.isOn == true && update.level == 3 &&  isValidEmail == false){
        if(update.level == 3){
        
        this.componentService.presentToast( 'Please enter email address.','danger');

        }else{
        this.componentService.presentToast( 'Please enter contact number.','danger');

        }

      }else{
      this.componentService.showLoader();
       let body = update;
       return this.APIService.putData('addlevel',body).subscribe(data => {
        this.componentService.presentToast('Password has been updated successfully.','success');
          this.componentService.dismissLoader()
          this.navCtrl.navigateForward('profile')
        },
        err => {
            this.componentService.dismissLoader();
            this.showTechnicalError('1');
        });
      }
    }else if(update.isOn == true && (update.contact == '' || update.contact == null || update.contact == undefined) && update.level == 4 || update.isOn == true && isValidEmail == false && update.level == 3){
      if(update.level == 3){
        this.componentService.presentToast( 'Please enter valid email address.','danger');
      }else{
        this.componentService.presentToast( 'Please enter contact number.','danger');
       
      }
    }else if(update.questions == '' || update.questions == undefined){
      this.componentService.presentToast( 'Please select your question.','danger');
    }else if(update.ans87r == '' || update.answer == undefined){
      this.componentService.presentToast('Please write your answer.','danger');
    }else{
      if(update.email == ''){
        update.email = 'null';
      }

      if(update.contact == ''){
        update.contact = 'null';
      }
      if(update.level == 4){
        update.email = 'email';
      }
      if(update.contact && update.contact.length < 10){
        this.componentService.presentToast('Please enter atleast 10 digits contact number.','danger');
            return false;
        }
     this.componentService.showLoader();
      update.newpassword = update.password;
       let body = update;
       return this.APIService.putData('addlevel',body).subscribe(data => {
        this.componentService.presentToast( 'Security information has been updated successfully.','success');
          this.componentService.dismissLoader();
          this.navCtrl.navigateForward('profile')
        },
        err => {
          this.componentService.dismissLoader();
            this.showTechnicalError('1');
        });
    }
    
  };

  profile(){
    this.navCtrl.navigateRoot('profile');
  };

  root(){
    this.navCtrl.navigateRoot('dashboard');
  };

  showTechnicalError(type:any = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please '+msg,'info');
  }

}
