import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, PopoverController, ModalController,    AlertController, ToastController, LoadingController, MenuController, IonApp} from '@ionic/angular';
import { ContactsPage} from '../../../pages/contacts/contacts.page';
import { EventService } from 'src/services/event.service';
import { HttpClient} from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import * as $ from 'jquery';
import HandyTimeAgo from 'handy-timeago';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @ViewChild('content') navCtrl: NavController;
  level0: string = 'false';
  level1: string = 'true';
  level2: string = 'true'; 
  level3: string = 'true';
  level4: string = 'true';
  alllevel: any;
  isBrowser: any;
  count: any;
  alert: any;
  APIURL: any;
  password:any;
  counts:any;
  zeroLevelCount:any;
  functionClick: Number = 0;
  userImage: any;
  data: Object = {};
  email: Object = {};
  sms: Object = {};
  checkDate: any;
  passinfo: any;
  sendData = {};
  items: Array < {} > ;
  lenthlevel1: number;
  lenthlevel2: number;
  lenthlevel3: number;
  lenthlevel4: number;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  unlockpassURL = 'addlevel';
  showdataUrl = 'allleveldata';
  notificationData = 'notification';
  notification0: any = [];
  notification1: any = [];
  notification2: any = [];
  notification3: any = [];
  notification4: any = [];
  smail0: any = [];
  smail1: any = [];
  smail2: any = [];
  smail3: any = [];
  smail4: any = [];
  loginId: any;
  displayGrid: boolean = false;
  allNotice: boolean = false;
  bellnotification: any = [];
  level0Notice: boolean = false;
  level1Notice: boolean = false;
  level2Notice: boolean = false;
  level3Notice: boolean = false;
  level4Notice: boolean = false;
  notificationType: any;
  otp: any;
  ans:any ='';
  level: any;
  imageUrl :string ;
  passwordModal: boolean = false;
  otpModal: boolean = false;
  otpNumber: any;
  modal = {
      password: ''
  };
  forgetPwdModal:boolean = false;
  showPasswordField:boolean = false;
  constructor(
    private app: IonApp, 
    public popoverCtrl: PopoverController, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public http: HttpClient, 
    public toastCtrl: ToastController, 
    public menuCtrl: MenuController, 
    public events: EventService, 
    public APIService:APIService,
    public componentService: ComponentService) {
      this.http = http;
      this.isBrowser = localStorage.getItem('isBrowser');
      this.imageUrl = this.API_ENDPOINT_URL+'images/';
      this.alllevel = JSON.parse(localStorage.getItem('alllevel') !);
      var userId = localStorage.getItem('userinfo');
      var isLevelOpened = false;
      if (this.alllevel) {
          this.alllevel.forEach((value) => {
              var decrypted = CryptoJS.AES.decrypt(value, userId || '');
              if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                  isLevelOpened = true;
              }
          });
      }

      $(document).click(function(event) {
          if (!$(event.target).hasClass('notification-section')) {
              $(".form_wrapper").hide();
          }
      });

      events.subscribe('username:changed', username => {
          this.APIURL = localStorage.getItem('APIURL');
          this.userImage = localStorage.getItem('userImage');
          if(this.isBrowser == 'false'){
              this.getAllNotifications();
              this.getZerolevels();
          }
      });

      events.subscribe('countChanged:changed', username => {
          this.getZerolevels();
      });

      events.subscribe('level:changed', username => {
          if(this.isBrowser == 'false'){
              this.getAllNotifications();
              this.getZerolevels();
          }
      });

      events.subscribe('level:its_opened', res => {
          this.showLevelOpenClose();
      });

      events.subscribe('read_mail:changed', level_number => {
          if(this.isBrowser == 'false'){
              this.getAllNotifications();
          }
      });

      this.APIURL = localStorage.getItem('APIURL');
      this.loginId = localStorage.getItem('userinfo');
      this.userImage = localStorage.getItem('userImage');
      var current_url = document.URL.split('#')[1];
      this.checkNavExist();
      if (this.loginId == '' || this.loginId == undefined || this.loginId == null) {
          if(current_url != undefined)
            {
              if(current_url.search('bidding') >= 0 || current_url.search('direct-transmittals') >= 0 || current_url.search('edit-dir-transmittal') >= 0 || current_url.search('dir-transmittal-details') >= 0){
                // console.log('ifffff 3')
                if(current_url.search('/0') >= 0){
                  // console.log('again iffff 3')
                  this.navCtrl.navigateRoot('login');
                }
              }
              else{
                // console.log('elseeee')
                this.navCtrl.navigateRoot('login');
              }
            }
            else
            {
              this.navCtrl.navigateRoot('login');
            }
      } else {
          this.showLevelOpenClose();
      }
      this.getAllNotifications();
      this.getZerolevels();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('username:changed');
    this.events.unsubscribe('countChanged:changed');
    this.events.unsubscribe('level:changed');
    this.events.unsubscribe('level:its_opened');
    this.events.unsubscribe('read_mail:changed');
  }

  showLevelOpenClose(){
      var userId = localStorage.getItem('userinfo');
      this.alllevel = JSON.parse(localStorage.getItem('alllevel')!);
      this.APIURL = localStorage.getItem('APIURL');
      if (this.alllevel) {
          this.level1 = 'true';
          this.level2 = 'true';
          this.level3 = 'true';
          this.level4 = 'true';
          this.alllevel.forEach((value) => {

              var decrypted = CryptoJS.AES.decrypt(value, userId || '');

              if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                  this.level1 = 'false';
                  localStorage.setItem('levelOpened', '1');
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                  this.level2 = 'false';
                  localStorage.setItem('levelOpened', '2');
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                  this.level3 = 'false';
                  localStorage.setItem('levelOpened', '3');
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                  this.level4 = 'false';
                  localStorage.setItem('levelOpened', '4');
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
                  this.level1 = 'true';
                  this.level2 = 'true';
                  this.level3 = 'true';
                  this.level4 = 'true';
                  localStorage.setItem('levelOpened', '0');
              }
          });
      }
  }

  timesAgo(date_time){
      return HandyTimeAgo(new Date(date_time).getTime());
  }

  getAllNotifications(){
      this.APIService.sendData('notify_count', {'senderId':localStorage.getItem('userinfo'), 'level': 4}).subscribe(async (counts:any) => {
          if(counts.status == '1'){
              this.counts = counts;
              this.APIService.sendData('notify', {'senderId':localStorage.getItem('userinfo'), 'level': 4}).subscribe((all_files :any) => {
                  this.notification0 = all_files.notify0;
                  this.notification1 = all_files.notify1;
                  this.notification2 = all_files.notify2;
                  this.notification3 = all_files.notify3;
                  this.notification4 = all_files.notify4;
                  // this.contacts = all_files.contacts;
                  this.smail0 = all_files.smail0;
                  this.smail1 = all_files.smail1;
                  this.smail2 = all_files.smail2;
                  this.smail3 = all_files.smail3;
                  this.smail4 = all_files.smail4;
              },
              err => {
                  this.showTechnicalError();
              });
          }
          else{
              let prompt = this.alertCtrl.create({
                  header: "Your account has been removed.",
                  buttons: [
                      {
                          text: 'Ok',
                          handler: data => {
                              this.Logout();
                          }
                      }
                  ]
              });
              (await prompt).present();
          }
      },
      err => {
          this.showTechnicalError();
      });
  }

  getZerolevels(){
      var loginId = localStorage.getItem('userinfo');
      this.APIService.getData('getContactList',loginId).subscribe((zerolevel_data:any)=>{
          if(zerolevel_data.length > 0)
          {
            var zeroLevels :any= [];
            zerolevel_data.forEach(function(zerolevel){
              // if(zerolevel.senderId != loginId && zerolevel.reciverSetLevel == '0')
              // {
              //   zeroLevels.push(zerolevel);
              // }
              if(zerolevel.senderId != loginId)
                {
                  if(zerolevel.reciverSetLevel == '0')
                  {
                    zeroLevels.push(zerolevel);
                  }
                }
                else
                {
                  if(zerolevel.senderSetLevel == '0')
                  {
                    zeroLevels.push(zerolevel);
                  }
                } 
            });
            this.zeroLevelCount = zeroLevels.length;
          }
          else
          {
              this.zeroLevelCount = '0';
          }
      },
      err => {
          this.showTechnicalError();
      });
  }

  Logout(){
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
    this.navCtrl.navigateRoot('login');   
  }

  presentPopover(myEvent) {
      this.level4Notice = false;
      this.level3Notice = false;
      this.level2Notice = false;
      this.level1Notice = false;
      this.level0Notice = false;
      this.allNotice = false;
      if (this.displayGrid) {
          this.displayGrid = false;
      } else {
          this.displayGrid = true;
      }
  };


  presentPopover1(myEvent1) {
      this.displayGrid = false;
      this.level4Notice = false;
      this.level3Notice = false;
      this.level2Notice = false;
      this.level1Notice = false;
      this.level0Notice = false;
      if (this.allNotice) {
          this.allNotice = false;
      } else {
          this.APIService.sendData('allNotification', {'userId':localStorage.getItem('userinfo'), 'level':1}).subscribe((all_files:any) => {
              this.bellnotification = all_files.data;
              this.allNotice = true;
          },
          err => {
              this.showTechnicalError();
          });
      }
  };

  async presentModalunlock(myEvent11) {
      let modal = this.modalCtrl.create({
        component:'UnlocklevelPage'
      });
      (await modal).present();
  }
  async doPrompt() {
      let prompt = this.alertCtrl.create({
          message: "Are you sure !",
          buttons: [{
                  text: 'Cancel',
                  handler: data => {
                      console.log('Cancel clicked');
                  }
              },
              {
                  text: 'Ok',
                  handler: data => {
                      console.log('Saved clicked');
                  }
              }
          ]
      });
      (await prompt).present();
  }
  openNotificationPage() {
      this.checkNavExist();
      this.navCtrl.navigateForward('notification');
  }
  openDashboardPage() {
      this.checkNavExist();
      this.navCtrl.navigateForward(['dashboard', "0"]);
  }

  onClickedOutside(event){
      if(this.count == 0){
          this.count = 1;
      }else{
          this.displayGrid = false;
          this.count = 0;
          this.level4Notice = false;
          this.level3Notice = false;
          this.level2Notice = false;
          this.level1Notice = false;
          this.level0Notice = false;
          this.allNotice = false;
      }
  };

  opennotification(level) {
      this.checkNavExist();
      this.notificationType = 'notify';
      localStorage.setItem('notifyType', 'notify');
      if (level == 0 ) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
              this.navCtrl.navigateForward('contacts', {state:{
                  isLevelZero : '0'
              }});
              return
          }
      this.allNotice = false;
      this.displayGrid = false;
      if (this.level1 == 'true') {
          this.componentService.presentToast( 'Please open level first.','danger');
      } else {
          localStorage.setItem('notifyLevel', level);
          if (level == 1 && this.notification1.length == 0) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
          this.componentService.presentToast('No Notification Yet!','info');

          } else if (level == 2 && this.notification2.length == 0) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
          this.componentService.presentToast('No Notification Yet!','info');

          } else if (level == 3 && this.notification3.length == 0) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
              this.componentService.presentToast('No Notification Yet!','info');

          } else if (level == 4 && this.notification4.length == 0) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
              this.componentService.presentToast('No Notification Yet!','info');

          } else if (level == 0 ) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
              this.navCtrl.navigateForward('contacts', {state:{
                  isLevelZero : '0'
              }});
          } else if (level == 1 && this.notification1.length > 0) {
              this.level0Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level4Notice = false;
              this.allNotice = false;
              this.displayGrid = false;
              if (this.level1Notice) {
                  this.count = 0;
                  this.level1Notice = false;
              } else {
                  this.level1Notice = true;
              }
              console.log(this.level1Notice)
          } else if (level == 2 && this.notification2.length > 0) {
              this.level0Notice = false;
              this.level3Notice = false;
              this.level4Notice = false;
              this.level1Notice = false;
              this.allNotice = false;
              this.displayGrid = false;
              if (this.level2Notice) {
                  this.count = 0;
                  this.level2Notice = false;
              } else {
                  this.level2Notice = true;
              }
          } else if (level == 3 && this.notification3.length > 0) {
              this.level0Notice = false;
              this.level4Notice = false;
              this.level2Notice = false;
              this.allNotice = false;
              this.level1Notice = false;
              this.displayGrid = false;
              if (this.level3Notice) {
                  this.count = 0;
                  this.level3Notice = false;
              } else {
                  this.level3Notice = true;
              }
          } else if (level == 4 && this.notification4.length > 0) {
              this.level0Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.allNotice = false;
              this.displayGrid = false;
              if (this.level4Notice) {
                  this.count = 0;
                  this.level4Notice = false;
              } else {
                  this.level4Notice = true;
              }
          }
      }
  };

  ngOnInit() {
      var levelOneArray :any= [];
      var levelSecondArray:any = [];
      var levelThirdArray:any = [];
      var levelFourthArray:any = [];
      var userId = localStorage.getItem('userinfo')
      let headers = new Headers({
          'Content-Type': 'application/json'
      });
      
      return this.http.get(this.API_ENDPOINT_URL+this.notificationData + '/' + userId).subscribe((data:any) => {
          // console.log(data);
          this.items = data;

          data.forEach(eachObj => {
              //console.log(eachObj);
              if (eachObj.level == 1) {
                  levelOneArray.push(eachObj);
                  this.lenthlevel1 = levelOneArray.length;
              } else if (eachObj.level == 2) {
                  levelSecondArray.push(eachObj)
                  this.lenthlevel2 = levelSecondArray.length;
              } else if (eachObj.level == 3) {
                  levelThirdArray.push(eachObj)
                  this.lenthlevel3 = levelThirdArray.length;
              } else {
                  levelFourthArray.push(eachObj)
                  this.lenthlevel4 = levelFourthArray.length;
              }
          })

          if (localStorage.getItem('levelOpened')) {
              this.passinfo = localStorage.getItem('levelOpened');
          } else {
              this.passinfo = 0;
          }

          if (localStorage.getItem('count')) {
              this.count = localStorage.getItem('count');
          } else {
              this.count = 0;
          }
      },
      err => {
          this.showTechnicalError();
      });
  };


  showMessages() {
      this.checkNavExist();
      this.navCtrl.navigateForward('MessagePage', {state:this.items})
  };

  //this.functionClick = 0;

  goToAddPassWordPage(level) {
      
      this.level = level;

      
      this.alllevel = JSON.parse(localStorage.getItem('alllevel')!);
      var userId = localStorage.getItem('userinfo');
      let headers = new Headers({
          'Content-Type': 'application/json'
      });
  
      return this.http.get(this.API_ENDPOINT_URL+this.showdataUrl + "/" + userId + "/" + level).subscribe((data:any) => {
          this.checkDate = data.data;
          // console.log(data);
          let newlevel = 0
          newlevel = level - 1;
          this.passinfo = localStorage.getItem('levelOpened');
          this.count = localStorage.getItem('count');
          if (this.count > 0) {
              if (level == 1) {
                  // console.log(this.alllevel);
                  if (newlevel < this.passinfo) {

                      if (level == 1 && this.passinfo == 2 || level == 1 && this.passinfo == 3 || level == 1 && this.passinfo == 4 || level == 1 && this.passinfo == 1) {
                          this.alert = this.alertCtrl.create({
                              subHeader: 'Are you sure you want to lock ?',
                              buttons: [{
                                  text: 'No',
                                  handler: data => {
                                      console.log('Cancel clicked');
                                      this.functionClick = 0;
                                  }
                              }, {
                                  text: 'Yes',
                                  handler: data => {
                                      this.functionClick = 0;
                                      for (var i = this.alllevel.length - 1; i >= 0; i--) {
                                          var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId || '');
                                          console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
                                          if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                                              this.alllevel.splice(i, 1);
                                              localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                          } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                                              this.alllevel.splice(i, 1);
                                              localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                          } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                                              this.alllevel.splice(i, 1);
                                              localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                          }
                                      }

                                      this.level2 = 'true';
                                      this.level3 = 'true';
                                      this.level4 = 'true';
                                      localStorage.setItem('levelOpened', '1');
                                      localStorage.setItem('count', '1');
                                      // this.openLevel.emit('1');
                                      this.events.publish('openLevel:changed', '1');
                                      this.levelOpend();
                                      this.events.publish('level:its_opened_footer', '');
                                  }
                              }]
                          });
                          this.alert.present();
                      }
                  }
              }

              if (level == 2) {
                  if (newlevel < this.passinfo) {
                      if (level == 2 && this.passinfo == 3 || level == 2 && this.passinfo == 1 || level == 2 && this.passinfo == 4 || level == 2 && this.passinfo == 2) {
                          this.alert = this.alertCtrl.create({
                              subHeader: 'Are you sure you want to lock ?',
                              buttons: [{
                                      text: 'No',
                                      handler: data => {
                                          this.functionClick = 0;
                                          console.log('Cancel clicked');
                                      }
                                  },
                                  {
                                      text: 'Yes',
                                      handler: data => {
                                          for (var i = this.alllevel.length - 1; i >= 0; i--) {
                                              var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId || '');
                                              console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
                                              if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                                                  this.alllevel.splice(i, 1);
                                                  localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                                                  this.alllevel.splice(i, 1);
                                                  localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                              }
                                          }
                                          this.level3 = 'true';
                                          this.level4 = 'true';
                                          localStorage.setItem('levelOpened', '2');
                                          localStorage.setItem('count', '2');
                                          this.events.publish('openLevel:changed', '2');
                                          this.levelOpend();
                                          this.events.publish('level:its_opened_footer', '');
                                      }
                                  }
                              ]
                          });
                          this.alert.present();
                      }
                  }
              }

              if (level == 3) {
                  if (newlevel < this.passinfo) {
                      if (level == 3 && this.passinfo == 4) {
                          this.alert = this.alertCtrl.create({
                              subHeader: 'Are you sure you want to lock ?',
                              buttons: [{
                                      text: 'No',
                                      handler: data => {
                                          console.log('Cancel clicked');
                                          this.functionClick = 0;
                                      }
                                  },
                                  {
                                      text: 'Yes',
                                      handler: data => {
                                          this.functionClick = 0;
                                          for (var i = this.alllevel.length - 1; i >= 0; i--) {
                                              var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId ||'');
                                              console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
                                              if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                                                  this.alllevel.splice(i, 1);
                                                  localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                              }
                                          }
                                          this.level4 = 'true';
                                          localStorage.setItem('levelOpened', '3');
                                          localStorage.setItem('count', '3');
                                          this.events.publish('openLevel:changed', '3');
                                          this.levelOpend();
                                          this.events.publish('level:its_opened_footer', '');
                                      }
                                  }
                              ]
                          });
                          this.alert.present();
                      }
                  }
              }
          }
          console.log(this.checkDate);
          if (this.checkDate) {
              if (this.checkDate.level == level) {
                  // console.log(level)
                  if (newlevel == this.passinfo) {
                      // console.log(this.alertCtrl);
                      this.passwordModal = true;
                      this.modal.password = '';
                  } else if (level == 1 && this.passinfo == 2 || level == 1 && this.passinfo == 3) {

                  } else if (level == 2 && this.passinfo == 3 || level == 2 && this.passinfo == 1) {

                  } else if (level == 3 && this.passinfo == 4) {

                  }
              }
          } else {
              if (newlevel == this.passinfo) {
                  console.log(level);
                  this.alert = this.alertCtrl.create({
                      subHeader: 'You have not added details for this level !!',
                      buttons: [{
                              text: 'Cancel',
                              handler: data => {
                                  console.log('Cancel clicked');
                                  this.functionClick = 0;
                              }
                          },
                          {
                              text: 'Manage this level',
                              handler: data => {
                                  this.functionClick = 0;
                                  localStorage.setItem('selectedLevel', level);
                                  this.checkNavExist();
                                  this.navCtrl.navigateForward('AddpasswordlevelPage', level);

                              }
                          }
                      ]

                  });
                  this.alert.present();
              }
          }

      },
      err => {
          this.showTechnicalError();
      });
      
  };
  dismissModal(){
      this.passwordModal = false;
  }

  openLevelUsingPassword(password){
    console.log(this.modal.password)
      if(password == undefined  || password == ''){
          this.componentService.presentToast('Please enter your level password','danger')
          return false;
      }else{
         this.componentService.showLoader();
          let headers = new Headers({
              'Content-Type': 'application/json'
          });
          return this.http.get(this.API_ENDPOINT_URL+this.unlockpassURL + "/" + this.level + "/" + password + '/' + localStorage.getItem('userinfo'))
          .subscribe((data:any) => {
              if (data.status == 1) {
                  localStorage.setItem('count', this.level);
                  var password,string,encrypted,levels,i;
                  if(this.level < 3){
                      
                      password = localStorage.getItem('userinfo'), levels = [];
                      this.passwordModal = false;
                      for(i=1; i <= this.level;i++){
                          string = 'level' + i +'#' + localStorage.getItem('userinfo');
                          encrypted = CryptoJS.AES.encrypt(string, password);
                          this.modal.password = '';
                          levels.push(encrypted.toString());
                      }
                  
                      localStorage.setItem('alllevel', JSON.stringify(levels));
                       if(this.level == 1){
                          this.level1 = "false";
                      }else if(this.level == 2){
                          this.level2 = "false";
                      }
                     
                      this.componentService.dismissLoader();
                      localStorage.setItem('levelOpened', this.level);
                      this.events.publish('openLevel:changed', '1');
                      this.events.publish('level:its_opened_footer', '');
                  }else{
                      if(this.level == 3){
                          if (data.data.isOn == true) {
                              var num = Math.floor(Math.random() * 90000) + 10000;
                              this.otpNumber = num;
                              this.email = {
                                  email: data.data.email,
                                  emailOtp: num,
                                  userId: localStorage.getItem('userinfo')
                              };
                              let body = JSON.stringify(this.email);
                              let headers = new Headers({
                                  'Content-Type': 'application/json'
                              });
                             
                              return this.http.post(this.API_ENDPOINT_URL+'sendMail', body)
                
                              .subscribe((data:any) => {
                                  this.componentService.presentToast('OTP Send on your mail.', 'success')
                                  this.passwordModal = false;
                                  this.otpModal = true;
                                  this.componentService.dismissLoader();
                         },
                              err => {
                                this.componentService.dismissLoader();
                                  this.showTechnicalError('1');
                              });
                          }else{
                              localStorage.setItem('count', '3');
                              password = localStorage.getItem('userinfo'), levels = [];
                              for(i=1; i <= this.level;i++){
                                  string = 'level' + i +'#' + localStorage.getItem('userinfo');
                                  encrypted = CryptoJS.AES.encrypt(string, password);
                                  this.password = '';
                                  levels.push(encrypted.toString());
                              }

                              localStorage.setItem('alllevel', JSON.stringify(levels));
                              this.level3 = 'false';
                              localStorage.setItem('levelOpened', '3');
                              this.passwordModal = false;
                              this.componentService.dismissLoader();

                              this.events.publish('openLevel:changed', '5');
                              this.levelOpend();
                              this.events.publish('level:its_opened_footer', '');
                          }
                      }else{
                          if (data.data.isOn == true) {
                              var numsms = Math.floor(Math.random() * 90000) + 10000;
                              this.otpNumber = numsms;
                              this.sms = {
                                  contact: data.data.contact,
                                  smsOtp: numsms,
                                  userId: localStorage.getItem('userinfo')
                              }
                              let body = JSON.stringify(this.sms);
                              let headers = new Headers({
                                  'Content-Type': 'application/json'
                              });
                             
                              return this.http.post(this.API_ENDPOINT_URL+'sendSms', body)
                             
                              .subscribe(data => {
                                  this.componentService.dismissLoader();
                                  this.componentService.presentToast( 'OTP send on your contact number.', 'success')
                                  this.passwordModal = false;
                                  this.otpModal = true;
                              },
                              err => {
                                 this.componentService.dismissLoader();
                                  this.showTechnicalError('1');
                              });
                          }else{
                              password = localStorage.getItem('userinfo'), levels = [];
                              this.passwordModal = false;
                              for(i=1; i <= this.level;i++){
                                  string = 'level' + i +'#' + localStorage.getItem('userinfo');
                                  encrypted = CryptoJS.AES.encrypt(string, password);
                                  this.modal.password = '';
                                  levels.push(encrypted.toString());
                              }
                          
                              localStorage.setItem('alllevel', JSON.stringify(levels));
                              this.level4 = "false";
                              this.componentService.dismissLoader();
                              localStorage.setItem('levelOpened', this.level);
                              this.events.publish('openLevel:changed', '4');
                              this.events.publish('level:its_opened_footer', '');  
                          }
                      }
                      
                  }
                  

              } else {
                  this.componentService.presentToast( 'Password incorrect', 'danger')
                  this.componentService.dismissLoader();
                  
              }
          },
          err => {
            this.componentService.dismissLoader();
              this.showTechnicalError('1');
          });
      }
  }


  dismissOtpModal (){
      this.otpModal = false;
  }

  validateOtp(otp){
      var password,encrypted,levels,i,string;
      if(this.level == 3){
          if(otp == undefined || otp == ''){
              this.componentService.presentToast('Please enter OTP.', 'danger')
              return false;

          }else if(otp != this.otpNumber){
              this.componentService.presentToast('Wrong otp.', 'danger')
 return false
          }else{
              localStorage.setItem('count', '3');
              password = localStorage.getItem('userinfo'), levels = [];
              for(i=1; i <= this.level;i++){
                  string = 'level' + i +'#' + localStorage.getItem('userinfo');
                  encrypted = CryptoJS.AES.encrypt(string, password);
                  this.modal.password = '';
                  levels.push(encrypted.toString());
              }

              localStorage.setItem('alllevel', JSON.stringify(levels));
              this.level3 = 'false';
              localStorage.setItem('levelOpened', '3');
              this.otpModal = false;
              this.events.publish('openLevel:changed', '5');
              this.levelOpend();
              this.events.publish('level:its_opened_footer', '');
          }
      }else{
          if(otp == undefined || otp == ''){
              this.componentService.presentToast('Please enter OTP.','danger')
              return false;

          }else if(otp != this.otpNumber){
              this.componentService.presentToast( 'Wrong otp.','danger')
              return false;

          }else{
              localStorage.setItem('count', '4');
              password = localStorage.getItem('userinfo'), levels = [];
              for(i=1; i <= this.level;i++){
                  string = 'level' + i +'#' + localStorage.getItem('userinfo');
                  encrypted = CryptoJS.AES.encrypt(string, password);
                  this.modal.password = '';
                  levels.push(encrypted.toString());
              }

              localStorage.setItem('alllevel', JSON.stringify(levels));
              this.level4 = 'false';
              localStorage.setItem('levelOpened', '4');
              this.otpModal = false;
              this.events.publish('openLevel:changed', '4');
              this.levelOpend();
              this.events.publish('level:its_opened_footer', '');
          }
      }
      
  };

  checkNavExist(){
      //  if(this.navCtrl == undefined){
      //     let nav = this.app.getActiveNav();
      //     // this.navCtrl = nav;
      // } 
  }

  lockAllLevel() {

      this.alert = this.alertCtrl.create({
          subHeader: 'Are you sure you want to lock ?',
          buttons: [{
                  text: 'No',
                  handler: data => {
                      console.log('Cancel clicked');
                  }
              },
              {
                  text: 'Yes',
                  handler: data => {
                      var levels :any= [];
                      var string = 'level0#' + localStorage.getItem('userinfo');
                      var password = localStorage.getItem('userinfo');
                      var encrypted = CryptoJS.AES.encrypt(string, password ||'');
                      levels.push(encrypted.toString());
                      // console.log(levels);
                      localStorage.setItem('alllevel', JSON.stringify(levels));
                      this.level1 = 'true';
                      this.level2 = 'true';
                      this.level3 = 'true';
                      this.level4 = 'true';

                      localStorage.setItem('levelOpened', '0');
                      this.passinfo = 0;
                      localStorage.setItem('count', '0');
                      this.events.publish('openLevel:changed', '0');
                      this.levelOpend();
                      this.events.publish('level:its_opened_footer', '');
                  }
              }
          ]

      });
      this.alert.present();
  };

  openSmailPage() {
       localStorage.setItem('openedLevel', null ||'');
       this.checkNavExist();
      this.navCtrl.navigateForward('small-inbox');
  };

  notification(level) {
      this.notificationType = 'notify';
      localStorage.setItem('notifyType', 'notify');
      this.allNotice = false;
      this.displayGrid = false;
      if (this.level1 == 'true') {
          this.componentService.presentToast(  'Please open level first.','danger')


      } else {
          localStorage.setItem('notifyLevel', level);
          if (level == 1 && this.notification1.length == 0) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
          this.componentService.presentToast( 'No Notification Yet!','info');

          } else if (level == 2 && this.notification2.length == 0) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
              this.componentService.presentToast( 'No Notification Yet!','info');

          } else if (level == 3 && this.notification3.length == 0) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
              this.componentService.presentToast( 'No Notification Yet!','info');

          } else if (level == 4 && this.notification4.length == 0) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
              this.componentService.presentToast( 'No Notification Yet!','info');

          } else if (level == 0 ) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.level0Notice = false;
              // let toast = this.toastCtrl.create({
              //     message: 'No Notification Yet!',
              //     duration: 3000
              // });
              // toast.present();
              this.checkNavExist();
              this.navCtrl.navigateForward('contacts');
          } else if (level == 0 && this.notification0.length > 0) {
              this.level4Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.allNotice = false;
              this.displayGrid = false;
              if (this.level0Notice) {
                  this.level0Notice = false;
              } else {
                  this.level0Notice = true;
              }
          } else if (level == 1 && this.notification1.length > 0) {
              this.level0Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level4Notice = false;
              this.allNotice = false;
              this.displayGrid = false;
              if (this.level1Notice) {
                  this.level1Notice = false;
              } else {
                  this.level1Notice = true;
              }
          } else if (level == 2 && this.notification2.length > 0) {
              this.level0Notice = false;
              this.level3Notice = false;
              this.level4Notice = false;
              this.level1Notice = false;
              this.allNotice = false;
              this.displayGrid = false;
              if (this.level2Notice) {
                  this.level2Notice = false;
              } else {
                  this.level2Notice = true;
              }
          } else if (level == 3 && this.notification3.length > 0) {
              this.level0Notice = false;
              this.level4Notice = false;
              this.level2Notice = false;
              this.allNotice = false;
              this.level1Notice = false;
              this.displayGrid = false;
              if (this.level3Notice) {
                  this.level3Notice = false;
              } else {
                  this.level3Notice = true;
              }
          } else if (level == 4 && this.notification4.length > 0) {
              this.level0Notice = false;
              this.level3Notice = false;
              this.level2Notice = false;
              this.level1Notice = false;
              this.allNotice = false;
              this.displayGrid = false;
              if (this.level4Notice) {
                  this.level4Notice = false;
              } else {
                  this.level4Notice = true;
              }
          }
      }
  };


  seeAllLevelNotifications(level) {
      this.checkNavExist();
      if (level == 0) {
          if (localStorage.getItem('notifyType') == 'smail') {
              this.navCtrl.navigateForward('small-inbox');
          } else {
              this.navCtrl.navigateForward('members');
          }
      } else {
          this.navCtrl.navigateForward('notification');
      }
  };

  mails(level) {
      this.checkNavExist();
      this.notificationType = 'smail';
      localStorage.setItem('notifyType', 'smail');
      if(level == 0){
          localStorage.setItem('openedLevel', level);
          this.navCtrl.navigateForward('small-inbox');
      }else if (this.level1 == 'true') {
        this.componentService.presentToast(  'Please open level first.','danger')

      } else {
          this.allNotice = false;
          this.displayGrid = false;
          if (this.level1 == 'true') {
            this.componentService.presentToast(  'Please open level first.','danger')

          } else {
              console.log(level);
              localStorage.setItem('notifyLevel', level);
              if (level == 1 && this.smail1.length == 0) {
                  this.level4Notice = false;
                  this.level3Notice = false;
                  this.level2Notice = false;
                  this.level1Notice = false;
                  this.level0Notice = false;
                  this.componentService.presentToast(  'No Message Yet','info');

              } else if (level == 2 && this.smail2.length == 0) {
                  this.level4Notice = false;
                  this.level3Notice = false;
                  this.level2Notice = false;
                  this.level1Notice = false;
                  this.level0Notice = false;
                  this.componentService.presentToast(  'No Message Yet','info');

              } else if (level == 3 && this.smail3.length == 0) {
                  this.level4Notice = false;
                  this.level3Notice = false;
                  this.level2Notice = false;
                  this.level1Notice = false;
                  this.level0Notice = false;
                  this.componentService.presentToast(  'No Message Yet','info');

              } else if (level == 4 && this.smail4.length == 0) {
                  this.level4Notice = false;
                  this.level3Notice = false;
                  this.level2Notice = false;
                  this.level1Notice = false;
                  this.level0Notice = false;
                  this.componentService.presentToast(  'No Message Yet','info');

              } else{
                  this.level4Notice = false;
                  this.level3Notice = false;
                  this.level2Notice = false;
                  this.level1Notice = false;
                  this.level0Notice = false;
                  localStorage.setItem('openedLevel', level);
                  this.navCtrl.navigateForward('small-inbox');
              }
          }
      }
  };

  SupportLoginUser() {
      var baseUrl = localStorage.getItem('baseUrl');
      localStorage.setItem('currentSupportId', localStorage.getItem('userinfo') || '');
      localStorage.setItem('currentSupportName', localStorage.getItem('userName') || '');
      localStorage.setItem('currentSupportImage', '');
      localStorage.setItem('currentSupportType', 'user');
      localStorage.setItem('currentNavbar', 'supportUserNav');
      window.open(baseUrl + '/#/tickets');
  };

  toggleMenu() {
      console.log('1')
      this.menuCtrl.toggle('right');
  };

  smail() {
      this.checkNavExist();
      localStorage.setItem('view', 'Inbox');
      this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
      var userId = localStorage.getItem('userinfo');
      var isLevelOpened = false;
      if (this.alllevel) {
        this.alllevel.forEach((value) => {
            console.log(value);
            var decrypted = CryptoJS.AES.decrypt(value, userId || '');
            if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                isLevelOpened = true;
            }
        });
      }

      if (!isLevelOpened) {
        this.componentService.presentToast('Please open level first.','danger');

      }else{
          localStorage.setItem('openedLevel', null ||'')
          this.navCtrl.navigateForward('small-inbox');
      }
     
  };

  file() {
      this.checkNavExist();
      this.alllevel = JSON.parse(localStorage.getItem('alllevel') ||'');
      var userId = localStorage.getItem('userinfo');
      var isLevelOpened = false;
      if (this.alllevel) {
        this.alllevel.forEach((value) => {
            console.log(value);
            var decrypted = CryptoJS.AES.decrypt(value, userId || '');
            if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                isLevelOpened = true;
            }
        });
      }

      if (!isLevelOpened) {
        this.componentService.presentToast('Please open level first.','danger');

      }else{
          this.navCtrl.navigateForward('file-manager');
      }
      
  };

  Invite() {
      this.checkNavExist();
      this.navCtrl.navigateForward('invite');
  };

  Wallets() {
      this.checkNavExist();
      this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
      var userId = localStorage.getItem('userinfo');
      var isLevelOpened = false;
      if (this.alllevel) {
        this.alllevel.forEach((value) => {
            console.log(value);
            var decrypted = CryptoJS.AES.decrypt(value, userId || '' );
            if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                isLevelOpened = true;
            }
        });
      }

      if (!isLevelOpened) {
        this.componentService.presentToast('Please open level first.','danger');

      }else{
          this.navCtrl.navigateForward('wallets');
      }
      
  };

  Contacts() {
      this.checkNavExist();
      this.navCtrl.navigateForward('contacts');
  };

  seeAllNotifications() {
      this.checkNavExist();
      this.navCtrl.navigateForward('MessagePage');
  };

  levelOpend() {
      // this.getAllNotifications();
  };

  forgotPassword(){
      this.forgetPwdModal = true;
      this.ans = '';
  };

  dismissPwdModal(){
      this.forgetPwdModal = false;
      this.showPasswordField = false;
      this.ans = '';
  };

  validateAnswer(ans){
    console.log(this.ans, "ans", ans)
      if(ans == '' || ans == undefined){
        this.componentService.presentToast('Answer is required.','danger');
          return false;
      }
      else if(this.checkDate.answer != ans){
        this.componentService.presentToast('Answer is incorrect for level' + this.level,'danger');
          return false;
      }else{
          this.showPasswordField = true;
      }
  };

  readNotis(nid,type,others = null,info:any = null){
      this.checkNavExist();
      this.onClickedOutside(null);
      this.APIService.getData('readNotis',nid).subscribe((read_notis)=>{
          // console.log('read successfully.')
      },
      err => {
          this.showTechnicalError();
      });
      if(type == 15 || type == 16 || type == 17 || type == 18 || type == 27 || type == 28 || type == 29 || type == 31){
          this.navCtrl.navigateForward('license');
      } 
      if(type == 1 || type == 9 || type == 33|| type == 34){
          this.openDashboardPage();
      }  
      if(type == 4 || type == 30){
          this.goToBidJobs();
      } 
      if(type == 8){
          if(info.inviteId != undefined && info.inviteId != null && info.inviteId != ''){
              this.navCtrl.navigateForward('bidding',{state:  {
                  bidJobId: info.inviteId,
                  status: null,
                  from_page: '1'
              }});
          }
          else{
              this.goToBidJobs();
          }
      }
      if(type == 7 || type == 26 || type == 36){
          this.goToJobs();
      } 
      if(type == 0 || type == 101 || type == 37){
          this.navCtrl.navigateForward('contacts');
      }
      if(type == 2){
          this.openSmailPage();
      }
      if(type == 3 || type == 6 || type == 19 || type == 20 || type == 21 || type == 22 || type == 23 || type == 24 || type == 25){
          this.openFilesPage();
      }
      if(type == 32){
          this.navCtrl.navigateForward('small-inbox',{ state: {
              'notis' : '32',
              '_id' : others
          }});
      } 
      if(type == 35 || type == 5){
          this.navCtrl.navigateForward('small-inbox');
      }       
  }

  goToBidJobs(){
      this.checkNavExist();
      this.navCtrl.navigateForward('bidjobs',{state:{
          type: '0'
      }});
  };

  goToJobs(){
      this.checkNavExist();
      this.navCtrl.navigateForward('managejob',{state:{
          is_direct : '0'
      }});
  };

  openFilesPage(){
      this.checkNavExist();
      this.navCtrl.navigateForward('file-manager',{state:{
        notis_redirect : '1'
      }});
  };

  showTechnicalError(type :any= null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
        this.componentService.presentToast('Technical error, Please '+msg,'info')
  }
}
