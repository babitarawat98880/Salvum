import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { ContactslistPage } from '../contactslist/contactslist.page';
import { Router } from '@angular/router';
import { AddCoworkersPage } from '../add-coworkers/add-coworkers.page';
import { AddcontactPage } from '../addcontact/addcontact.page';
@Component({
  selector: 'app-trade-contacts',
  templateUrl: './trade-contacts.page.html',
  styleUrls: ['./trade-contacts.page.scss'],
})
export class TradeContactsPage {
  sorted_contacts: any;
  all_contacts: any;
  jobId: any;
  isBrowser: any;
  timestamp: any;
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  trades: any = [];
  trade_ids: any = [];
  tradeTypes: any = [];
  tradesType_names: any = [];
  filter_trades: any = [];
  filter_trade_names: any = [];
  filter_list: any = [];
  nav_filter: any = 'default';
  order_default: any = 'trade_name';
  order_contacts: any = 'date_created';
  order_default_p: any = false;
  order_advanced: any = 'trade_task';
  order_advanced_p: any = false;
  sort_icon: Boolean = true;
  all_coworkers: any;
  stateData:any='';
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public APIService: APIService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public componentService: ComponentService,
    public router:Router) {
    this.isBrowser = localStorage.getItem('isBrowser');
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    this.jobId =this.stateData['jobId'];
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    if (this.jobId == undefined) {
      var localJobId = localStorage.getItem('currentJobId');
      if (localJobId != '' && localJobId != undefined && localJobId != null) {
        this.jobId = localJobId;
      }
      else {
        this.navCtrl.navigateForward('managejob', {
          state: {
            is_direct: '0'
          }
        });
      }
    }
    this.getContacts();
  }

  ngOnInit() {
    this.caclHeight();
    if (JSON.parse(localStorage.getItem('saved_filter_list')!) != null && JSON.parse(localStorage.getItem('saved_filter_list')!) != undefined) {
      this.filter_list = JSON.parse(localStorage.getItem('saved_filter_list')!);
      this.filter_trades = JSON.parse(localStorage.getItem('saved_filter_trades')!);
      this.filter_trade_names = JSON.parse(localStorage.getItem('saved_filter_trade_names')!);
    }
  }

  saveFilters(filter_list, filter_trades, filter_trade_names) {
    localStorage.setItem('saved_filter_list', JSON.stringify(filter_list));
    localStorage.setItem('saved_filter_trades', JSON.stringify(filter_trades));
    localStorage.setItem('saved_filter_trade_names', JSON.stringify(filter_trade_names));
  }

  caclHeight() {
    var fixed_div = document.getElementById("calc_height_cont" + this.timestamp);
    if (fixed_div != null) {
      var fixed_div_height = fixed_div.offsetHeight;
      document.getElementById('fixed_height_cont' + this.timestamp)!.style.marginTop = fixed_div_height + 'px';
    }
  }

  showTechnicalError(type:any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  getContacts() {
    this.trades = [];
    this.trade_ids = [];
    this.tradeTypes = [];
    this.tradesType_names = [];
    var self = this, index;
    this.componentService.showLoader();
    this.APIService.getData('tradeContacts',this.jobId).subscribe((contacts:any) => {
      this.APIService.getData('jobCoworkers',this.jobId).subscribe((coworkers:any) => {
        this.all_coworkers = coworkers;
        this.componentService.dismissLoader();
        this.all_contacts = contacts;
        if (this.all_coworkers.length > 0) {
          this.all_contacts = contacts.concat(this.all_coworkers);
        }
        this.sorted_contacts = this.all_contacts;
        console.log(this.all_contacts)
        if (this.all_contacts != '') {
          this.all_contacts.forEach(function (data) {
            if (data.trades.length > 0) {
              data.trades.forEach(function (single) {
                if (self.trade_ids.indexOf(single._id) >= 0) {
                  index = self.trade_ids.indexOf(single._id);
                  self.trades[index]['total'] = self.trades[index]['total'] + 1;
                }
                else {
                  self.trades.push({
                    tradeId: single._id,
                    trade_name: single.trade_name,
                    trade_icon: single.trade_icon,
                    trade_task: single.trade_task,
                    total: 1
                  });
                  self.trade_ids.push(single._id);
                }

                if (self.tradesType_names.indexOf(single.trade_name) >= 0) {
                  index = self.tradesType_names.indexOf(single.trade_name);
                  self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
                }
                else {
                  self.tradeTypes.push({
                    tradeId: 0,
                    trade_name: single.trade_name,
                    trade_icon: single.trade_icon,
                    trade_task: 'All ' + single.trade_name,
                    total: 1
                  });
                  self.tradesType_names.push(single.trade_name);
                }
              });
            }
          });
        }
         this.filterTrades();
      },
        err => {
          this.componentService.dismissLoader()
          this.showTechnicalError();
        });
    },
      err => {
        this.componentService.dismissLoader()
        this.showTechnicalError();
      });
  }

  scroll(direction) {
    var cond;
    if (direction == 'right') {
      cond = { scrollLeft: "+=200px" };
    }
    else {
      cond = { scrollLeft: "-=200px" };
    }
    $('.drop-scroll').animate(cond, "slow");
  }

  addFilter(trade) {
    if (trade.tradeId == 0) {
      if (this.filter_trade_names.indexOf(trade.trade_name) == -1) {
        this.filter_trade_names.push(trade.trade_name);
        this.filter_list.push(trade);
      }
      else {
        this.filter_trade_names.splice(this.filter_trade_names.indexOf(trade.trade_name), 1);
        this.removeArray(this.filter_list, trade);
      }
    }
    else {
      if (this.filter_trades.indexOf(trade.tradeId) == -1) {
        this.filter_trades.push(trade.tradeId);
        this.filter_list.push(trade);
      }
      else {
        this.filter_trades.splice(this.filter_trades.indexOf(trade.tradeId), 1);
        this.removeArray(this.filter_list, trade);
      }
    }
    this.filterTrades();
    if (this.filter_trades.length == 0 && this.filter_trade_names.length == 0) {
      this.sorted_contacts = this.all_contacts;
    }
    this.saveFilters(this.filter_list, this.filter_trades, this.filter_trade_names);
  }

  removeArray(arr, what) {
    var a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  filterTrades() {
    if (this.filter_trades.length > 0 || this.filter_trade_names.length > 0) {
      var self = this;
      this.sorted_contacts = [];
      this.all_contacts.forEach(function (data) {
        if (data.trades.length > 0) {
          data.trades.forEach(function (single) {
            if (self.filter_trades.indexOf(single._id) >= 0) {
              if (self.sorted_contacts.indexOf(data) == -1) {
                self.sorted_contacts.push(data);
              }
            }
            else {
              if (self.filter_trade_names.indexOf(single.trade_name) >= 0) {
                if (self.sorted_contacts.indexOf(data) == -1) {
                  self.sorted_contacts.push(data);
                }
              }
            }
          });
        }
      });
    }
  }

  cancelFilter(trade, index) {
    if (trade.tradeId == 0) {
      this.filter_trade_names.splice(this.filter_trade_names.indexOf(trade.trade_name), 1);
    }
    else {
      this.filter_trades.splice(this.filter_trades.indexOf(trade.tradeId), 1);
    }
    this.filter_list.splice(index, 1);
    this.filterTrades();
    if (this.filter_trades.length == 0 && this.filter_trade_names.length == 0) {
      this.sorted_contacts = this.all_contacts;
    }
    this.saveFilters(this.filter_list, this.filter_trades, this.filter_trade_names);
  }

  onDropdownShow() {
    $(".shadow").show();
  }

  closeDropDown() {
    if ($(".ng2-dropdown-menu").hasClass("ng2-dropdown-menu--open") == true) {
      $(".ng2-dropdown-button").click();
    }
    $(".shadow").hide();
  }

  cancelAllFilters(type) {
    if (type == 'd') {
      this.filter_trade_names = [];
      this.removeAllFilters(type);
    }
    else {
      this.filter_trades = [];
      this.removeAllFilters(type);
    }
    this.filterTrades();
    if (this.filter_trades.length == 0 && this.filter_trade_names.length == 0) {
      this.sorted_contacts = this.all_contacts;
    }
    this.saveFilters(this.filter_list, this.filter_trades, this.filter_trade_names);
  }

  removeAllFilters(type) {
    if (this.filter_list.length > 0) {
      var count = 0, all_filters:any = [];
      this.filter_list.forEach(function (trade) {
        if (type == 'd') {
          if (trade.tradeId != 0) {
            all_filters.push(trade);
          }
        }
        if (type == 'a') {
          if (trade.tradeId == 0) {
            all_filters.push(trade);
          }
        }
        count = count + 1;
      });
      this.filter_list = all_filters;
    }
  }

  sortTrades(type) {
    if (type == 'a') {
      this.sort_icon = true;
      this.order_default = 'trade_name';
      this.order_advanced = 'trade_task';
      this.sortOrder();
    }
    if (type == 'n') {
      this.sort_icon = false;
      this.order_default = 'total';
      this.order_advanced = 'total';
      this.sortOrder();
    }
  }

  sortOrder() {
    if (this.order_default_p == false) {
      this.order_default_p = true;
    }
    else {
      this.order_default_p = false;
    }
    if (this.order_advanced_p == false) {
      this.order_advanced_p = true;
    }
    else {
      this.order_advanced_p = false;
    }
  }

 async  addCoworkers() {
    var all_coworkers = [];
    let modal = await this.modalCtrl.create({
      component: AddCoworkersPage, 
      componentProps: {
        jobId: this.jobId,
        already: all_coworkers
      }
    });
    modal.onDidDismiss().then((data:any) => {
      if (data.data == '1') {
        this.getContacts();
      }
    });
    modal.present();
  }

  async addContactInvites(myEvent14) {
    var userId = localStorage.getItem('userinfo');
    let modal = await this.modalCtrl.create({
      component:ContactslistPage,
      componentProps:{ trade_check: '1', jobId: this.jobId, from_trade_contacts: '1', show_priv: '1' }
    } );
    modal.onDidDismiss().then((res:any) => {
      var data = res.data;
      if (data != null) {
        if (data.length != undefined && data.length != 0) {
          this.componentService.showLoader();
          var returnedArr :any = [];
          var self = this;
          var current_tradeId = localStorage.getItem('current_tradeId_s')!;
          var all_trades = current_tradeId.split(',');
          data.forEach(function (contact) {
            // all_trades.forEach(function(trade_id){
            var new_obj = {
              isMember: '1',
              userId: userId,
              inviteId: contact.userId,
              invite_email: contact.email,
              status: '0',
              invite_name: '',
              invite_company: '',
              invite_phone: '',
              invite_title: '',
              tradeId: all_trades,
              jobId: self.jobId,
              privilege: contact.privilege
            }
            returnedArr.push(new_obj);
            // }); 
          });
          console.log(returnedArr)
          this.APIService.sendData('addInviteBidders_contacts',returnedArr).subscribe((contacts:any) => {
            if (contacts.status == '0') {
              this.componentService.dismissLoader();
              this.componentService.presentToast('Contacts already added.','danger');
            }
            else {
              this.componentService.dismissLoader();
              this.componentService.presentToast('Contacts added.','success');
              localStorage.removeItem('current_tradeId_s');
              this.getContacts();
            }
          },
            err => {
              this.showTechnicalError('1');
            });
        }
      }
    });
    modal.present();
  }

  async addContactManually() {
    let modal =await this.modalCtrl.create({
      component: AddcontactPage,
      componentProps:{ jobId: this.jobId, isEdit: 0, isMultiple: '1' }
    });
    modal.onDidDismiss().then((res:any) => {
      var data = res.data
      if (data != undefined && data != '') {
        if (data == '1') {
          this.componentService.presentToast('Contact added.','success');
          this.getContacts();
        }
        else {
          this.componentService.presentToast( 'Error while adding, plz try later.','danger');
        }
      }
    });
    modal.present();
  }

  async deleteContact(contactId, isCoworker, jobId, userId, unique_id = null) {
    let confirm = this.alertCtrl.create({
      header: 'Are you sure you want to delete?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.componentService.showLoader();
            if (isCoworker == '1') {
              var data = {
                'jobId':jobId,
                'userId':userId,
                'unique_id':unique_id
              }
             this.APIService.sendData('deleteCoworkers',data).subscribe((deleted:any) => {
                if (deleted.status == 1) {
                  this.componentService.dismissLoader();
                  this.componentService.presentToast('Coworker deleted.','success');
                  this.getContacts();
                }
                else {
                  this.componentService.dismissLoader();
                  this.componentService.presentToast( 'Error, plz try later.','danger');
                }
              },
                err => {
                  this.componentService.dismissLoader()
                  this.showTechnicalError('1');
                });
            }
            else {
              this.APIService.sendData('deleteBidders',{'contactId':contactId}).subscribe((deleted:any) => {
                if (deleted.status == 1) {
                  this.componentService.dismissLoader();
                  this.componentService.presentToast( 'Contact deleted.','success');
                  this.getContacts();
                }
                else {
                  this.componentService.dismissLoader();
                  this.componentService.presentToast('Error, plz try later.','danger');
                }
              },
                err => {
                  this.componentService.dismissLoader()
                  this.showTechnicalError('1');
                });
            }
          }
        }
      ]
    });
    (await confirm).present();
  }

  async editContact(contact) {
    let modal = await this.modalCtrl.create({
      component: AddcontactPage,
      componentProps:{
        data: contact, isEdit: 1, jobId: this.jobId, isMultiple: '1' 
      }
    }
   );
    await modal.onDidDismiss().then((res:any) => {
      var data = res.data;
      if (data != undefined && data != '') {
        if (data == '1') {
          this.componentService.presentToast( 'Contact updated.','success');
          this.getContacts();
        }
        else {
          this.componentService.presentToast('Error while adding, plz try later.','danger');
        }
      }
    });
    modal.present();
  }

  sendSmail(contact) {
    if (contact.isMember == '1') {
      this.navCtrl.navigateForward('compose', { state:{
        userId: contact.inviteId,
        tradeId: contact.tradeId,
        jobId: this.jobId,
        bid_reply: '1',
      }});
    }
    else {
      this.componentService.presentToast('This contact is not a salvum member.','danger');
    }
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard', '0']);
  };

  goToJobs() {
    this.navCtrl.navigateForward('managejob', { state: {
      is_direct: '0'
    }});
  };

  backToPage() {
    this.navCtrl.navigateForward('trade-dashboard',{
      state:{
        jobId: this.jobId
      }
    } )
  }

}

