import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { UploadfilePage } from '../uploadfile/uploadfile.page';
import { Router } from '@angular/router';
import { AddfolderPage } from '../addfolder/addfolder.page';
import { FilemanagerfilesPage } from '../filemanagerfiles/filemanagerfiles.page';
@Component({
  selector: 'app-jobphotos',
  templateUrl: './jobphotos.page.html',
  styleUrls: ['./jobphotos.page.scss'],
})
export class JobphotosPage {
  sorted_photos: any;
  fileType: any;
  all_photos: any;
  jobId: any;
  file_types: any;
  APIURL: any;
  folders: any;
  related_files: any;
  breadcrums: any;
  downloaded_href: any = '#';
  isBrowser = localStorage.getItem('isBrowser');
  baseUrl = localStorage.getItem('baseUrl');
  userId = localStorage.getItem('userinfo');
  timestamp: any;
  has_thumbs: any;
  is_video: any;
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
    public router:Router,
    private transfer: FileTransfer,
    private file: File,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public APIService: APIService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public componentService: ComponentService) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    this.APIURL = localStorage.getItem('APIURL');
    this.jobId = this.stateData['jobId'];
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.has_thumbs = ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'wmv', '3gp', 'avi'];
    this.is_video = ['mp4', 'mov', 'wmv', '3gp', 'avi'];
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
    this.fileType = this.stateData['file_type'];
    if (this.fileType == undefined) {
      this.fileType = localStorage.getItem('job_files_type');
    }
    localStorage.setItem('job_files_type', this.fileType);
    this.file_types = ['txt', 'docx', 'mp3', 'mp4', 'php', 'ppt', 'pptx', 'psd', 'xls', 'xlsx', 'zip', 'doc', 'odt', 'png', 'jpg', 'jpeg', 'gif', 'pdf', 'csv'];
    this.getFiles();
  }

  ngOnInit() {
    this.caclHeight();
    if (JSON.parse(localStorage.getItem('saved_filter_list')!) != null && JSON.parse(localStorage.getItem('saved_filter_list')!) != undefined) {
      this.filter_list = JSON.parse(localStorage.getItem('saved_filter_list')!);
      this.filter_trades = JSON.parse(localStorage.getItem('saved_filter_trades')!);
      this.filter_trade_names = JSON.parse(localStorage.getItem('saved_filter_trade_names')!);
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

  saveFilters(filter_list, filter_trades, filter_trade_names) {
    localStorage.setItem('saved_filter_list', JSON.stringify(filter_list));
    localStorage.setItem('saved_filter_trades', JSON.stringify(filter_trades));
    localStorage.setItem('saved_filter_trade_names', JSON.stringify(filter_trade_names));
  }

  showTechnicalError(type:any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info')
  }

  caclHeight() {
    var fixed_div = document.getElementById("calc_height_photos" + this.timestamp);
    if (fixed_div != null) {
      var fixed_div_height = fixed_div.offsetHeight;
      document.getElementById('fixed_height_photos' + this.timestamp)!.style.marginTop = fixed_div_height + 'px';
    }
  }

  getFiles() {
    this.trades = [];
    this.trade_ids = [];
    this.tradeTypes = [];
    this.tradesType_names = [];
    var self = this, index;
    this.folders = '0';
    localStorage.setItem('files_folder_path', 'directory/jobs_data');
    this.getBreadCrums();

    this.componentService.showLoader();
    this.APIService.getData('getJobFiles',this.jobId+'/'+this.fileType+'/'+this.userId).subscribe((photos) => {
      this.componentService.dismissLoader();
      this.all_photos = photos;
      this.sorted_photos = photos;
      if (this.all_photos != '') {
        this.all_photos.forEach(function (data) {
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
        this.componentService.dismissLoader();;
        this.showTechnicalError();
      });
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
      this.sorted_photos = this.all_photos;
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
      this.sorted_photos = [];
      this.all_photos.forEach(function (data) {
        if (self.filter_trades.indexOf(data.tradeId) >= 0) {
          self.sorted_photos.push(data);
        }
        else {
          if (self.filter_trade_names.indexOf(data.trade_name) >= 0) {
            self.sorted_photos.push(data);
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
      this.sorted_photos = this.all_photos;
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
      this.sorted_photos = this.all_photos;
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

  downloadAndroid(url, name) {
    this.componentService.presentToast('Start downloading....', 'success');
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(url, this.file.externalRootDirectory + name.split('____').pop()).then((entry) => {
      this.componentService.presentToast('File downloaded.', 'success');
    }, (error) => {
      this.componentService.presentToast('Error', 'danger');
    });
  }

  async uploadFile() {
    let modal = await this.modalCtrl.create({
      component: UploadfilePage,
      componentProps: { file_type: this.fileType, page_type: '1', jobId: this.jobId }
    },
    );
    modal.onDidDismiss().then((res: any) => {
      var data = res.data;
      if (data.length > 0) {
       this.componentService.showLoader();
        var filesArray: any = [];
        var file_type = '';
        var images_types = ['jpg', 'png', 'jpeg', 'gif', 'bmp'];
        data.forEach(function (single_file) {
          if (images_types.indexOf(single_file._file.name.split('.').pop().toLowerCase()) >= 0) {
            file_type = '0';
          }
          else {
            file_type = '1';
          }
          var fileobj = {
            file_name: single_file._file.name,
            status: '0',
            type: file_type,
            file_path: localStorage.getItem('files_folder_path')
          }
          filesArray.push(fileobj);
        });
        this.APIService.sendData('addTradeFiles/'+this.jobId+'/'+localStorage.getItem('filt_TradeId')+'/temp', filesArray).subscribe((filesdata) => {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Files added successfully.', "success");
          if (this.folders == '1') {
            this.getRelatedFiles();
          }
          else {
            this.getFiles();
          }
        },
          err => {
            this.componentService.dismissLoader();;
            this.showTechnicalError('1');
          });
      }
    });
    modal.present();
  }



  async filemanagerFiles() {
    let modal = await this.modalCtrl.create({
      component: FilemanagerfilesPage,
      componentProps: { file_type: this.fileType, jobId: this.jobId }
    });
    modal.onDidDismiss().then((res: any) => {
      var data = res.data;
      if (data != undefined && data != '') {
        this.componentService.showLoader();
        var filesArray: any = [];
        var file_type = '';
        var images_types = ['jpg', 'png', 'jpeg', 'gif', 'bmp'];
        data.forEach(function (single_file) {
          if (images_types.indexOf(single_file.name.split('.').pop().toLowerCase()) >= 0) {
            file_type = '0';
          }
          else {
            file_type = '1';
          }
          var fileobj = {
            file_name: single_file.name,
            status: '0',
            type: file_type,
            folder_path: localStorage.getItem('filemanager_file_path'),
            file_path: localStorage.getItem('files_folder_path')
          }
          filesArray.push(fileobj);
        });

        this.APIService.sendData('addTradeFiles/'+this.jobId+'/'+localStorage.getItem('filt_TradeId')+'/smail', filesArray).subscribe((filesdata) => {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Files added successfully.', 'success');
          if (this.folders == '1') {
            this.getRelatedFiles();
          }
          else {
            this.getFiles();
          }
        },
          err => {
            this.componentService.dismissLoader();;
            this.showTechnicalError('1');
          });
      }
    });
    modal.present();
  }

  downloadFile() {
    this.componentService.presentToast('Start downloading...', 'success');
  }

  downloadFolder(folder_path) {

    this.componentService.showLoader();
    this.APIService.sendData('downloadFolders',{folder_path:folder_path}).subscribe((downloaded:any) => {
      if (downloaded.status == 1) {
        this.componentService.dismissLoader();;
        this.downloaded_href = this.APIURL + '/salvum/' + downloaded.data.path;
        console.log(this.downloaded_href)
        this.componentService.presentToast('Start downloading...', 'success');

        setTimeout(function () { document.getElementById('download_zip_files')!.click(); }, 1000);
      }
      else {
        this.componentService.dismissLoader();
        this.componentService.presentToast('Error, plz try later.', 'danger');

      }
    },
      err => {
        this.componentService.dismissLoader();;
        this.showTechnicalError('1');
      });
  }

  async addFolder() {
    let modal = await this.modalCtrl.create({
      component: AddfolderPage,
      componentProps: { file_type: this.fileType, job_files: '1', jobId: this.jobId }
    });
    modal.onDidDismiss().then((res: any) => {
      var data = res.data;
      if (data != undefined && data != '') {
        if (data == '1') {
          this.componentService.presentToast('Folder added successfully.', 'success');
          if (this.folders == '1') {
            this.getRelatedFiles();
          }
          else {
            this.getFiles();
          }
        }
        else {
          this.componentService.presentToast('Error while adding folder, plz try later.', 'danger');
        }
      }
    });
    modal.present();
  }

  clickFolder(file_name, tradeId) {
    if (file_name.search('____') == -1) {
      this.folders = '1';
      localStorage.setItem('filterTradeId', tradeId);
      localStorage.setItem('files_folder_path', 'directory/jobs_data/' + file_name);
      this.getRelatedFiles();
    }
  }

  openIt(filePath, fileType) {
    if (fileType == 'directory') {
      localStorage.setItem('files_folder_path', filePath);
      this.getRelatedFiles();
    }
  }

  clickBreadcrumb(clicked_bread) {
    var current_path :any= localStorage.getItem('files_folder_path');
    if (current_path.search(clicked_bread) >= 0) {
      var file_path = current_path.split(clicked_bread)[0];
      file_path = file_path + clicked_bread;
      localStorage.setItem('files_folder_path', file_path);
      this.getRelatedFiles();
    }
  }

  getRelatedFiles() {

    this.componentService.showLoader();
    this.getBreadCrums();
    this.APIService.sendData('getDirectoryFiles',{'file_path':localStorage.getItem('files_folder_path')}).subscribe((related_files:any) => {
      if (related_files.data != null) {
        this.related_files = related_files.data.children;
      }
      else {
        this.related_files = [];
      }
      this.componentService.dismissLoader();;
    },
      err => {
        this.componentService.dismissLoader();;
        this.showTechnicalError();
      });
  }

  getBreadCrums() {
    var file_path :any= localStorage.getItem('files_folder_path');
    var breadcrums:any = [];
    file_path.split('/').forEach(function (bread:any) {
      breadcrums.push(bread);
    });
    this.breadcrums = breadcrums;
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard',"0"]);
  };

  goToJobs() {
    this.navCtrl.navigateForward('managejob', { state:{
      is_direct: '0'
    }});
  };

  backToPage() {
    this.navCtrl.navigateForward('trade-dashboard',{ state: {
      jobId: this.jobId
    }})
  }

}
