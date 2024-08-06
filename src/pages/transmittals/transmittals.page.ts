import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-transmittals',
  templateUrl: './transmittals.page.html',
  styleUrls: ['./transmittals.page.scss'],
})
export class TransmittalsPage {
  sort_by: any = '';
  all_contacts: any = '';
  all_transmittals: any = [];
  sorted_transmittals: any = [];
  all_sorted_transmittals: any = [];
  searchTerm: any;
  jobId: any;
  alltrades: any = [];
  userName: any;
  timestamp: any;
  userId: any;
  isRefresh: any = '1';
  isBrowser = localStorage.getItem('isBrowser');
  baseUrl = localStorage.getItem('baseUrl');
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
  order_default_p: any = false;
  order_advanced: any = 'trade_task';
  order_advanced_p: any = false;
  order_trans: any = '_id';
  order_trans_p: any = true;
  sort_icon: Boolean = true;
  stateData: any = '';
  errors: any = ['', null, undefined];
  constructor(
    public modalCtrl: ModalController,
    public componentService: ComponentService,
    public navCtrl: NavController,
    public APIService: APIService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public router: Router) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    this.jobId = this.stateData['jobId'];
    this.userName = localStorage.getItem('userName');
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
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userinfo');
    if (this.isRefresh == '1') {
      this.getTransmittals();
      // this.getAllTrades();
    }
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

  ionViewDidLoad() {
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

  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info')
  }

  caclHeight() {
    var fixed_div = document.getElementById("calc_height_trans" + this.timestamp);
    if (fixed_div != null) {
      var fixed_div_height = fixed_div.offsetHeight;
      document.getElementById('fixed_height_trans' + this.timestamp)!.style.marginTop = fixed_div_height + 'px';
    }
  }

  sortby(sort_by) {
    console.log(sort_by)
    if (sort_by == '1') {
      this.order_trans = 'date_created';
      this.order_trans_p = false;
    }
    if (sort_by == '2') {
      this.order_trans = 'date_updated';
      this.order_trans_p = false;
    }
  }

  getItems(val) {
    this.sorted_transmittals = this.all_sorted_transmittals;
    // let val = ev.target.value;
    if (val && val.trim() != '') {
      this.sorted_transmittals = this.sorted_transmittals.filter((item) => {
        return (item.comments.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.subject.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.date_updated.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.date_sent.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  getTransmittals() {
    this.trades = [];
    this.trade_ids = [];
    this.tradeTypes = [];
    this.tradesType_names = [];
    this.all_transmittals = [];
    this.sorted_transmittals = [];
    this.all_sorted_transmittals = [];
    var self = this, index;
    this.componentService.showLoader()
    this.APIService.getData('getTransmittals', this.jobId + '/' + this.userId).subscribe((transmittals: any) => {
      this.componentService.dismissLoader();
      if (transmittals != '') {
        transmittals.forEach(function (data) {
          data = {
            transmittal_number: data.transmittal_number,
            subject: data.subject,
            sender_id: data.sender_id,
            rec_id: data.rec_id,
            comments: data.comments,
            submittals: data.submittals,
            date_sent: self.errors.indexOf(data.date_sent) == -1 ? self.formatDate(data.date_sent) : '',
            date_updated: self.errors.indexOf(data.date_updated) == -1 ? self.formatDate(data.date_updated) : '',
            date_created: self.errors.indexOf(data.date_created) == -1 ? self.formatDate(data.date_created) : '',
            isSent: data.isSent,
            _id: data._id,
            jobId: data.jobId,
            rec_indicator: data.rec_indicator,
            sender_indicator: data.sender_indicator,
            tradeId: data.tradeId,
            user_name: data.user_name
          };
          self.all_transmittals.push(data);
          self.sorted_transmittals.push(data);
          self.all_sorted_transmittals.push(data);
          if (data.submittals.length > 0) {
            data.submittals.forEach(function (trd) {
              if (self.errors.indexOf(trd.tradeId) == -1 && trd.tradeId != 0) {
                if (self.trade_ids.indexOf(trd.tradeId) >= 0) {
                  index = self.trade_ids.indexOf(trd.tradeId);
                  self.trades[index]['total'] = self.trades[index]['total'] + 1;
                }
                else {
                  self.trades.push({
                    tradeId: trd.tradeId,
                    trade_name: trd.trade_name,
                    trade_icon: trd.trade_icon,
                    trade_task: trd.trade_task,
                    total: 1
                  });
                  self.trade_ids.push(trd.tradeId);
                }

                if (self.tradesType_names.indexOf(trd.trade_name) >= 0) {
                  index = self.tradesType_names.indexOf(trd.trade_name);
                  self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
                }
                else {
                  self.tradeTypes.push({
                    tradeId: 0,
                    trade_name: trd.trade_name,
                    trade_icon: trd.trade_icon,
                    trade_task: 'All ' + trd.trade_name,
                    total: 1
                  });
                  self.tradesType_names.push(trd.trade_name);
                }
              }
            });
          }
        });
      }
      this.filterTrades();

    },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
      });
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  async seeAcItems(act_items) {
    let modal = this.modalCtrl.create({
      component: 'ActionItemsPage',
      componentProps: { action_items: act_items }
    });
    (await modal).present();
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
      this.sorted_transmittals = this.all_transmittals;
      this.all_sorted_transmittals = this.all_transmittals;
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
      this.sorted_transmittals = [];
      this.all_sorted_transmittals = [];
      this.all_transmittals.forEach(function (data) {
        if (data.submittals.length > 0) {
          data.submittals.forEach(function (trd) {
            if (self.filter_trades.indexOf(trd.tradeId) >= 0) {
              if (!self.sorted_transmittals.includes(data)) {
                self.sorted_transmittals.push(data);
              }
            }
            else {
              if (self.filter_trade_names.indexOf(trd.trade_name) >= 0) {
                if (!self.sorted_transmittals.includes(data)) {
                  self.sorted_transmittals.push(data);
                }
              }
            }
          })
        }
      });
      this.all_sorted_transmittals = this.sorted_transmittals;
    }
    console.log(this.sorted_transmittals)
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
      this.sorted_transmittals = this.all_transmittals;
      this.all_sorted_transmittals = this.all_transmittals;
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
      this.sorted_transmittals = this.all_transmittals;
      this.all_sorted_transmittals = this.all_transmittals;
    }
    this.saveFilters(this.filter_list, this.filter_trades, this.filter_trade_names);
  }

  removeAllFilters(type) {
    if (this.filter_list.length > 0) {
      var count = 0, all_filters: any = [];
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

  addTransmittal() {
    this.isRefresh = '1';
    this.navCtrl.navigateForward('addtransmittal', {
      state: {
        jobId: this.jobId
      }
    });
  }

  editTransmittal(tid) {
    this.isRefresh = '1';
    this.navCtrl.navigateForward('EditTransmittalPage', {
      state: {
        jobId: this.jobId,
        tid: tid
      }
    });
  }



  transmittalDetails(tid) {
    this.isRefresh = '0';
    this.navCtrl.navigateForward('TransmittalDetailPage', {
      state: {
        tid: tid
      }
    })
  }

  async copyTransmittal(tid) {
    let confirm = this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure you want to copy this transmittal?',
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
            const loading = this.loadingCtrl.create({});
            this.componentService.showLoader()
            this.APIService.sendData('copyTransmittal', { tid: tid }).subscribe((is_sent: any) => {
              this.componentService.dismissLoader();
              if (is_sent.status == '1') {
                this.getTransmittals();
                this.componentService.presentToast('Transmittal Copied Successfully.', 'success');
              }
              else {
                this.componentService.presentToast('Error, plz try later.', 'danger');

              }
            },
              err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
              });
          }
        }
      ]
    });
    (await confirm).present();
  }

  async deleteSub(subId, t_index, s_index) {
    console.log(subId);
    console.log(t_index, s_index);
    let confirm = this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete this submittal?',
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
            const loading = this.loadingCtrl.create({});
            this.componentService.showLoader()
            this.APIService.sendData('deleteSubmittal', { subId: subId }).subscribe((is_sent: any) => {
              this.componentService.dismissLoader();
              if (is_sent.status == '1') {
                this.sorted_transmittals[t_index]['submittals'].splice(s_index, 1);
                this.componentService.presentToast('Submittal deleted successfully.', 'success');
              }
              else {
                this.componentService.presentToast('Error, plz try later.', 'danger');
              }
            },
              err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
              });
          }
        }
      ]
    });
    (await confirm).present();
  }

  async sendTransmittal(tid, submittals, sender_id, rec_id) {
    this.isRefresh = '1';
    if (this.errors.indexOf(rec_id) >= 0) {

      this.componentService.presentToast('Please add receiver in transmittal.', 'danger')

    }
    else if (submittals.length == '0') {

      this.componentService.presentToast('Please add atleast one submittal to send.', 'danger')
    }
    else {
      let confirm = this.alertCtrl.create({
        header: 'Confirm',
        message: 'Are you sure you want to send?',
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
              const loading = this.loadingCtrl.create({});
              this.componentService.showLoader();
              var data = {
                'sender_id': sender_id,
                'rec_id': rec_id,
                'user_name': this.userName,
                'baseUrl': this.baseUrl
              }
              this.APIService.sendData('sendTransmittal/' + tid, data).subscribe((is_sent: any) => {
                this.componentService.dismissLoader();
                if (is_sent.status == '1') {
                  this.getTransmittals();
                  this.componentService.presentToast('Transmittal Sent Successfully.', 'success')

                }
                else {
                  this.componentService.presentToast('Error, plz try later.', 'danger')
                }
              },
                err => {
                  this.componentService.dismissLoader();
                  this.showTechnicalError('1');
                });
            }
          }
        ]
      });
      (await confirm).present();
    }
  }

  async downloadTransmittal(transmittalId) {
    let modal = this.modalCtrl.create({
      component: 'PdfTransmittalPage',
      componentProps: { transmittalId: transmittalId }
    });
    (await modal).present();
  }

  async submittalClicked(type, tradeId, item, sub) {
    this.isRefresh = '0';
    if (type == 'contract') {
      this.navCtrl.navigateForward('ViewcontractPage', {
        state: {
          jobId: this.jobId,
          tradeId: tradeId,
          bidId: item,
          page_type: '1'
        }
      })
    }
    if (type != 'contract' && type != 'rfi' && type != 'request') {
      var filePath = item;
      let modal = this.modalCtrl.create({
        component: 'ViewfilePage',
        componentProps: { file_path: filePath, file_name: sub.item, created_at: sub.date_created, file_by: sub.by }
      });
      (await modal).present();
    }
    if (type == 'rfi') {
      let modal = this.modalCtrl.create({
        component: 'ViewfilePage',
        componentProps: { RfiId: item, page_type: '1' }
      });
      (await modal).present();
    }
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard', "0"]);
  };

  goToJobs() {
    this.navCtrl.navigateForward('managejob', {
      state: {
        is_direct: '0'
      }
    });
  };

  backToPage() {
    this.navCtrl.navigateForward('trade-dashboard', {
      state: {
        jobId: this.jobId
      }
    })
  }

}