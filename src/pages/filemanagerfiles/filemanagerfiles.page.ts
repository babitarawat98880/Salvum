import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-filemanagerfiles',
  templateUrl: './filemanagerfiles.page.html',
  styleUrls: ['./filemanagerfiles.page.scss'],
})
export class FilemanagerfilesPage {
  selected_files : any;
  smail_files : any;
  fileType : any;
  modal_title : any;
  pages : any;
  userId : any;
  enable_level1 : any;
  enable_level2 : any;
  enable_level3 : any;
  enable_level4 : any;
  file_types : any;
  rootDir : any;
  allowed_levels : any;
  opened_levels : any;
  filterTradeId: any;
  jobId: any;
  alltrades: any;
  transmittal_file : any;
  file_path : any;
  reply_rfi : any;
  show_file_code : any;
  file_code : any = 'O';
  isShared : any;
  onLevel : any;
  is_video : any;
  has_thumbs : any;
  single_allowed : any;
  breadcrumbs : any = [];
  current_path : any = [];
  APIURL : any = localStorage.getItem('APIURL');
    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams, 
      public modalController: ModalController, 
      public componentService: ComponentService, 
      public APIService:APIService,
      public loadingCtrl: LoadingController, 
      public toastCtrl: ToastController) {
      this.fileType = navParams.get('file_type');
      this.isShared = navParams.get('isShared');
      this.file_path = localStorage.getItem('current_file_path');
      this.transmittal_file = navParams.get('transmittal_file');
      this.reply_rfi = navParams.get('reply_rfi');
      this.show_file_code = navParams.get('show_file_code');
      this.file_code = navParams.get('fileCode');
      this.single_allowed = navParams.get('single_allowed');
      this.file_types = ['txt','docx','mp3','mp4','php','ppt','psd','xls','xlsx','zip','doc','odt','png','jpg','jpeg','gif','pdf','csv']; 
      this.has_thumbs = ['png','jpg','jpeg','gif','mp4','mov','wmv','3gp','avi'];
      this.is_video = ['mp4','mov','wmv','3gp','avi'];
      this.userId = localStorage.getItem('userinfo');
      if(this.fileType == '0')
      {
        this.modal_title = 'Select Photos';
      }
      else if(this.fileType == '1')
      {
        this.modal_title = 'Select Docs';
      }
      else 
      {
        this.modal_title = 'Select Files';
      }
      this.selected_files = [];
  
      // get open levels
      this.allowed_levels = [];
      this.opened_levels = [];
  
      var levels_array = JSON.parse(localStorage.getItem('alllevel')!);
      if(levels_array){
        levels_array.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, this.userId);
          if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
            this.enable_level1  = 'false';
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
            this.enable_level2  = 'false';
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
            this.enable_level3  = 'false';
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
            this.enable_level4  = 'false';
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
            this.enable_level1 = 'true';
            this.enable_level2 = 'true';
            this.enable_level3 = 'true';
            this.enable_level4 = 'true';
          }
        });
      }
  
      if(this.enable_level1 == 'false') 
      {
        this.allowed_levels.push('level1');
        this.opened_levels.push('1');
      }
      if(this.enable_level2 == 'false')
      {
        this.allowed_levels.push('level2');
        this.opened_levels.push('2');
      }
      if(this.enable_level3 == 'false')
      {
        this.allowed_levels.push('level3');
        this.opened_levels.push('3');
      }
      if(this.enable_level4 == 'false')
      {
        this.allowed_levels.push('level4');
        this.opened_levels.push('4');
      }
      this.fetchTreeView();
  
        this.filterTradeId = localStorage.getItem('filterTradeId');
        if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
          this.filterTradeId = '0';
        }
        this.jobId = navParams.get('jobId');
        this.APIService.getData('trades',this.jobId).subscribe((alltrades)=>{
          this.alltrades = alltrades;
        },
        err => {
            this.showTechnicalError();
        });
  
    }
  
    rootFolders(){
      this.rootDir = '1';
      this.breadcrumbs = [];
    }
  
    showTechnicalError(type = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');
    }
  
    fetchTreeView(){
      this.componentService.showLoader();
      this.rootDir = '1';
      this.APIService.getData('getDirectory',this.userId+'/files').subscribe((all_files:any)=>{
          this.componentService.dismissLoader();
          this.pages = all_files.data.children;
          var myArray = this.pages;
          for (var i = myArray.length - 1; i >= 0; --i) {
          if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
              myArray.splice(i,1);
          }
      }
      this.pages = myArray;
      },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
      });
    }
  
    breadClicked(bread){
      var filePath = this.current_path.split(bread)[0]+bread;
      this.fetchDirectory(filePath,'directory');
    }
  
    fetchDirectory(file_path,file_type)
    {
      if(file_type == 'directory')
      {
        this.current_path = file_path;
        var breadcrumbs = file_path.split(this.userId+'/files/')[1];
        this.breadcrumbs = breadcrumbs.split('/');
        this.rootDir = '0';
        localStorage.setItem('filemanager_file_path',file_path);
        this.componentService.showLoader();
        this.APIService.sendData('getDirectoryFiles',{'file_path':file_path}).subscribe((smail_files:any)=>{
          if(smail_files.data != null)
          {
            this.smail_files = smail_files.data.children;
           
          }
          else
          {
            this.smail_files = []; 
          }
          console.log(smail_files.data)
          this.componentService.dismissLoader();
        },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError();
        });
      }
    }
  
   dismiss()
    {
      this.modalController.dismiss();
    }
    addFiles(tradeId)
    {
      if(this.selected_files.length == 0)
      {
        this.dismiss();
      }
      else
       {
        if(this.filterTradeId == '0' && this.transmittal_file != '1' && this.reply_rfi != '1')
          {
            if(tradeId == undefined || tradeId == '')
              {
                 this.componentService.presentToast( 'Please select trade.','danger');
                 return false;
              }
              localStorage.setItem('filt_TradeId',tradeId);
          }
        if(this.isShared == '1' && this.file_path == 'nopath'){
          if(this.onLevel == undefined || this.onLevel == '' || this.onLevel == null){
            this.componentService.presentToast('Please select level.','danger');
             return false;
          }
          localStorage.setItem('file_upload_level',this.onLevel);
        }
        else
        {
          localStorage.setItem('filt_TradeId',localStorage.getItem('filterTradeId')!);
        }
        if(this.show_file_code == '1'){
          localStorage.setItem('sal_file_code',this.file_code);
        }
        this.modalController.dismiss(this.selected_files);
      }
    }
  
   insertFilesToArray(evn,file){
    var event = evn.target;
    if(event.checked == true)
    {
       this.selected_files.push(file);
    }
    else
    {
      this.removeArray(this.selected_files, file);
    }
    if(this.selected_files.length == 1 && this.single_allowed == '1'){
      this.modalController.dismiss(this.selected_files);
    }
   }
    removeArray(arr,what) {
       var a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }
  
  }
  