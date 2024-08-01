import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { Router } from '@angular/router';
import { AddAdendumPage } from '../add-adendum/add-adendum.page';
@Component({
  selector: 'app-adendum',
  templateUrl: './adendum.page.html',
  styleUrls: ['./adendum.page.scss'],
})
export class AdendumPage {
  all_contacts:any='';
  all_adendums: any;
  sorted_adendums: any;
  jobId: any;
  from_smail: any;
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
  order_default_p: any = false;
  order_advanced: any = 'trade_task';
  order_advanced_p: any = false;
  sort_icon: Boolean = true;
  stateData:any='';
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public ComponentService: ComponentService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public APIService: APIService,
    public router:Router) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    this.isBrowser = localStorage.getItem('isBrowser');
    this.jobId = this.stateData['jobId'];
    this.from_smail =this.stateData['from_smail'];
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
    this.getAdendums();
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
    var fixed_div = document.getElementById("calc_height_ad" + this.timestamp);
    if (fixed_div != null) {
      var fixed_div_height = fixed_div.offsetHeight;
      document.getElementById('fixed_height_ad' + this.timestamp)!.style.marginTop = fixed_div_height + 'px';
    }
  }

  showTechnicalError(type:any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.ComponentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  getAdendums() {
    this.trades = [];
    this.trade_ids = [];
    this.tradeTypes = [];
    this.tradesType_names = [];
    var self = this, index;
    this.ComponentService.showLoader();
    this.APIService.getData('getAdendums',this.jobId).subscribe((adendums) => {
      this.ComponentService.dismissLoader();
      this.all_adendums = adendums;
      this.sorted_adendums = adendums;
      if (this.all_adendums != '') {
        this.all_adendums.forEach(function (data) {
          if (self.trade_ids.indexOf(data.tradeId) >= 0) {
            index = self.trade_ids.indexOf(data.tradeId);
            self.trades[index]['total'] = self.trades[index]['total'] + 1;
          }
          else {
            self.trades.push({
              tradeId: data.tradeId,
              trade_name: data.trade_name,
              trade_icon: data.trade_icon,
              trade_task: data.trade_task,
              total: 1
            });
            self.trade_ids.push(data.tradeId);
          }

          if (self.tradesType_names.indexOf(data.trade_name) >= 0) {
            index = self.tradesType_names.indexOf(data.trade_name);
            self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
          }
          else {
            self.tradeTypes.push({
              tradeId: 0,
              trade_name: data.trade_name,
              trade_icon: data.trade_icon,
              trade_task: 'All ' + data.trade_name,
              total: 1
            });
            self.tradesType_names.push(data.trade_name);
          }
        });
      }
      this.filterTrades();
    },
      err => {
        this.ComponentService.dismissLoader();
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
      this.sorted_adendums = this.all_adendums;
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
      this.sorted_adendums = [];
      this.all_adendums.forEach(function (data) {
        if (self.filter_trades.indexOf(data.tradeId) >= 0) {
          self.sorted_adendums.push(data);
        }
        else {
          if (self.filter_trade_names.indexOf(data.trade_name) >= 0) {
            self.sorted_adendums.push(data);
          }
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
      this.sorted_adendums = this.all_adendums;
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
      this.sorted_adendums = this.all_adendums;
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

  async addAdendum() {
    let modal = await this.modalCtrl.create({
      component: AddAdendumPage,
      componentProps: { jobId: this.jobId }
    });
    modal.onDidDismiss().then(data => {
      if (data.data == '1') {
        this.ComponentService.presentToast('Adendum Added Successfully.', 'success');
        this.getAdendums();
      }
    });
    modal.present();
  }

  async editAdendum(adendumId, name, tradeId) {
    let modal = await this.modalCtrl.create({
      component: AddAdendumPage,
      componentProps: { adendumId: adendumId, is_edit: '1', adendum_name: name, adendum_tradeId: tradeId, jobId: this.jobId }
    });
    modal.onDidDismiss().then(data => {
      if (data.data == '1') {
        this.ComponentService.presentToast('Adendum Updated Successfully.', 'success');
        this.getAdendums();
      }
    });
    modal.present();
  }

  async deleteAdendum(adendumId) {
    let confirm = this.alertCtrl.create({
      header: 'Are you sure?',
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
            this.ComponentService.showLoader();
            this.APIService.getData('deleteAdendums',adendumId).subscribe((deleted:any) => {
              if (deleted.status == 1) {
                this.ComponentService.dismissLoader();
                this.ComponentService.presentToast('Adendum deleted.', 'success');
                this.getAdendums();
              }
              else {
                this.ComponentService.dismissLoader();
                this.ComponentService.presentToast('Error, plz try later.', 'danger');

              }
            },
              err => {
                this.ComponentService.dismissLoader();
                this.showTechnicalError('1');
              });
          }
        }
      ]
    });
    (await confirm).present();
  }


  root() {
    this.navCtrl.navigateRoot(['dashboard', "0"]);
  };

  goToJobs() {
    this.navCtrl.navigateForward('managejob',{state: {
      is_direct: '0'
    }});
  };

  backToPage() {
    this.navCtrl.navigateForward('trade-dashboard',{ state: {
      jobId: this.jobId
    }})
  }

  backToSmail() {
    this.navCtrl.navigateForward('small-inbox',{
      state: {
        from_job: '1',
        jobId: this.jobId
      }
    });
  }

}
