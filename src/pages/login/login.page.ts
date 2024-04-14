import { Component, OnInit } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { Platform, NavController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http'; 
import { LoginService } from '../../services/login.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';
import * as CryptoJS from 'crypto-js';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FCM } from '@ionic-native/fcm';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage   {
  loginForm:FormGroup;
  APIURL:any='';
  baseUrl:any='';
  remember:any = false;
  isBrowser :any = localStorage.getItem('isBrowser');
  fcm_token: any = '';
  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public platform : Platform,
    public componentService: ComponentService,
    public http: HttpClient, 
    // public cookieService: CookieService,
    public APIService:APIService
    ){
      this.loginForm = this.formBuilder.group({
        password: ['',[Validators.required]],
        email: ['', [Validators.required,  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]]
      });
      if(this.platform.is('mobileweb')) {
        localStorage.setItem('isBrowser',  'true');
      }else{
       localStorage.setItem('isBrowser',  'false');
      }
      if(localStorage.getItem('is_register_success') == '1'){
        this.componentService.presentToast( 'You have successfully registered with salvum. Please check your email to confirm your account.','success')
        localStorage.removeItem('is_register_success');
      }
      this.isBrowser = localStorage.getItem('isBrowser');
      this.APIURL = localStorage.getItem('APIURL');
      this.baseUrl = localStorage.getItem('baseUrl');
      this.http = http;
      this.platform = platform;
      if(localStorage.getItem('userinfo') != undefined && localStorage.getItem('userinfo') != null && localStorage.getItem('userinfo') != ''){
        // this.navCtrl.setRoot('DashboardPage',{
        //   id : '0'
        // });
        return;
      }else{
        if(this.isBrowser == 'false'){
          // this.fcm.getToken().then(token => {
          //   this.fcm_token = token;
          // });
        }
        
      }
  }
  ionViewDidLoad() {
    // if(this.navParams.get('email') != undefined){
    //   this.email = this.navParams.get('email');
    // }
    // else{
    //   this.email = this.cookieService.get('su');
    // }
    // this.password = this.cookieService.get('sp');
    // this.remember = this.cookieService.get('sr');
    // const loading = this.loadingCtrl.create({});
    // loading.present();
    // loading.dismissAll();
  };

  get errorControl() {
    return this.loginForm.controls;
  }
  showTechnicalError(type = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    var message ='Technical error, Please '+msg;
    this.componentService.presentToast(message, 'info');
  }

  submitForm = () => {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // if(this.remember == true){
      //   this.cookieService.put('su',this.loginForm.value.email);
      //   this.cookieService.put('sp',this.loginForm.value.password);
      // }
      // else {
      //   this.cookieService.put('su','');
      //   this.cookieService.put('sp','');
      // }
      //   this.cookieService.put('sr', this.remember);
        this.componentService.showLoader();
        this.loginForm.value['fcm_token'] = this.fcm_token;
        console.log( this.loginForm.value, "Values")
        this.APIService.makeRequest('loginUser',  this.loginForm.value).subscribe((res:any)=>{
          this.componentService.dismissLoader();
        if(res['status'] == 1){
          if(res.data.status == 1){
            var redirect = localStorage.getItem('redirect_after');
            var redirect_id = localStorage.getItem('redirect_id');
            localStorage.clear();
            localStorage.setItem('APIURL',this.APIURL);
            if(this.platform.is('mobileweb')){
              localStorage.setItem('isBrowser',  'true');
            }else{
             localStorage.setItem('isBrowser',  'false');
            }
            var levels = [];
            var string,encrypted;
            localStorage.setItem('levelOpened', '0');
            localStorage.setItem('userinfo',  res.data._id);
            localStorage.setItem('userName',  res.data.name);
            localStorage.setItem('userImage', res.data.image); 
            localStorage.setItem('userCompany', res.data.company); 
            // this.events.publish('username:changed', res);
            string = 'level0#' + res.data._id;
            var password = res.data._id;
            encrypted = CryptoJS.AES.encrypt(string, password);
            levels.push(encrypted.toString());
            string = 'level1#' + res.data._id;
            encrypted = CryptoJS.AES.encrypt(string, password);
            levels.push(encrypted.toString());
            localStorage.setItem('alllevel', JSON.stringify(levels));
            console.log(redirect, "redirect")
            this.componentService.presentToast("Login Successfully", 'success');
            if(redirect == 'my_transmittals'){
              // this.navCtrl.setRoot('bidding-page', {
              //   bidJobId: redirect_id,
              //   status: 9,
              // });
            }
            else if(redirect == 'file_sharing'){
              // this.navCtrl.setRoot('FilemanagerPage',{
              //   notis_redirect : '1'
              // });
            }
            else if(redirect == 'sites'){
              this.navCtrl.navigateRoot('SitesPage');
            }
            else if(redirect == 'recipts'){
              // this.navCtrl.setRoot('SiteReciptsPage',{
              //   siteId : redirect_id
              // });
            }
            else if(redirect == 'biddetails'){
              localStorage.setItem('unc_email','1');
              // this.navCtrl.setRoot('bidding-page',{
              //   bidJobId: redirect_id,
              //   status: '0',
              // });
            }
            else if(redirect == 'bidjobs'){
              // this.navCtrl.setRoot('bidjobs',{
              //   type : redirect_id
              // });
            }
            else{
              this.navCtrl.navigateRoot(['dashboard', '0']);
              // this.navCtrl.navigateRoot(['dashboard'] ,{state:{id:  '0'}});
            }               

          }
          // else if(data.data.status == 0){
          //    let toast = this.toastCtrl.create({
          //       message: 'Your account is deactivated by admin',
          //       duration: 3000,
          //       position : 'top',
          //       cssClass: 'info'
          //     });
          //     toast.present();

          // }else if(data.data.status == 2){
          //    let toast = this.toastCtrl.create({
          //       message: 'Please check your email to confirm your account',
          //       duration: 3000,
          //       position : 'top',
          //       cssClass: 'info'
          //     });
          //     toast.present();

          // }else if(data.data.status == 3){
          //    let toast = this.toastCtrl.create({
          //       message: 'Account Removed',
          //       duration: 3000,
          //       position : 'top',
          //       cssClass: 'danger'
          //     });
          //     toast.present();

          // }else{
          //     let toast = this.toastCtrl.create({
          //       message: 'Account removed',
          //       duration: 3000,
          //       position : 'top',
          //       cssClass: 'danger'
          //     });
          //     toast.present();
          // }
        }else{
          this.componentService.dismissLoader();
          this.componentService.presentToast('Invalid credentials.', 'danger');
        }
        }, (error:any)=>{
          console.log(error);
          this.componentService.dismissLoader();
        })
        // .subscribe((data)=>{
        //   console.log("enter success")
        // }, error=>{
        //   console.log(error);
        // });

        // this.LoginserviceProvider.login(this.email,this.password,this.fcm_token).subscribe((data)=>{
        //   if(data.status == 1){
        //       if(data.data.status == 1){
        //         var redirect = localStorage.getItem('redirect_after');
        //         var redirect_id = localStorage.getItem('redirect_id');
        //         localStorage.clear();
        //         localStorage.setItem('APIURL',this.APIURL);
        //         if(this.platform.is('core')){
        //           localStorage.setItem('isBrowser',  'true');
        //         }else{
        //          localStorage.setItem('isBrowser',  'false');
        //         }
        //         var levels = [];
        //         var string,encrypted;
        //         localStorage.setItem('levelOpened', '0');
        //         localStorage.setItem('userinfo',  data.data._id);
        //         localStorage.setItem('userName',  data.data.name);
        //         localStorage.setItem('userImage', data.data.image); 
        //         localStorage.setItem('userCompany', data.data.company); 
        //         this.events.publish('username:changed', data);
        //         string = 'level0#' + data.data._id;
        //         var password = data.data._id;
        //         encrypted = CryptoJS.AES.encrypt(string, password);
        //         levels.push(encrypted.toString());
        //         //localStorage.setItem('alllevel', JSON.stringify(levels));
        //         string = 'level1#' + data.data._id;
        //         encrypted = CryptoJS.AES.encrypt(string, password);
        //         levels.push(encrypted.toString());
        //         localStorage.setItem('alllevel', JSON.stringify(levels));
        //         console.log(redirect, "redirect")
        //         let toast = this.toastCtrl.create({
        //           message: 'Login Successfully',
        //           duration: 3000,
        //           position : 'top',
        //           cssClass: 'success'
        //         });
        //         toast.present();
        //         if(redirect == 'my_transmittals'){
        //           this.navCtrl.setRoot('bidding-page', {
        //             bidJobId: redirect_id,
        //             status: 9,
        //           });
        //         }
        //         else if(redirect == 'file_sharing'){
        //           this.navCtrl.setRoot('FilemanagerPage',{
        //             notis_redirect : '1'
        //           });
        //         }
        //         else if(redirect == 'sites'){
        //           this.navCtrl.setRoot('SitesPage');
        //         }
        //         else if(redirect == 'recipts'){
        //           this.navCtrl.setRoot('SiteReciptsPage',{
        //             siteId : redirect_id
        //           });
        //         }
        //         else if(redirect == 'biddetails'){
        //           localStorage.setItem('unc_email','1');
        //           this.navCtrl.setRoot('bidding-page',{
        //             bidJobId: redirect_id,
        //             status: '0',
        //           });
        //         }
        //         else if(redirect == 'bidjobs'){
        //           this.navCtrl.setRoot('bidjobs',{
        //             type : redirect_id
        //           });
        //         }
        //         else{
        //           console.log("else")
        //           this.navCtrl.setRoot('DashboardPage',{
        //             id : '0'
        //           });
        //         }               

        //       }else if(data.data.status == 0){
        //          let toast = this.toastCtrl.create({
        //             message: 'Your account is deactivated by admin',
        //             duration: 3000,
        //             position : 'top',
        //             cssClass: 'info'
        //           });
        //           toast.present();

        //       }else if(data.data.status == 2){
        //          let toast = this.toastCtrl.create({
        //             message: 'Please check your email to confirm your account',
        //             duration: 3000,
        //             position : 'top',
        //             cssClass: 'info'
        //           });
        //           toast.present();

        //       }else if(data.data.status == 3){
        //          let toast = this.toastCtrl.create({
        //             message: 'Account Removed',
        //             duration: 3000,
        //             position : 'top',
        //             cssClass: 'danger'
        //           });
        //           toast.present();

        //       }else{
        //           let toast = this.toastCtrl.create({
        //             message: 'Account removed',
        //             duration: 3000,
        //             position : 'top',
        //             cssClass: 'danger'
        //           });
        //           toast.present();
        //       }
        //     }else{
        //        let toast = this.toastCtrl.create({
        //         message: 'Invalid credentials.',
        //         duration: 3000,
        //         position : 'top',
        //         cssClass: 'danger'
        //       });
        //       toast.present();
        //     }
        //   loading.dismissAll()
        // },
        // err => {
        //     loading.dismissAll();
        //     this.showTechnicalError('1');
        // });
    } else {
      return console.log('Please provide all the required values!');
    }
  };

}
