import { Component , ViewChild, } from '@angular/core';
import { NavController, IonContent,Platform, AlertController,ToastController, MenuController, ModalController} from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen'; 
// import { EventService } from '../services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('mycontent') mycontent: IonContent;   
  rootPage:string;
  rootPageParams:any = {id : '0' };
  userId:string = '';  
  setWidth: any;      
  isBrowser: any;
  userImage: any; 
  userName: any;   
  loginId:any;  
  APIURL:any;
  is_recurring_billing:any;
  subscription_amount:any;
  is_activated_license:any;
  API_ENDPOINT_URL:any;
  remove = {};
  pages: Array<{title: string, component: any, icon: string}>;
  removeAcc='removeAccount';
  constructor(public nav : NavController, public platform: Platform, public alertCtrl: AlertController,public toastCtrl: ToastController, public menu: MenuController, public modalCtrl: ModalController) {
// private fcm: FCM
    // events.subscribe('is_license_activated:changed', (is_license_activated:any) => {
    //   this.getUsersubscriptions();
    // });

    var API_ENDPOINT_URI = 'https://www.serrare.com:3002';
    localStorage.setItem('API_ENDPOINT_URL',API_ENDPOINT_URI+'/'); 
    localStorage.setItem('APIURL',API_ENDPOINT_URI); 
    
    // events.subscribe('username:changed', (username:any) => {  
        localStorage.setItem('API_ENDPOINT_URL',API_ENDPOINT_URI+'/'); 
        localStorage.setItem('APIURL',API_ENDPOINT_URI); 
        this.APIURL = localStorage.getItem('APIURL');
        this.API_ENDPOINT_URL = localStorage.getItem('API_ENDPOINT_URL');
        this.userImage = localStorage.getItem('userImage');
        this.userName = localStorage.getItem('userName'); 
        this.userId = localStorage.getItem('userinfo') || '';
        this.isBrowser = localStorage.getItem('isBrowser');
        if(this.userId != '' && this.userId != undefined && this.userId != null){
          this.getUsersubscriptions();
          this.getNavigations();
        }
    // }); 

    // events.subscribe('no_recurring:changed', (username:any) => {  
    //   var obj = { title: 'Upgrade Package', component: 'PricingPage', icon: "pricetag-outline" }
    //   this.pages.splice(3,0,obj);
    // });


    this.platform = platform;
    this.loginId = localStorage.getItem('userinfo');
    this.userImage = localStorage.getItem('userImage');
    this.userName = localStorage.getItem('userName');
    this.initializeApp();
    this.isBrowser = localStorage.getItem('isBrowser');
    this.APIURL = localStorage.getItem('APIURL');
    this.API_ENDPOINT_URL = localStorage.getItem('API_ENDPOINT_URL');
    // console.log(this.isBrowser);

    this.getNavigations();

    if(this.platform.is('mobileweb')){
      localStorage.setItem('isBrowser',  'true');
        //console.log("Run on browser");
    }else{
      localStorage.setItem('isBrowser',  'false');
        //console.log("Run on device");
        // this.fcm.onNotification().subscribe(data => {
        //   if(data.wasTapped){
        //     console.log("Received in background");
        //   } else {
        //     console.log("Received in foreground");
        //   };
        // });
    }

    this.userId = localStorage.getItem('userinfo') || '';
    if(localStorage.getItem('userinfo') == '' || localStorage.getItem('userinfo') == undefined || localStorage.getItem('userinfo') == null){
      this.rootPage = 'login';
    }else{
      this.rootPage = 'dashboard';
    } 

  };

  ngAfterViewInit() {
    
    }

  getNavigations() 
  {
    this.pages = [
        { title: 'Profile', component: 'ProfilePage', icon: "ios-person-outline" },
        { title: 'License', component: 'LicensePage', icon: "ribbon" },
        { title: 'History', component: 'HistoryPage', icon: "clock-outline" },
        { title: 'Upgrade Package', component: 'PricingPage', icon: "pricetag-outline" },
        // { title: 'Transmittals', component: 'DirectTransmittalsPage', icon: "paper-plane" },
      ];
  }

  getUsersubscriptions()
  {
    // this.companyProvider.getUserCurrentSubscription(this.userId).subscribe((subscription:any)=>{  
    //   this.subscription_amount = subscription.amount;
    //   this.is_activated_license = subscription.is_activated_license;
    //   this.is_recurring_billing = subscription.is_recurring_billing;
    //   if(this.is_recurring_billing == '1')
    //   {
    //     this.pages.splice(3,1);
    //   }
    // });
  }

  setProfile(event:any){
    this.userImage = localStorage.getItem('userImage');
    this.userName = localStorage.getItem('userName');
  };

  ionViewDidLoad(){
    this.userImage = localStorage.getItem('userImage');
    this.userName = localStorage.getItem('userName');
  };

  authenticateUser(){
    var current_url = document.URL.split('#')[1];
    this.loginId = localStorage.getItem('userinfo');
      if(this.loginId == '' || this.loginId == undefined || this.loginId == null){
          if(current_url != undefined)
          {
            if(current_url.search('bidding') >= 0 || current_url.search('direct-transmittals') >= 0 || current_url.search('edit-dir-transmittal') >= 0 || current_url.search('dir-transmittal-details') >= 0){
              if(current_url.search('/0') >= 0){
                this.nav.navigateRoot('login');
              }
            }
            else{
              this.nav.navigateRoot('login');
            }
          }
          else{
            this.nav.navigateRoot('login'); 
          }
        }
        // this.events.publish('level:app_loaded', '');
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      if(this.platform.is('android')) {
            // this.statusBar.overlaysWebView(false);
            // this.statusBar.backgroundColorByHexString('#1976d2');
        }
      // this.splashScreen.hide();
      var current_url = document.URL.split('#')[1];
      if(this.loginId == '' || this.loginId == undefined || this.loginId == null){
          if(current_url != undefined)
          {
            if(current_url.search('bidding') >= 0 || current_url.search('direct-transmittals') >= 0){
              if(current_url.search('/0') >= 0){
                this.nav.navigateRoot('login');
              }
            }
            else{
              this.nav.navigateRoot('login');
            }
          }
          else
          {
            this.nav.navigateRoot('login'); 
          }
        }
    });
  }

  async openPage(page:any) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    var alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (alllevel) {
        alllevel.forEach((value:any) => {
            var decrypted = CryptoJS.AES.decrypt(value, userId||'');
            if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                isLevelOpened = true;
            }
        });
    }
    if(this.is_activated_license == '0' && page.title == 'Manage Jobs')
    {
      let modal = await this.modalCtrl.create({
        component: 'UpdateLicensePage'
      })
        modal.onDidDismiss().then((data:any) => {
          if(data != null && data != undefined)
          {
            if(data == '1')
            {

              // let toast = this.toastCtrl.create({
              //   message: 'License has been updated successfully.',
              //   duration: 3000,
              //   position : 'top',
              //   cssClass: 'success'
              //  });
              //  toast.present(); 
               this.getUsersubscriptions();
               this.goToPages(isLevelOpened,page);
            }
          }
       });
    await  modal.present();
    }
    // else if(this.subscription_amount !== '0' && page.title == 'Upgrade Package')
    // {
    //   let toast = this.toastCtrl.create({
    //       message: 'You have already upgraded your subscription.',
    //       duration: 3000,
    //       position: 'top',
    //       cssClass: 'info'
    //     });
    //     toast.present();
    // }
    else
    {
      this.goToPages(isLevelOpened,page);
    }
  };

  goToPages(isLevelOpened:any,page:any)
  {
    if (!isLevelOpened) {
        if(page.title == 'Upgrade Package' || page.title == 'Manage Jobs'){
          // let toast = this.toastCtrl.create({
          //   message: 'Please open level first.',
          //   duration: 3000,
          //   position : 'top',
          //   cssClass: 'info'

          // });
          // toast.present();
        }else{
           this.nav.navigateRoot(page.component,{state:{
            is_direct : '0'
           }
            
           });
        }
      }else{
         this.nav.navigateRoot(page.component,{ state:{
          is_direct : '0'
         }
         });
      }
  }

  Logout (){
      localStorage.removeItem('level0');
      localStorage.removeItem('level1');
      localStorage.removeItem('level2');
      localStorage.removeItem('level3');
      localStorage.removeItem('passinfo');
      localStorage.removeItem('count');
      localStorage.removeItem('userinfo');
      localStorage.removeItem('alllevel');
      localStorage.removeItem('userName');
      localStorage.removeItem('userImage');
      this.loginId = null;
      this.nav.navigateRoot('login');   
  }

 async removeAccount(){

   let alert = await this.alertCtrl.create({
                  header: 'Are you sure you want to Remove Account ?',
                 buttons: [
                    {
                      text: 'No',
                      handler: (data:any) => {
                        // console.log('Cancel clicked');
                      }
                    },
                    {
                      text: 'Yes',
                      handler: (data:any) => {

                      this.remove = {
                          userId : localStorage.getItem('userinfo'),
                          status : 3
                       }
                        //  let body = JSON.stringify(this.remove);
                        //   let headers = new Headers({ 'Content-Type': 'application/json' });
                        //   let options = new RequestOptions({ headers: headers });
                        //    return this.http.put(this.API_ENDPOINT_URL+this.removeAcc, body, options)
                        //        .map(res => res.json())
                        //        .subscribe(data => {
                        //         let toast = this.toastCtrl.create({
                        //              message: 'Account Removed Successfully',
                        //              duration: 3000,
                        //              position : 'top',
                        //              cssClass: 'success'
                        //            });
                        //           toast.present(); 
                        //           this.Logout();
                        //        })
                      
                      }
                    }
                  ]  
                });
        await alert.present();
  }
}
