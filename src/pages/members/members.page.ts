import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, LoadingController } from '@ionic/angular'
import { HttpClient } from '@angular/common/http';
// import { Socket } from 'ng-socket-io';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit {
  dialCode:any = "1";
  items: any;
  level: any;
  sendData = {};
  filterValue = '';
  resend = {}
  userId: any = '';
  isBrowser: any;
  baseUrl: any = localStorage.getItem('baseUrl');
  APIURL: any = localStorage.getItem('APIURL');
  allMembers: any = [];
  messages = [
    { name: 'demo 1', email: '01userdemo&#64;gmail.com', sent: 1 },
    { name: 'demo 2', email: '02userdemo&#64;gmail.com', sent: 1 },
    { name: 'demo 3', email: '03userdemo&#64;gmail.com', sent: 0 },
    { name: 'demo 4', email: '04userdemo&#64;gmail.com', sent: 0 },
    { name: 'demo 5', email: '05userdemo&#64;gmail.com', sent: 1 },
    { name: 'demo 6', email: '06userdemo&#64;gmail.com', sent: 0 },
    { name: 'demo 7', email: '07userdemo&#64;gmail.com', sent: 0 }
  ];

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public APIService: APIService,
    public componentService: ComponentService,
    // private socket: Socket
  ) {
    this.http = http;
  };

  ngOnInit() {
    this.isBrowser = localStorage.getItem('isBrowser');
    this.level = '1';
    this.componentService.showLoader()
    this.userId = localStorage.getItem('userinfo');
    this.APIService.getData('getUserList',this.userId).subscribe((data) => {
      this.componentService.dismissLoader();
      this.items = data;
      this.items.forEach((element, index) => {
        element[index] = "1"
      });
      this.allMembers = data;
    },
      err => {
        this.componentService.dismissLoader()
        this.showTechnicalError();
      });
  };

  root() {
    this.navCtrl.navigateRoot(['dashboard', 0]);
  }

  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  chanegLevel(selectedValue: any) {
    this.level = selectedValue;
  };

  sendInvitation(items, index) {
    this.sendData = {
      level: this.level,
      mails: items,
      senderId: localStorage.getItem('userinfo'),
      senderName: localStorage.getItem('userName'),
      senderSetLevel: this.level,
      status: '1',
      info: '0',
      send: '0',
      index: '0',
      share: '0',
      member_id: items.member_id
    }
    this.APIService.sendData('inviteMembers',this.sendData).subscribe((data:any) => {
      // this.socket.emit('new_notification', data.notify);
      this.componentService.presentToast('Invitation mail has been sent.', 'success');
      this.items[index].memberstatus = 1;
      this.items[index].senderId = this.userId;

      this.userId = localStorage.getItem('userinfo');
      this.APIService.getData('getUserList',this.userId).subscribe((data) => {
        this.allMembers = data;
        if (this.filterValue && this.filterValue != '') {
          this.items = this.allMembers.filter((item) => {
            //console.log(item.name);
            return (item.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1);
          })
        } else {
          this.items = this.allMembers;
        }
      },
        err => {
          this.showTechnicalError();
        });
    },
      err => {
        this.showTechnicalError('1');
      });
  };

  resendInvitation(items) {
    this.resend = {
      level: this.level,
      mails: items,
      senderName: localStorage.getItem('userName')
    };
    this.APIService.putData('inviteMembers',this.resend).subscribe((data:any) => {
      //console.log(data);
      // this.socket.emit('new_notification', data.notify);
      this.componentService.presentToast('Invitation Mail Send.', 'success');
      this.componentService.showLoader()
      this.userId = localStorage.getItem('userinfo');
      this.APIService.getData('getUserList',this.userId).subscribe((data) => {
        //console.log(data);
        this.componentService.dismissLoader()
        //console.log(data);
        this.allMembers = data;
        if (this.filterValue && this.filterValue != '') {
          this.items = this.allMembers.filter((item) => {
            //console.log(item.name);
            return (item.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1);
          })
        } else {
          this.items = this.allMembers;
        }
      },
        err => {
          this.componentService.dismissLoader()
          this.showTechnicalError();
        });
    },
      err => {
        this.showTechnicalError();
      });
  };

  setFilteredItems(ev) {
    let val = ev;
    this.filterValue = val;
    // if the value is an empty string don't filter the items
    if (val && val != '') {
      this.items = this.allMembers.filter((item) => {
        //console.log(item.name);
        return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.items = this.allMembers;
    }
  };

  acceptContact(contact) {
    var data = {
      memberId: contact.memberId,
      memberstatus: '2',
    };
    this.componentService.showLoader()
    return this.APIService.putData('accptinvitation',data).subscribe(data => {
      this.componentService.presentToast('Invitation has been accpted.', 'success');
      this.userId = localStorage.getItem('userinfo');
      this.APIService.getData('getUserList',this.userId).subscribe((data) => {
        //console.log(data);
        this.componentService.dismissLoader()
        //console.log(data);
        this.allMembers = data;
        if (this.filterValue && this.filterValue != '') {
          this.items = this.allMembers.filter((item) => {
            //console.log(item.name);
            return (item.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1);
          })
        } else {
          this.items = this.allMembers;
        }
      });
    },
      err => {
        this.componentService.dismissLoader()
        this.showTechnicalError('1');
      });
  };

  rejectContact(contact) {
    var data = {
      memberId: contact.memberId,
      memberstatus: 0,
      'action': 'reject'
    };


    this.componentService.showLoader()
    return this.APIService.putData('accptinvitation',data).subscribe(data => {
      // var newdata = data;
      this.userId = localStorage.getItem('userinfo');
      this.APIService.getData('getUserList',this.userId).subscribe((data) => {
        //console.log(data);
        this.componentService.dismissLoader()
        //console.log(data);
        this.allMembers = data;
        if (this.filterValue && this.filterValue != '') {
          this.items = this.allMembers.filter((item) => {
            //console.log(item.name);
            return (item.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1);
          })
        } else {
          this.items = this.allMembers;
        }
      },
        err => {
          this.componentService.dismissLoader()
          this.showTechnicalError();
        });
      this.componentService.presentToast('Invitation has been declined.', 'success');

    },
      err => {
        this.componentService.dismissLoader()
        this.showTechnicalError('1');
      });
  };


}
