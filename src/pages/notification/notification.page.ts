import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, LoadingController, ModalController, AlertController, ToastController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { EventService } from 'src/services/event.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage {
  notifications: any;
  isBrowser: any;
  API_ENDPOINT_URL: any = localStorage.getItem('API_ENDPOINT_URL');
  imageUrl: string;
  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public componentService: ComponentService,
    public APIService: APIService,
    public events: EventService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public http: HttpClient) {
    this.imageUrl = this.API_ENDPOINT_URL + 'images/';
    this.isBrowser = localStorage.getItem('isBrowser');
  }

  ngOnInit() {
    this.componentService.showLoader();
    this.APIService.sendData('allNotification', { 'userId': localStorage.getItem('userinfo'), 'level': localStorage.getItem('notifyLevel') }).subscribe((all_files: any) => {
      this.componentService.dismissLoader()
      this.notifications = all_files.data;
    },
      err => {
        this.componentService.dismissLoader()
        this.showTechnicalError();
      });
  }

  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  async delete(nid, index) {
    let alert = this.alertCtrl.create({
      header: 'Are you sure?',
      message: '',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.componentService.showLoader();
            this.APIService.sendData('deleteNotis', { 'id': nid }).subscribe((result: any) => {
              this.componentService.dismissLoader()
              if (result.status == 1) {
                this.notifications.splice(index, 1);
                this.events.publish('big_bell_update:changed', '');
                this.componentService.presentToast('Notification removed.', 'success');
              }
              else {
                this.componentService.presentToast('Error, please try later.', 'danger');
              }
            },
              err => {
                this.componentService.dismissLoader()
                this.showTechnicalError('1');
              });
            // deleteNotis
          }
        }
      ]
    });
    (await alert).present();
  }

  async removeAll() {
    let alert = this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'It will remove all notifications from all of the levels for you.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.componentService.showLoader();
            var userId = localStorage.getItem('userinfo');
            this.APIService.sendData('removeAllNotis', { 'userId': userId }).subscribe((result: any) => {
              this.componentService.dismissLoader();
              if (result.status == 1) {
                this.notifications = [];
                this.events.publish('big_bell_update:changed', '');
                this.componentService.presentToast('All notifications removed.', 'success');
              }
              else {
                this.componentService.presentToast('Error, please try later.', 'danger');
              }
            },
              err => {
                this.componentService.dismissLoader()
                this.showTechnicalError('1');
              });
            // deleteNotis
          }
        }
      ]
    });
    (await alert).present();
  }

  readNotification(notification) {
    this.http.put(this.API_ENDPOINT_URL+'readNotification', { 'senderId': localStorage.getItem('userinfo'), 'notificationId': notification }).subscribe((all_files) => {
      //this.events.publish('level:changed', all_files);
    },
      err => {
        this.showTechnicalError('1');
      });
  };

  // presentPopover1(myEvent1) {
  //   let popover = this.popoverCtrl.create('AddnotificationPage');
  //   popover.present({
  //     ev: myEvent1
  //   });
  // }

  async presentModal(myEvent1) {
    let modal = await this.modalCtrl.create({
      component: 'ModalsPage',
      componentProps: {
        ev: myEvent1
      }
    });
    await modal.present();
    // let modal = this.modalCtrl.create('ModalsPage');
    // modal.present({
    //   ev: myEvent1
    // });
  };

  root() {
    this.navCtrl.navigateRoot('dashboard');
  }

  goToDash(nid) {
    this.componentService.showLoader();
    this.APIService.getData('readNotis', nid).subscribe((read_notis) => {
      this.componentService.dismissLoader()
      this.navCtrl.navigateRoot('dashboard');
    },
      err => {
        this.componentService.dismissLoader()
        this.showTechnicalError('1');
      });
  }

  openBidPage(type = '0') {
    this.navCtrl.navigateForward('bidjobs', {
      state: {
        type: '0'
      }
    });
  };

  openTransmittalPage(info) {
    if (info.inviteId != undefined && info.inviteId != null && info.inviteId != '') {
      this.navCtrl.navigateForward('bidding-page', {
        state: {
          bidJobId: info.inviteId,
          status: 5,
          go_transmittal: '1'
        }
      });
    }
    else {
      this.openBidPage();
    }
  };

  openRfiPage(info) {
    if (info.inviteId != undefined && info.inviteId != null && info.inviteId != '') {
      this.navCtrl.navigateForward('bidding-page', {
        state: {
          bidJobId: info.inviteId,
          status: null,
          from_page: '1'
        }
      });
    }
    else {
      this.openBidPage();
    }
  }

  openJobPage() {
    this.navCtrl.navigateForward('managejob', {
      state: {
        is_direct: '0'
      }
    });
  };

  openRFIPage(others, info) {
    var switched_comp = localStorage.getItem('switched_comp');
    if (switched_comp == info.companyId) {
      localStorage.setItem('active_job_breadcrumb', others);
      if (info.jobId != localStorage.getItem('currentJobId')) {
        localStorage.removeItem('saved_filter_list');
        localStorage.removeItem('saved_filter_trades');
        localStorage.removeItem('saved_filter_trade_names');
      }
      localStorage.setItem('currentJobId', info.jobId);
      this.navCtrl.navigateForward('rfis', { state: { jobId: info.jobId } });
    }
    else {
      this.componentService.presentToast('Please switch to company ' + info.companyName + ' to access the RFI page.', 'danger');
    }
  }

  openLicensePage(nid) {
    this.componentService.showLoader();
    this.APIService.getData('readNotis', nid).subscribe((read_notis) => {
      this.componentService.dismissLoader()
      this.navCtrl.navigateForward('license');
    },
      err => {
        this.componentService.dismissLoader()
        this.showTechnicalError('1');
      });

  };

  openFilesPage() {
    this.navCtrl.navigateForward('FilemanagerPage', {
      state: {
        notis_redirect: '1'
      }
    });
  };

  goToContacts() {
    this.navCtrl.navigateForward('contacts');
  };

  goToSmail(nid, others) {
    this.componentService.showLoader();
    this.APIService.getData('readNotis', nid).subscribe((read_notis) => {
      this.componentService.dismissLoader();
      this.navCtrl.navigateForward('SmailInboxPage', {
        state: {
          'notis': '32',
          '_id': others
        }
      });
    },
      err => {
        this.componentService.dismissLoader()
        this.showTechnicalError('1');
      });
  }

  openSmail(nid) {
    this.componentService.showLoader();
    this.APIService.getData('readNotis', nid).subscribe((read_notis) => {
      this.componentService.dismissLoader()
      this.navCtrl.navigateForward('SmailInboxPage');
    },
      err => {
        this.componentService.dismissLoader()
        this.showTechnicalError('1');
      });
  }
}

