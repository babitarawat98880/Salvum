import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, PopoverController, ModalController, AlertController, NavController, LoadingController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { EventService } from 'src/services/event.service';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
import * as CryptoJS from 'crypto-js';
import { AddpasswordPage } from '../addpassword/addpassword.page';
import { EditpassPage } from '../editpass/editpass.page';
@Component({
  selector: 'app-passwords',
  templateUrl: './passwords.page.html',
  styleUrls: ['./passwords.page.scss'],
})
export class PasswordsPage implements OnInit {
  passWordData: any = [];
  passwordDetls : any = [];
  isBrowser:any;
  editpasswordDetls : Array<{}>;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  passURL = 'wallPasswordDetail';
  deletepassUrl = 'deletepassword';
  userId: any;
  all_levels:any = [];
  allowed_levels:any = [];
  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController, 
    public modalCtrl: ModalController,  
    public alertCtrl: AlertController,
    public http:HttpClient ,
    public toastCtrl: ToastController,  
    public loadingCtrl: LoadingController, 
    public events: EventService,
    public componentService:ComponentService,
    public APIService:APIService) {
    this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
    this.unlock();
    events.subscribe('openLevel:changed', data => {  
      this.unlock();
    });
  };

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }


async presentModal2(myEvent1) {
    let myModal = await this.modalCtrl.create({
      component: AddpasswordPage
    });
    myModal.onDidDismiss().then((data: any) => {
      console.log(data)
      if(data != undefined){
        this.ngOnInit();
      }
    });
    await myModal.present();
 };

  showTechnicalError(type:any = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please '+msg,'info');
  }

  async showConfirm(data ,index) {
    let confirm = this.alertCtrl.create({ 
      message: 'Are you sure you want to delete this ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
           let body = JSON.stringify(data);
           return this.http.post(this.API_ENDPOINT_URL+this.deletepassUrl, body)
            .subscribe(data => {
            this.passWordData.splice(index ,1);
            this.componentService.presentToast('Password was deleted successfully','success'); 
            },
            err => {
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    (await confirm).present();
  };

  ngOnInit(){
    //this.passWordData = [];
    this.passwordDetls = [];
    this.editpasswordDetls = [];
    // this.componentService.showLoader();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.get(this.API_ENDPOINT_URL+this.passURL+'/'+localStorage.getItem('userinfo'))
      .subscribe((data:any) => {
      this.componentService.dismissLoader();
      this.passWordData = [];
      //console.log(data);
      for (var i = data.length - 1; i >= 0; --i) { 
        if (this.allowed_levels.indexOf('level' + data[i].passwordlevel) != -1) {
          this.passWordData.push(data[i]);
        }  
      }
      //this.passWordData = data;
    },
    err => {
      this.componentService.dismissLoader();
        this.showTechnicalError();
    });
  };

  unlock(){
    this.userId =  localStorage.getItem('userinfo');
    this.all_levels = JSON.parse(localStorage.getItem('alllevel') || '');
     if(this.all_levels && this.all_levels.length > 0){
      this.all_levels.forEach((value) => {

        this.allowed_levels = [];
        var decrypted = CryptoJS.AES.decrypt(value, this.userId);
        var i;
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.allowed_levels = [];
          for(i = 1; i <= 1; i++){
            this.allowed_levels.push('level'+i );
          }   
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          this.allowed_levels = [];
          for(i = 1; i <= 2; i++){
            this.allowed_levels.push('level' + i);
          }
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
          this.allowed_levels = [];
          for(i = 1; i <= 3; i++){
            this.allowed_levels.push('level' + i);
          }
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
          this.allowed_levels = [];
          for(i = 1; i <= 4; i++){
            this.allowed_levels.push('level' + i );
          }
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
          this.allowed_levels = [];
        }
      });
      this.ngOnInit();
    }else{
      this.allowed_levels = [];
      this.ngOnInit();
    }
  };

  openPassworddetailPage(data){
    this.passwordDetls = data
    this.navCtrl.navigateForward('passworddetail' , { state: this.passwordDetls });
  };


  async edit(data){
    localStorage.setItem('passworddetail', JSON.stringify(data));
    let myModal = await this.modalCtrl.create({
      component: EditpassPage
    });
    myModal.onDidDismiss().then((callback: any) => {
      if(callback != 'empty'){
        this.ngOnInit();
      }
    });
    await myModal.present();
  };

  root(){
    this.navCtrl.navigateRoot(['dashboard',0]);
  };

  wallet(){
    this.navCtrl.navigateBack('wallet');
  };
}