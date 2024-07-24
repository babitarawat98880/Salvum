import { Component, OnInit, ViewChild } from '@angular/core';
// import { OverlayEventDetail } from '@ionic/core/components';
import { ToastController, NavController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Pipe } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { EventService } from 'src/services/event.service';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
import { ModalsPage } from '../modals/modals.page';
@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage {
  items: any = [];
  isBrowser:any;
  walletsDetls : Array<{}>;
  allowed_levels:any = [];
  all_levels:any = [];
  userId:any;
  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController , 
    public http:HttpClient ,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, 
    public componentService: ComponentService, 
    public APIService:APIService,
    public events: EventService) {
    this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
    this.unlock();
    events.subscribe('openLevel:changed', data => {  
      this.unlock();
    });
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard', 0]);
  }
  walletPage() {
    this.navCtrl.navigateRoot(['wallet']);
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    // const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }

  unlock(){
    this.userId =  localStorage.getItem('userinfo');
    this.all_levels = JSON.parse(localStorage.getItem('alllevel') || '' );

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

  showTechnicalError(type:any = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please '+msg,'info');
  }
 
  ngOnInit(){
    this.walletsDetls = [];
    // this.componentService.showLoader();
    return this.APIService.getData('walletDeatil',localStorage.getItem('userinfo'))
    .subscribe((data:any) => {
    this.componentService.dismissLoader();
      var items :any= [];
      //console.log(data);
      for (var i = data.length - 1; i >= 0; --i) { 
        if (this.allowed_levels.indexOf('level' + data[i].level) != -1) {
          items.push(data[i]);
        }  
      }
      this.items = items;
    },
    err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
    });
  };

 async presentModal(myEvent1) {
    let myModal = await this.modalCtrl.create({
      component: ModalsPage
    });
    myModal.onDidDismiss().then((callback: any) => {
    });
    await myModal.present();
  }
   async showConfirm(item , index) {
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
          let body = item;
          return this.APIService.sendData('deletewallet',body)
            .subscribe(data => {
            this.items.splice(index ,1);
            this.componentService.presentToast('Wallet has been deleted successfully.', 'success');
            },
            err => {
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    (await confirm).present();
  }
  openWalletdetailPage(data){
    console.log(data);
    this.walletsDetls = data;
	  this.navCtrl.navigateForward('walletdetail' , { state: this.walletsDetls });
    
  };


  wallet(){
    this.navCtrl.navigateRoot('wallet');
  };
}