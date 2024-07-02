import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams,NavController,LoadingController, ToastController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-modals',
  templateUrl: './modals.page.html',
  styleUrls: ['./modals.page.scss'],
})
export class ModalsPage {
  cardName: string;
  cardHolderName: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardType: string;
  level: string;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  data: Object = {};
  extnal: {}
  propertiesURL = 'addwallet';
  userId: any;
  all_levels: any = [];
  allowed_levels: any = [];
  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams, 
    public http: HttpClient, 
    public toastCtrl: ToastController, 
    public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    public APIService:APIService,
    public componentService:ComponentService ) {
      this.http = http;
      this.userId = localStorage.getItem('userinfo');
      this.all_levels = JSON.parse(localStorage.getItem('alllevel') || '');
       if (this.all_levels && this.all_levels.length > 0) {
          this.all_levels.forEach((value) => {
             this.allowed_levels = [];
              var decrypted = CryptoJS.AES.decrypt(value, this.userId);
              var i;
              if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                  this.allowed_levels = [];
                  for (i = 1; i <= 1; i++) {
                      this.allowed_levels.push(i);
                  }
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                  this.allowed_levels = [];
                  for (i = 1; i <= 2; i++) {
                      this.allowed_levels.push(i);
                  }
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                  this.allowed_levels = [];
                  for (i = 1; i <= 3; i++) {
                      this.allowed_levels.push(i);
                  }
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                  this.allowed_levels = [];
                  for (i = 1; i <= 4; i++) {
                      this.allowed_levels.push(i);
                  }
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
                  this.allowed_levels = [];
              }
          });
      }
  }
  async presentModal(myEvent1) {
    let myModal = await this.modalCtrl.create({
      component: ModalsPage
    });
    myModal.onDidDismiss().then((callback: any) => {
    });
    await myModal.present();
  }

  dismiss() {
      this.modalCtrl.dismiss();
  }

  login() {
   if (this.cardHolderName == undefined || this.cardHolderName == '') {
    this.componentService.presentToast('Please enter card holdername.','danger');
         } else if (this.cardNumber == undefined || this.cardNumber == '') {
        
          this.componentService.presentToast( 'Please enter card number.','danger');

      } else if (this.cvv == undefined || this.cvv == '') {
         
          this.componentService.presentToast( 'Please enter cvv number.','danger');

      } else if (this.expiryDate == undefined || this.expiryDate == '') {
        
          this.componentService.presentToast('Please select expiry date.','danger');

      } else if (this.cardType == undefined || this.cardType == '') {
        this.componentService.presentToast('Please select card type.','danger');
      } else if (this.level == undefined || this.level == '') {
        this.componentService.presentToast('Please select level.','danger');
      } else {
          this.data = {
              cardName: this.cardName,
              cardHolderName: this.cardHolderName,
              cardNumber: this.cardNumber,
              cvv: this.cvv,
              expiryDate: this.expiryDate,
              cardType: this.cardType,
              level: this.level

          }
          this.componentService.showLoader();
          this.extnal = {
              'userId': localStorage.getItem('userinfo'),
              'walletData': this.data
          }
          console.log(this.data);
          let body = JSON.stringify(this.extnal);
          let headers = new Headers({
              'Content-Type': 'application/json'
          });
        
          return this.http.post(this.API_ENDPOINT_URL+this.propertiesURL, body)
                .subscribe(data => {
                  this.componentService.dismissLoader();
                  let walletData = data
                  this.componentService.presentToast('Wallet has been added successfully.','success');
                  this.navCtrl.navigateForward('wallets', walletData);
              },
                err => {
                    this.componentService.dismissLoader();
                    this.showTechnicalError('1');
                });
      }
  }

  showTechnicalError(type:any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');

    }
}