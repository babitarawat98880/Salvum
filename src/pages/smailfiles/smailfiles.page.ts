import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
@Component({
  selector: 'app-smailfiles',
  templateUrl: './smailfiles.page.html',
  styleUrls: ['./smailfiles.page.scss'],
})
export class SmailfilesPage {
  selected_files : any;
  smail_files : any;
  fileType : any;
  modal_title : any;
  file_path : any;
  isShared : any;
  file_types : any;
  onLevel : any;
  enable_level1 : any;
  enable_level2 : any;
  enable_level3 : any;
  enable_level4 : any;
  opened_levels : any;
  userId : any = localStorage.getItem('userinfo');
    constructor(
      public navCtrl: NavController, 
      public toastCtrl : ToastController, 
      public navParams: NavParams, 
      public modalController: ModalController, 
      public loadingCtrl: LoadingController,
      public componentService:ComponentService,
      public APIService:APIService) {
      this.fileType = navParams.get('file_type');
      this.isShared = navParams.get('isShared');
      this.file_path = localStorage.getItem('current_file_path');
      if(this.fileType == '0')
      {
        this.modal_title = 'Select Photos';
      }
      else
      {
        this.modal_title = 'Select Docs';
      }
      if(this.fileType == '4'){
        this.modal_title = 'Select Smail Files';
      }
      this.file_types = ['txt','docx','mp3','mp4','php','ppt','psd','xls','xlsx','zip','doc','odt','png','jpg','jpeg','gif','pdf','csv']; 
      this.selected_files = [];
      var file_path = "directory/smail_data";
      this.APIService.sendData('getDirectoryFiles',{'file_path':file_path}).subscribe((smail_files:any)=>{
        if(smail_files.data != null){
          var image_types = ['png','jpg','jpeg','gif','bmp']; 
          if(this.fileType == '0')
          {
            var smail_images :any= [];
            smail_files.data.children.forEach(function(smail_data){
              if(image_types.indexOf(smail_data.name.split('.').pop()) >= 0)
              {
                smail_images.push(smail_data);
              }
            });
            this.smail_files = smail_images;
          }
          else
          {
            var smail_docs:any = [];
            smail_files.data.children.forEach(function(smail_data){
              if(image_types.indexOf(smail_data.name.split('.').pop()) == -1)
              {
                smail_docs.push(smail_data);
              }
            });
            this.smail_files = smail_docs;
          }
        }
        else
        {
          this.smail_files = []; 
        }
        this.componentService.dismissLoader();
  
        // get open levels
        this.opened_levels = [];
  
        var levels_array = JSON.parse(localStorage.getItem('alllevel') || '');
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
          this.opened_levels.push('1');
        }
        if(this.enable_level2 == 'false')
        {
          this.opened_levels.push('2');
        }
        if(this.enable_level3 == 'false')
        {
          this.opened_levels.push('3');
        }
        if(this.enable_level4 == 'false')
        {
          this.opened_levels.push('4');
        }
      },
      err => {
          this.componentService.dismissLoader();
          this.showTechnicalError();
      });
    }
  
   dismiss()
    {
      this.modalController.dismiss();
    }
  
    showTechnicalError(type = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
        this.componentService.presentToast('Technical error, Please '+msg,'info');
    }
    
    addFiles()
    {
      if(this.selected_files.length == 0)
      {
        this.dismiss();
      }
      else
       {
        if(this.isShared == '1' && this.file_path == 'nopath'){
          if(this.onLevel == undefined || this.onLevel == '' || this.onLevel == null){
             this.componentService.presentToast( 'Please select level.','danger');
               return false;
          }
          localStorage.setItem('file_upload_level',this.onLevel);
          this.modalController.dismiss(this.selected_files);
        }
        else{
          this.modalController.dismiss(this.selected_files);
        }
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
  