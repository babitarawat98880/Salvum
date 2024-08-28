import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonApp, Platform, PopoverController, ModalController, AlertController, MenuController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import * as $ from 'jquery';
// import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import HandyTimeAgo from 'handy-timeago';
import timeago from 'timeago.js';
import { EventService } from 'src/services/event.service';
import { PushNotificationService } from 'ng-push-notification';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('popover') popover;
  @ViewChild('notipopover') notipopover;
  isOpen = false;
  isNotiOpen = false;
  isPopoverOpen: any
  counts: any;
  count: any;
  displayGrid: boolean = false;
  allNotice: boolean = false;
  bellnotification: any = [];
  level0Notice: boolean = false;
  level1Notice: boolean = false;
  level2Notice: boolean = false;
  level3Notice: boolean = false;
  level4Notice: boolean = false;
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
  level0: string = 'false';
  level1: string = 'true';
  level2: string = 'true';
  level3: string = 'true';
  level4: string = 'true';
  alllevel: any ='';;
  isBrowser: any;
  alert: any;
  APIURL: any;
  password: any;
  zeroLevelCount: any;
  functionClick: Number = 0;
  userImage: any;
  data: Object = {};
  email: Object = {};
  sms: Object = {};
  checkDate: any;
  passinfo: any;
  sendData = {};
  items: Array<{}>;
  API_ENDPOINT_URL: any = localStorage.getItem('API_ENDPOINT_URL');
  unlockpassURL = 'addlevel';
  showdataUrl = 'allleveldata';
  notificationData = 'notification';
  loginId: any;
  notificationType: any;
  otp: any;
  ans: any;
  level: any;
  new_notis: any;
  imageUrl: string;
  passwordModal: boolean = false;
  otpModal: boolean = false;
  otpNumber: any;
  isBackEnb: any;
  modal = {
    password: ''
  };
  forgetPwdModal: boolean = false;
  showPasswordField: boolean = false;
  contacts = [];
  order: string = 'created_on';
  reverse: boolean = true;
  userId: any = localStorage.getItem('userinfo');
  constructor(
    public platform: Platform,
    private app: IonApp,
    public navController: NavController,
    public APIService: APIService,
    public componentService: ComponentService,
    public alertCtrl: AlertController,
    public popoverController: PopoverController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public http: HttpClient,
    public menuCtrl: MenuController,
    public events: EventService,
    // private socket: Socket,
    private pushNotification: PushNotificationService,
    public router:Router) {
    this.http = http;
    this.imageUrl = this.API_ENDPOINT_URL + 'images/';
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    if(this.platform.is('mobileweb')){
      localStorage.setItem('isBrowser',  'false');
      this.isBrowser = 'false';
    }else{
      localStorage.setItem('isBrowser',  'true');
      this.isBrowser = 'true';
    }
    console.log(this.isBrowser, "sd")
    var userId = localStorage.getItem('userinfo');
    this.APIURL = localStorage.getItem('APIURL');
    this.loginId = localStorage.getItem('userinfo');
    this.userImage = localStorage.getItem('userImage');

    this.getUpdates().subscribe(new_notis => {
      // console.log('new notis')
      // console.log(new_notis)
      this.getAllNotifications();
      this.new_notis = new_notis;
      this.pushNotification.show(this.new_notis.message);
    });

    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value) => {
        var decrypted = CryptoJS.AES.decrypt(value, userId || '');
        if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
          isLevelOpened = true;
        }
      });
    }



    if (!isLevelOpened) {

    }

    $(document).click(function (event) {
      if (!$(event.target).hasClass('notification-section')) {
        $(".form_wrapper").hide();
      }
    });

    events.subscribe('username:changed', username => {
      this.APIURL = localStorage.getItem('APIURL');
      this.userImage = localStorage.getItem('userImage');
      this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
      this.loginId = localStorage.getItem('userinfo');
      if (this.isBrowser == 'true') {
        this.getAllNotifications();
        this.getZerolevels();
      }
    });

    events.subscribe('countChanged:changed', username => {
      this.getZerolevels();
    });

    events.subscribe('level:changed', username => {
      if (this.isBrowser == 'true') {
        this.getAllNotifications();
        this.getZerolevels();
      }
    });

    events.subscribe('big_bell_update:changed', username => {
      this.getAllNotifications();
    });

    events.subscribe('level:its_opened_footer', res => {
      this.showLevelOpenClose();
    });


    events.subscribe('read_mail:changed', level_number => {
      if (this.isBrowser == 'true') {
        this.getAllNotifications();
      }
    });

    events.subscribe('read_notiss:changed', level_number => {
      if (level_number == '0') {
        this.notification0.splice(0, 1);
      }
      else if (level_number == '1') {
        this.notification1.splice(0, 1);
      }
      else if (level_number == '2') {
        this.notification2.splice(0, 1);
      }
      else if (level_number == '3') {
        this.notification3.splice(0, 1);

      }
      else if (level_number == '4') {
        this.notification4.splice(0, 1);
      }
    });

    var current_url = document.URL.split('#')[1];
    this.checkNavExist();
    if (this.loginId == '' || this.loginId == undefined || this.loginId == null) {
      if (current_url != undefined) {

        if (current_url.search('bidding') >= 0 || current_url.search('direct-transmittals') >= 0) {
          // console.log('ifffff 2')
          if (current_url.search('/0') >= 0) {
            // console.log('again iffff 2')
            this.navController.navigateRoot('login');
          }
        }
        else {
          // console.log('elseeee')
          this.navController.navigateRoot('login');
        }
      }
      else {
        this.navController.navigateRoot('login');
      }
    } else {
      this.showLevelOpenClose();

    }
    this.getAllNotifications();
    this.getZerolevels();

  }


  ngOnInit() {
    this.getAllNotifications();
  }


  presentNotificationPopover(e: Event) {
    this.isNotiOpen = true;
    this.isPopoverOpen = true;
    this.displayGrid = false;
    this.level4Notice = false;
    this.level3Notice = false;
    this.level2Notice = false;
    this.level1Notice = false;
    this.level0Notice = false;
    if (this.allNotice) {
      this.count = 0;
      this.allNotice = false;
    } else {
      this.allNotice = true;
    }
    console.log(this.allNotice)
  };
  root() {
    this.navController.navigateRoot(['dashboard', 0]);
  }

  getAllNotifications() {
    this.APIService.sendData('notify_count', { 'senderId': localStorage.getItem('userinfo'), 'level': 4 }).subscribe(async (counts: any) => {
      if (counts.status == '1') {
        this.counts = counts;
        this.APIService.sendData('notify', { 'senderId': localStorage.getItem('userinfo'), 'level': 4 }).subscribe((all_files: any) => {
          this.notification0 = all_files.notify0;
          this.notification1 = all_files.notify1;
          this.notification2 = all_files.notify2;
          this.notification3 = all_files.notify3;
          this.notification4 = all_files.notify4;
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
      else {
        let prompt = this.alertCtrl.create({
          header: "Your account has been removed.",
          buttons: [
            {
              text: 'Ok',
              handler: data => {
                // this.Logout();
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
  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }
  seeAllNotifications() {
    this.onClickedOutside(null);
    this.popoverController.dismiss();
    localStorage.setItem('notifyLevel', '0');
    localStorage.setItem('notifyType', 'notify');
    this.navController.navigateForward('notification');
  };


  smailPage() {
    this.navController.navigateRoot('small-inbox')
  }
  contactsPage() {
    this.navController.navigateRoot('contacts');
  }
  fileManagerPage() {
    this.navController.navigateRoot('file-manager');
  }
  bidJobsPage() {
    this.navController.navigateRoot('bidjobs');
  }
  membersPage() {
    this.navController.navigateRoot('members');
  }
  invitePage() {
    this.navController.navigateRoot('invite');
  }
  walletPage() {
    this.navController.navigateRoot('wallet');
  }
  goToJobs() {
    // this.checkNavExist();
    this.onClickedOutside(null);
    this.navController.navigateRoot('managejob');
  }

  //   checkNavExist(){
  //     if(this.app.getActiveNav() == undefined){
  //         let nav = this.app.getActiveNav();
  //         // this.app.getActiveNav() = nav;
  //     } 
  // }

  ngOnDestroy() {

    this.popoverController.dismiss();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('username:changed');
    this.events.unsubscribe('countChanged:changed');
    this.events.unsubscribe('level:changed');
    this.events.unsubscribe('level:its_opened');
    this.events.unsubscribe('read_mail:changed');
    this.events.unsubscribe('read_notiss:changed');
    this.events.unsubscribe('big_bell_update:changed');
    // this.getUpdates().subscribe().unsubscribe();
    this.userId = null;
  }

  getUpdates() {
    var self = this;
    let observable = new Observable(observer => {
      // self.socket.on(self.userId, (data) => {
      //   observer.next(data);
      // });
    })
    return observable;
  }

  timesAgo(date_time) {
  
    var timeagoInstance = timeago();
    return timeagoInstance.format(date_time)
    // return HandyTimeAgo(new Date(date_time).getTime());
  }

  backButton() {
   this.navController.back();
  }

  showLevelOpenClose() {
    var userId = localStorage.getItem('userinfo');
    this.alllevel = JSON.parse(localStorage.getItem('alllevel')!);
    this.APIURL = localStorage.getItem('APIURL');
    if (this.alllevel) {
      this.level1 = 'true';
      this.level2 = 'true';
      this.level3 = 'true';
      this.level4 = 'true';
      this.alllevel.forEach((value) => {

        var decrypted = CryptoJS.AES.decrypt(value, userId ||'');
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
      console.log(this.level1,"sad")
    }
  }



  Logout() {
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
    this.navController.navigateRoot('login');
  }

  getZerolevels() {
    var loginId = localStorage.getItem('userinfo');
    this.APIService.getData('getContactList',loginId).subscribe((zerolevel_data:any) => {
      if (zerolevel_data.length > 0) {
        var zeroLevels:any = [];
        zerolevel_data.forEach(function (zerolevel) {
          if (zerolevel.senderId != loginId) {
            if (zerolevel.reciverSetLevel == '0') {
              zeroLevels.push(zerolevel);
            }
          }
          else {
            if (zerolevel.senderSetLevel == '0') {
              zeroLevels.push(zerolevel);
            }
          }
        });
        this.zeroLevelCount = zeroLevels.length;
      }
      else {
        this.zeroLevelCount = '0';
      }
    },
      err => {
        this.showTechnicalError();
      });
  }


  presentPopover(myEvent) {
    if(this.isOpen){
      this.isOpen = false;
    }else{
      this.isOpen = true;
    }
    this.level4Notice = false;
    this.level3Notice = false;
    this.level2Notice = false;
    this.level1Notice = false;
    this.level0Notice = false;
    this.allNotice = false;
    if (this.displayGrid) {
      this.count = 0;
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
      this.count = 0;
      this.allNotice = false;
    } else {
      this.allNotice = true;
      // this.contactserviceProvider.getAllNotification(localStorage.getItem('userinfo'), 1).subscribe((all_files) => {
      //     this.bellnotification = all_files.data;
      //     this.allNotice = true;
      // });
    }
  };

  async presentModalunlock(myEvent11) {
    let modal = await this.modalCtrl.create({
      component: 'UnlocklevelPage',
      componentProps: {
      
      }
    });
    modal.onDidDismiss().then((data: any) => {
     
    });
    await modal.present();
   
  }

  async doPrompt() {
    let prompt = this.alertCtrl.create({
      message: "Are you sure !",
      buttons: [{
        text: 'Cancel',
        handler: data => {
          //console.log('Cancel clicked');
        }
      },
      {
        text: 'Ok',
        handler: data => {
          //console.log('Saved clicked');
        }
      }
      ]
    });
    (await prompt).present();
  }

  openNotificationPage() {
    this.closeDropDown();
    this.checkNavExist();
    this.navController.navigateForward('notification');
  }

  openDashboardPage() {
    this.checkNavExist();
    this.navController.navigateRoot(['dashboard', '0']);
    this.onClickedOutside(null);
    this.closeDropDown();
  }

  setDashboardPage() {
    this.checkNavExist();
    this.navController.navigateRoot(['dashboard', '0']);
    this.onClickedOutside(null);
    this.closeDropDown();
    // this.isBackEnb = 1;
  }

  closeDropDown() {
    if ($(".ng2-dropdown-menu").hasClass("ng2-dropdown-menu--open") == true) {
      $(".ng2-dropdown-button").click();
    }
  }

  checkNavExist() {
    // if (this.app.getActiveNav() == undefined) {
    //   let nav = this.app.getActiveNav();
    //   // this.app.getActiveNav() = nav;
    // }
  }



  showMessages() {
    this.checkNavExist();
    this.navController.navigateForward('MessagePage', {state: this.items});
  };

  //this.functionClick = 0;

  goToAddPassWordPage(level) {
    // console.log(level)
    this.closeDropDown();
    this.level = level;
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId = localStorage.getItem('userinfo');
    return this.http.get(this.API_ENDPOINT_URL + this.showdataUrl + "/" + userId + "/" + level).subscribe((data:any) => {
      this.checkDate = data.data;
      // console.log(data);
      let newlevel = 0
      newlevel = level - 1;
      this.passinfo = localStorage.getItem('levelOpened');
      this.count = localStorage.getItem('count');
      // console.log(this.passinfo)
      if (this.count > 0) {
        if (level == 1) {
          if (newlevel < this.passinfo && newlevel != 0) {
             this.componentService.showLoader()
             
            return this.http.get(this.API_ENDPOINT_URL + this.showdataUrl + "/" + userId + "/" + level).subscribe((data:any) => {
              this.checkDate = data.data;
              this.componentService.dismissLoader()
              // console.log(this.alllevel);
              if (newlevel < this.passinfo) {
                if (level == 1 && this.passinfo == 2) {
                  this.alert = this.alertCtrl.create({
                    header: 'Are you sure you want to lock ?',
                    buttons: [{
                      text: 'Yes',
                      handler: data => {
                        this.functionClick = 0;
                        for (var i = this.alllevel.length - 1; i >= 0; i--) {
                          var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId ||'');
                          //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
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
                      }
                    },
                    {
                      text: 'No',
                      handler: data => {
                        //console.log('Cancel clicked');
                        this.functionClick = 0;
                      }
                    }]
                  });
                  this.alert.present();
                }
              }
            },
              err => {
                this.componentService.dismissLoader()
                this.showTechnicalError('1');
              });
          } else {
            if (level == 1 && this.passinfo > 1) {
              this.alert = this.alertCtrl.create({
                header: 'Are you sure you want to lock ?',
                buttons: [{
                  text: 'Yes',
                  handler: data => {
                    this.functionClick = 0;
                    for (var i = this.alllevel.length - 1; i >= 0; i--) {
                      var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId ||'');
                      //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
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
                    this.events.publish('openLevel:changed', '1');
                    this.levelOpend();
                  }
                },
                {
                  text: 'No',
                  handler: data => {
                    //console.log('Cancel clicked');
                    this.functionClick = 0;
                  }
                }]
              });
              this.alert.present();
            }
          }
        }

        if (level == 2) {
          if (newlevel < this.passinfo) {
             this.componentService.showLoader();
            return this.http.get(this.API_ENDPOINT_URL + this.showdataUrl + "/" + userId + "/" + level).subscribe((data:any) => {
              this.checkDate = data.data;
              this.componentService.dismissLoader()
              if (newlevel < this.passinfo) {
                if (level == 2 && this.passinfo > 2) {
                  this.alert = this.alertCtrl.create({
                    header: 'Are you sure you want to lock ?',
                    buttons: [
                      {
                        text: 'Yes',
                        handler: data => {
                          for (var i = this.alllevel.length - 1; i >= 0; i--) {
                            var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId ||'');
                            //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
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
                        }
                      },
                      {
                        text: 'No',
                        handler: data => {
                          this.functionClick = 0;
                          //console.log('Cancel clicked');
                        }
                      }
                    ]
                  });
                  this.alert.present();
                }
              }
            },
              err => {
                this.componentService.dismissLoader()
                this.showTechnicalError('1');
              });
          }
        }

        if (level == 3) {
          if (newlevel < this.passinfo) {
             this.componentService.showLoader()
              return this.http.get(this.API_ENDPOINT_URL + this.showdataUrl + "/" + userId + "/" + level).subscribe((data:any) => {
              this.checkDate = data.data;
              this.componentService.dismissLoader()
              if (newlevel < this.passinfo) {
                if (level == 3 && this.passinfo == 4) {
                  this.alert = this.alertCtrl.create({
                    header: 'Are you sure you want to lock ?',
                    buttons: [
                      {
                        text: 'Yes',
                        handler: data => {
                          this.functionClick = 0;
                          for (var i = this.alllevel.length - 1; i >= 0; i--) {
                            var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId ||'');
                            //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
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
                        }
                      },
                      {
                        text: 'No',
                        handler: data => {
                          //console.log('Cancel clicked');
                          this.functionClick = 0;
                        }
                      }
                    ]
                  });
                  this.alert.present();
                }
              }
            },
              err => {
                this.componentService.dismissLoader()
                this.showTechnicalError('1');
              });
          }
        }
      }
      //console.log(this.checkDate);
      if (this.checkDate) {
         this.componentService.showLoader()
         
        return this.http.get(this.API_ENDPOINT_URL + this.showdataUrl + "/" + userId + "/" + level).subscribe((data:any) => {
          this.checkDate = data.data;
          this.componentService.dismissLoader()
          if (this.checkDate.level == level) {
            // console.log(level)
            if (newlevel == this.passinfo) {
              // console.log(this.alertCtrl);
              this.modal.password = '';
              this.passwordModal = true;
            } else if (level == 1 && this.passinfo == 2 || level == 1 && this.passinfo == 3) {

            } else if (level == 2 && this.passinfo == 3 || level == 2 && this.passinfo == 1) {

            } else if (level == 3 && this.passinfo == 4) {

            }
          }
        },
          err => {
            this.componentService.dismissLoader()
            this.showTechnicalError('1');
          });
      } else {
         this.componentService.showLoader()
         
        return this.http.get(this.API_ENDPOINT_URL + this.showdataUrl + "/" + userId + "/" + level).subscribe((data:any) => {
          this.checkDate = data.data;
          this.componentService.dismissLoader()
          if (newlevel == this.passinfo) {
            this.alert = this.alertCtrl.create({
              header: 'You have not added details for this level !!',
              buttons: [{
                text: 'Cancel',
                handler: data => {
                  //console.log('Cancel clicked');
                  this.functionClick = 0;
                }
              },
              {
                text: 'Manage this level',
                handler: data => {
                  this.functionClick = 0;
                  localStorage.setItem('selectedLevel', level);
                  this.checkNavExist();
                  this.navController.navigateForward('AddpasswordlevelPage',level);
          }
              }
              ]

            });
            this.alert.present();
          }
        },
          err => {
            this.componentService.dismissLoader()
            this.showTechnicalError('1');
          });
      }
    },
      err => {
        this.showTechnicalError();
      });

  };

  dismissModal() {
    this.passwordModal = false;
  }

  openLevelUsingPassword(password) {
    //console.log(password)
    if (password == undefined || password == '') {
      this.componentService.presentToast('Please enter your level password','danger');
    } else {
       this.componentService.showLoader()
      return this.http.get(this.API_ENDPOINT_URL + this.unlockpassURL + "/" + this.level + "/" + password + '/' + localStorage.getItem('userinfo'))
          .subscribe((data:any) => {
          // console.log(data)
          if (data.status == 1) {
            localStorage.setItem('count', this.level);
            var password, levels, i, encrypted, string;
            if (this.level < 3) {

              password = localStorage.getItem('userinfo'), levels = [];
              this.passwordModal = false;
              for (i = 1; i <= this.level; i++) {
                string = 'level' + i + '#' + localStorage.getItem('userinfo');
                encrypted = CryptoJS.AES.encrypt(string, password);
                this.modal.password = '';
                levels.push(encrypted.toString());
              }

              localStorage.setItem('alllevel', JSON.stringify(levels));
              console.log(this.level);
              if (this.level == 1) {
                this.level1 = "false";
              } else if (this.level == 2) {
                this.level2 = "false";
              }
              this.componentService.dismissLoader()
              localStorage.setItem('levelOpened', this.level);
              this.events.publish('openLevel:changed', '1');
            } else {
              if (this.level == 3) {
                if (data.data.isOn == true) {
                  var num = Math.floor(Math.random() * 90000) + 10000;
                  this.otpNumber = num;
                  this.email = {
                    email: data.data.email,
                    emailOtp: num,
                    userId: localStorage.getItem('userinfo')
                  };
                  let body = JSON.stringify(this.email);
                  
                  return this.http.post(this.API_ENDPOINT_URL + 'sendMail', body)
                     .subscribe(data => {
                      this.componentService.presentToast('OTP Send on your mail.','success');
                      this.componentService.dismissLoader()
                      this.passwordModal = false;
                      this.otpModal = true;
                      this.modal.password = '';
                    },
                      err => {
                        this.componentService.dismissLoader()
                        this.showTechnicalError('1');
                      });
                } else {
                  localStorage.setItem('count', '3');
                  password = localStorage.getItem('userinfo'), levels = [];
                  for (i = 1; i <= this.level; i++) {
                    string = 'level' + i + '#' + localStorage.getItem('userinfo');
                    encrypted = CryptoJS.AES.encrypt(string, password);
                    this.password = '';
                    levels.push(encrypted.toString());
                  }
                  this.modal.password = '';
                  localStorage.setItem('alllevel', JSON.stringify(levels));
                  this.level3 = 'false';
                  localStorage.setItem('levelOpened', '3');
                  this.passwordModal = false;
                  this.componentService.dismissLoader()
                  this.events.publish('openLevel:changed', '5');
                  this.levelOpend();

                }

              } else {
                if (data.data.isOn == true) {
                  var numsms = Math.floor(Math.random() * 90000) + 10000;
                  this.otpNumber = numsms;
                  this.sms = {
                    contact: data.data.contact,
                    smsOtp: numsms,
                    userId: localStorage.getItem('userinfo')
                  }
                  let body = JSON.stringify(this.sms);
                  
                  return this.http.post(this.API_ENDPOINT_URL + 'sendSms', body)
                    .subscribe(data => {
                      this.componentService.presentToast( 'OTP send on your contact number.','success')
                this.componentService.dismissLoader()
                      this.passwordModal = false;
                      this.otpModal = true;
                      this.modal.password = '';
                    },
                      err => {
                        this.componentService.dismissLoader()
                        this.showTechnicalError('1');
                      });
                } else {
                  password = localStorage.getItem('userinfo'), levels = [];
                  this.passwordModal = false;
                  for (i = 1; i <= this.level; i++) {
                    string = 'level' + i + '#' + localStorage.getItem('userinfo');
                    encrypted = CryptoJS.AES.encrypt(string, password);
                    this.modal.password = '';
                    levels.push(encrypted.toString());
                  }

                  localStorage.setItem('alllevel', JSON.stringify(levels));
                  this.level4 = "false";
                  this.modal.password = '';
                  localStorage.setItem('levelOpened', this.level);
                  this.componentService.dismissLoader()
                  this.events.publish('openLevel:changed', '4');
                }
              }
            }
          } else {
            this.componentService.presentToast('Password incorrect','danger');
            this.componentService.dismissLoader()
          }
        },
          err => {
            this.componentService.dismissLoader()
            this.showTechnicalError();
          });
    }
  }


  dismissOtpModal() {
    this.otpModal = false;
  }

  validateOtp(otp) {
    var string, encrypted, i, password, levels;
    if (this.level == 3) {
      if (otp == undefined || otp == '') {
        this.componentService.presentToast('Please enter OTP.','danger');
      } else if (otp != this.otpNumber) {
        this.componentService.presentToast('Wrong otp.','danger');
      } else {
        localStorage.setItem('count', '3');
        password = localStorage.getItem('userinfo'), levels = [];
        for (i = 1; i <= this.level; i++) {
          string = 'level' + i + '#' + localStorage.getItem('userinfo');
          encrypted = CryptoJS.AES.encrypt(string, password);
          this.modal.password = '';
          levels.push(encrypted.toString());
        }
        localStorage.setItem('alllevel', JSON.stringify(levels));
        this.level3 = 'false';
        localStorage.setItem('levelOpened', '3');
        this.otpModal = false;
        this.otp = '';
        this.events.publish('openLevel:changed', '5');
        this.levelOpend();
      }
    } else {
      if (otp == undefined || otp == '') {
        this.componentService.presentToast('Please enter OTP.','danger');
      } else if (otp != this.otpNumber) {
        this.componentService.presentToast( 'Wrong otp.','danger');
      } else {
        localStorage.setItem('count', '4');
        password = localStorage.getItem('userinfo'), levels = [];
        for (i = 1; i <= this.level; i++) {
          string = 'level' + i + '#' + localStorage.getItem('userinfo');
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
      }
    }

  };

  lockAllLevel(vl) {
    this.closeDropDown();
    this.alert = this.alertCtrl.create({
      header: 'Are you sure you want to lock?',
      buttons: [
        {
          text: 'Yes',
          handler: data => {
            var levels:any = [];
            var string = 'level0#' + localStorage.getItem('userinfo');
            var password = localStorage.getItem('userinfo');
            var encrypted = CryptoJS.AES.encrypt(string, password || '');
            levels.push(encrypted.toString());
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
          }
        },
        {
          text: 'No',
          handler: data => {
            //console.log('Cancel clicked');
          }
        }
      ]

    });
    this.alert.present();
  };

  openSmailPage() {
    localStorage.setItem('openedLevel', null || '');
    this.checkNavExist();
    this.navController.navigateForward('small-inbox');
    this.closeDropDown();
  };

  opennotification(level) {
    this.closeDropDown();
    // console.log(level)
    this.notificationType = 'notify';
    localStorage.setItem('notifyType', 'notify');
    if (level == 0) {
      this.level4Notice = false;
      this.level3Notice = false;
      this.level2Notice = false;
      this.level1Notice = false;
      this.level0Notice = false;
      this.checkNavExist();
      this.navController.navigateForward('contacts', { state: { isLevelZero: '0' } });
      return
    }
    this.allNotice = false;
    this.displayGrid = false;
    if (this.level1 == 'true') {
      this.componentService.presentToast('Please open level first.', 'danger');
    } else {
      localStorage.setItem('notifyLevel', level);
      if (level == 1 && this.notification1.length == 0) {
        this.level4Notice = false;
        this.level3Notice = false;
        this.level2Notice = false;
        this.level1Notice = false;
        this.level0Notice = false;
        this.componentService.presentToast('No Notification Yet!', 'info');
      } else if (level == 2 && this.notification2.length == 0) {
        this.level4Notice = false;
        this.level3Notice = false;
        this.level2Notice = false;
        this.level1Notice = false;
        this.level0Notice = false;
        this.componentService.presentToast('No Notification Yet!', 'info');
      } else if (level == 3 && this.notification3.length == 0) {
        this.level4Notice = false;
        this.level3Notice = false;
        this.level2Notice = false;
        this.level1Notice = false;
        this.level0Notice = false;
        this.componentService.presentToast('No Notification Yet!', 'info');
      } else if (level == 4 && this.notification4.length == 0) {
        this.level4Notice = false;
        this.level3Notice = false;
        this.level2Notice = false;
        this.level1Notice = false;
        this.level0Notice = false;
        this.componentService.presentToast('No Notification Yet!', 'info');
      } else if (level == 0) {
        this.level4Notice = false;
        this.level3Notice = false;
        this.level2Notice = false;
        this.level1Notice = false;
        this.level0Notice = false;
        this.checkNavExist();
        this.navController.navigateForward('contacts', {
          state: {
            isLevelZero: '0'
          }
        });

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


  seeAllLevelNotifications(level) {
    this.checkNavExist();
    this.closeDropDown();
    if (level == 0) {
      if (localStorage.getItem('notifyType') == 'smail') {
        this.navController.navigateForward('small-inbox');
      } else {
        this.navController.navigateForward('members');
      }
    } else {
      this.navController.navigateForward('notification');
    }
  };

  members() {
    this.checkNavExist();
    this.onClickedOutside(null);
    this.navController.navigateForward('members');
  }

  mails(level) {
    this.closeDropDown();
    this.notificationType = 'smail';
    localStorage.setItem('notifyType', 'smail');
    this.checkNavExist();
    localStorage.setItem('openedLevel', level);
    this.navController.navigateForward('small-inbox');

  };

  SupportLoginUser() {
    var baseUrl :any = localStorage.getItem('APIURL');
    baseUrl = baseUrl.replace(':3002','');
    console.log(baseUrl)
    localStorage.setItem('currentSupportId', localStorage.getItem('userinfo') || '');
    localStorage.setItem('currentSupportName', localStorage.getItem('userName') || '');
    localStorage.setItem('currentSupportImage', '');
    localStorage.setItem('currentSupportType', 'user');
    localStorage.setItem('currentNavbar', 'supportUserNav');
    window.open('https://www.serrare.com/#/tickets');
  };

  toggleMenu() {
    this.menuCtrl.toggle('right');
  };

  smail() {
    this.closeDropDown();
    this.onClickedOutside(null);
    localStorage.setItem('view', 'Inbox');
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value) => {
        //console.log(value);
        var decrypted = CryptoJS.AES.decrypt(value, userId || '');
        if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
          isLevelOpened = true;
        }
      });
    }

    if (!isLevelOpened) {
      this.componentService.presentToast('Please open level first.', 'danger');
    } else {
      localStorage.setItem('openedLevel', null || '');
      this.checkNavExist();
      this.navController.navigateForward('small-inbox');
    }
  };

  file() {
    this.closeDropDown();
    this.onClickedOutside(null);
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value) => {
        //console.log(value);
        var decrypted = CryptoJS.AES.decrypt(value, userId || '');
        if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
          isLevelOpened = true;
        }
      });
    }

    if (!isLevelOpened) {
      this.componentService.presentToast('Please open level first.', 'danger');
    } else {
      this.checkNavExist();
      this.navController.navigateForward('FilemanagerPage');
    }

  };

  Invite() {
    this.checkNavExist();
    this.onClickedOutside(null);
    this.navController.navigateForward('invite');
  };

  Wallets() {
    this.onClickedOutside(null);
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value) => {
        // console.log(value);
        var decrypted = CryptoJS.AES.decrypt(value, userId || '');
        if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
          isLevelOpened = true;
        }
      });
    }

    if (!isLevelOpened) {
      this.componentService.presentToast('Please open level first.', 'danger');
    } else {
      this.checkNavExist();
      this.navController.navigateForward('wallets');
    }

  };

  Contacts() {
    this.onClickedOutside(null);
    this.checkNavExist();
    this.navController.navigateForward('contacts');


  };

  goToContacts() {
    this.checkNavExist();
    this.navController.navigateForward('contacts');
  };

  goToBidJobs() {
    this.checkNavExist();
    this.onClickedOutside(null);
    this.navController.navigateForward('bidjobs', {
      state: {
        type: '0'
      }
    });
  };


  openFilesPage() {
    this.closeDropDown();
    this.checkNavExist();
    this.navController.navigateForward('FilemanagerPage', {
      state: {
        notis_redirect: '1'
      }
    })
  };



  levelOpend() {
    this.events.publish('level:its_opened', '');
    // this.getAllNotifications();
  };

  forgotPassword() {
    // this.passwordModal = false;
    this.forgetPwdModal = true;
  };

  dismissPwdModal() {
    this.forgetPwdModal = false;
    this.showPasswordField = false;
    this.ans = '';
  };

  validateAnswer(ans) {
    if (ans == '' || ans == undefined) {
      this.componentService.presentToast('Answer is required.', 'danger');
    }
    else if (this.checkDate.answer != ans) {
      this.componentService.presentToast('Answer is incorrect for level' + this.level, 'danger')
    } else {
      this.showPasswordField = true;
    }
  };

  readNotis(nid, type, others: any = null, info: any = null) {
    this.closeDropDown();
    this.onClickedOutside(null);
    this.checkNavExist();

    this.APIService.getData('readNotis', nid).subscribe((read_notis) => {
    },
      err => {
        this.showTechnicalError();
      });
    if (type == 15 || type == 16 || type == 17 || type == 18 || type == 27 || type == 28 || type == 29 || type == 31) {
      this.navController.navigateForward('license');
    }
    if (type == 150) {
      this.navController.navigateForward('direct-transmittals');
    }
    if (type == 1 || type == 9 || type == 33 || type == 34) {
      this.openDashboardPage();
    }
    if (type == 4) {
      this.goToBidJobs();
    }
    if (type == 200) {
      this.checkNavExist();
      this.onClickedOutside(null);
      this.navController.navigateForward('bidjobs', { state: { type: '1' } })

    }
    if (type == 8) {
      if (info.inviteId != undefined && info.inviteId != null && info.inviteId != '') {
        this.navController.navigateForward('bidding', {
          state: {
            bidJobId: info.inviteId,
            status: null,
            from_page: '1'
          }
        });
      }
      else {
        this.goToBidJobs();
      }
    }

    if (type == 30) {
      if (info.inviteId != undefined && info.inviteId != null && info.inviteId != '') {
        this.navController.navigateForward('bidding', {
          state: {
            bidJobId: info.inviteId,
            status: 5,
            go_transmittal: '1'
          }
        });
      }
      else {
        this.goToBidJobs();
      }
    }
    if (type == 7) {
      var switched_comp = localStorage.getItem('switched_comp');
      if (switched_comp == info.companyId) {
        localStorage.setItem('active_job_breadcrumb', others);
        if (info.jobId != localStorage.getItem('currentJobId')) {
          localStorage.removeItem('saved_filter_list');
          localStorage.removeItem('saved_filter_trades');
          localStorage.removeItem('saved_filter_trade_names');
        }
        localStorage.setItem('currentJobId', info.jobId);
        this.navController.navigateForward('RfisPage', { state: { jobId: info.jobId } });
      }
      else {
        this.componentService.presentToast('Please switch to company ' + info.companyName + ' to access the RFI page.', 'danger');
      }
    }
    if (type == 26 || type == 36 || type == 38) {
      this.goToJobs();
    }
    if (type == 0 || type == 101 || type == 37) {
      this.goToContacts();
    }
    if (type == 2) {
      this.openSmailPage();
    }
    if (type == 3 || type == 6 || type == 19 || type == 20 || type == 21 || type == 22 || type == 23 || type == 24 || type == 25) {
      this.openFilesPage();
    }
    if (type == 32) {
      this.navController.navigateForward('small-inbox', {
        state: {
          'notis': '32',
          '_id': others
        }
      });
    }
    if (type == 35 || type == 5) {
      this.navController.navigateForward('small-inbox');
    }
  }

  onClickedOutside(event) {
    if (this.count == 0) {
      this.count = 1;
    } else {
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
}