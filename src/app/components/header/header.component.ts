import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, PopoverController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
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
  isPopoverOpen:any
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
  constructor(
    public navCtrl: NavController,
    public APIService: APIService,
    public componentService: ComponentService,
    public alertCtrl: AlertController,
    public popoverController:PopoverController
  ) { }

  ngOnInit() {
    this.getAllNotifications();
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  presentNotificationPopover(e: Event) {
    this.isNotiOpen = true;
    this.isPopoverOpen =true;
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
    this.navCtrl.navigateRoot(['dashboard', 0]);
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
    this.navCtrl.navigateForward('notification');
  };
  onClickedOutside(event) {
    console.log(this.count )
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
  
  smailPage() {
    this.navCtrl.navigateRoot(['small-inbox']);
  }
  contactsPage() {
    this.navCtrl.navigateRoot(['contacts']);
  }
  fileManagerPage() {
    this.navCtrl.navigateRoot(['file-manager']);
  }
  bidJobsPage() {
    this.navCtrl.navigateRoot(['bidjobs']);
  }
  membersPage() {
    this.navCtrl.navigateRoot(['members']);
  }
  invitePage() {
    this.navCtrl.navigateRoot(['invite']);
  }
  walletPage() {
    this.navCtrl.navigateRoot(['wallet']);
  }
  ngOnDestroy(){
   
    this.popoverController.dismiss();
  }
}
