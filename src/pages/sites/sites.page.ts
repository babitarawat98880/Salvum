import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';
import { ToastController, NavController, ModalController, NavParams, AlertController, LoadingController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { EventService } from 'src/services/event.service';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { AddwebsitePage } from '../addwebsite/addwebsite.page';
import { EditsitePage } from '../editsite/editsite.page';
@Component({
  selector: 'app-sites',
  templateUrl: './sites.page.html',
  styleUrls: ['./sites.page.scss'],
})
export class SitesPage {
  websiteData: Array<{}>;
  websiteDetails : Array<{}>;
  isBrowser:any;
  social:any = [];
  marketing:any = [];
  others:any = [];
  userId:any = localStorage.getItem('userinfo');
  all_levels:any;
  allowed_levels:any = [];
  APIURL = localStorage.getItem('APIURL'); 
  isVisible : Boolean = false;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
   constructor(
    public navCtrl: NavController, 
    public events: EventService,  
    public modalCtrl: ModalController,
    public http:HttpClient ,
    public toastCtrl: ToastController, 
    public alertCtrl: AlertController,  
    public loadingCtrl: LoadingController, 
    public APIService: APIService, 
    public componentService: ComponentService) {
    this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
    if(this.userId != undefined && this.userId != '' && this.userId != null){
      this.isVisible = true;
      this.unlock();
    }
    else{
      localStorage.setItem('redirect_after','sites');
      this.componentService.presentToast('Please login to access this page.','info');
       this.navCtrl.navigateRoot('login');
    }
    events.subscribe('openLevel:changed', data => {  
      this.unlock();
    });
  };

  showTechnicalError(type = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please '+msg,'info');
    }

  unlock(){
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
          let headers = new Headers({ 'Content-Type': 'application/json' });
         
          return this.http.delete(this.APIURL + "/websiteList/" +item._id)
             .subscribe(data => {
            this.websiteData.splice(index ,1);
            this.componentService.presentToast('Site has been deleted.','success');
            this.ngOnInit();
            },
            err => {
                this.showTechnicalError();
            });
          }
        }
      ]
    });
    (await confirm).present();
  };

  ngOnInit() {
    this.websiteData = [];
    this.websiteDetails = [];
    // this.componentService.showLoader();
    return this.http.get(this.APIURL + '/websiteList/'+ localStorage.getItem('userinfo')).subscribe((data:any) => {
      this.componentService.dismissLoader();
      this.social = [];
      this.marketing = [];
      this.others = [];
      for (var i = data.length - 1; i >= 0; --i) {   
        if (data[i].selectCategory == 'Social'){
          if (this.allowed_levels.indexOf('level' + data[i].weblevel) != -1) {
            this.social.push(data[i]);
          }
        }else if(data[i].selectCategory == 'Marketing'){
          if (this.allowed_levels.indexOf('level' + data[i].weblevel) != -1) {
            this.marketing.push(data[i]);
          }
        }else{
          if (this.allowed_levels.indexOf('level' + data[i].weblevel) != -1) {
            this.others.push(data[i]);
          }
        }      
      }
      //this.websiteData = data;
    },
    err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
    });
  };

  async presentModal3(myEvent3) {
    let myModal = await this.modalCtrl.create({
      component: AddwebsitePage
    });
    myModal.onDidDismiss().then((callback: any) => {
      if(callback != 'empty'){
        this.ngOnInit();
      }
    });
    await myModal.present();
    
  };

  openWebsitePage(data){
	  this.navCtrl.navigateForward('sitesdetail', { state: { data }});
  };

  recipts(siteId){ 
    this.navCtrl.navigateForward('SiteReciptsPage', { state:{
      siteId : siteId
    }})
  }

  async edit(data){
	  localStorage.setItem('siteDetail', JSON.stringify(data));
    let myModal = await this.modalCtrl.create({
      component: EditsitePage
    });
    myModal.onDidDismiss().then((callback: any) => {
      this.ngOnInit();
    });
    await myModal.present();
  };

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
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

}
