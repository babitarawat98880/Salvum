import { Component, OnInit } from '@angular/core';
import { NavController, NavParams , AlertController,ToastController,ModalController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-addfolder',
  templateUrl: './addfolder.page.html',
  styleUrls: ['./addfolder.page.scss'],
})
export class AddfolderPage {
  tradeId:any='';
  onLevel:any='';
  folder_name: any;
  file_path: any;
  jobId: any;
  main_page_title: any;
  file_type: any;
  alltrades: any;
  filterTradeId: any;
  allowed_levels: any;
  enable_level1: any;
  enable_level2: any;
  enable_level3: any;
  enable_level4: any;
  show_add_folder: any;
  isShared: any = '0';
  userId: any = localStorage.getItem('userinfo');
    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams , 
      public APIService: APIService, 
      public alertCtrl: AlertController, 
      public toastCtrl: ToastController,
      public componentService: ComponentService,
      public modalController:ModalController) {
  
        this.file_path = localStorage.getItem('current_file_path');
        if(navParams.get('is_smail_folder') == '1')
        {
          this.file_path = localStorage.getItem('smail_path');
          if(!this.file_path)
          {
            this.file_path = 'nopath';
          }
        }
        if(navParams.get('folder_name') != undefined)
        { 
          this.main_page_title = 'Rename Folder';
          this.folder_name = navParams.get('folder_name');
        }
        else
        {
          this.main_page_title = 'Add Folder';
        }
  
        if(navParams.get('job_files') == '1')
        {
          this.filterTradeId = localStorage.getItem('filterTradeId');
          if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
            this.filterTradeId = '0';
          }
          console.log(this.filterTradeId)
          this.file_type = navParams.get('file_type');
          this.jobId = navParams.get('jobId');
          this.APIService.getData('trades',this.jobId).subscribe((alltrades)=>{
            this.alltrades = alltrades;
          },
            err => {
                this.showTechnicalError();
            });
        }
  
        if(navParams.get('isShared') == '1')
        {
          this.isShared = '1';
          this.show_add_folder = navParams.get('show_add_folder');
          this.getOpenLevels();
        }
        
    }
  
    showTechnicalError(type:any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
        this.componentService.presentToast('Technical error, Please '+msg,'info');
    }
  
    getOpenLevels()
    {
      this.allowed_levels = [];
      var levels_array = JSON.parse(localStorage.getItem('alllevel')!);
      if(levels_array){
        levels_array.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, this.userId);
          if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
            this.enable_level1 = 'true';
            this.enable_level2 = 'true';
            this.enable_level3 = 'true';
            this.enable_level4 = 'true';
          }
          if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
            this.enable_level1  = 'false';
            this.enable_level2 = 'true';
            this.enable_level3 = 'true';
            this.enable_level4 = 'true';
          } if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
            this.enable_level1  = 'false';
            this.enable_level2  = 'false';
            this.enable_level3 = 'true';
            this.enable_level4 = 'true';
          } if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
            this.enable_level1  = 'false';
            this.enable_level2  = 'false';
            this.enable_level3  = 'false';
            this.enable_level4 = 'true';
          } if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
            this.enable_level1  = 'false';
            this.enable_level2  = 'false';
            this.enable_level3  = 'false';
            this.enable_level4  = 'false';
          } 
        });
      }
  
      if(this.enable_level1 == 'false') 
      {
        this.allowed_levels.push('1');
      }
      if(this.enable_level2 == 'false')
      {
        this.allowed_levels.push('2');
      }
      if(this.enable_level3 == 'false')
      {
        this.allowed_levels.push('3');
      }
      if(this.enable_level4 == 'false')
      {
        this.allowed_levels.push('4');
      }
    }
  
    dismiss()
    {
      this.modalController.dismiss();
    }
    addFolderEvent(folder_name,tradeId,onLevel){ 
  
      if(folder_name == undefined || folder_name == '')
      {
       this.componentService.presentToast('Please enter valid folder name.','danger');
      }
      else
      {     
          if(this.navParams.get('folder_name') != undefined)
          {
            this.componentService.showLoader();
            var new_path = this.file_path.split('/').slice(0, -1).join('/')+'/'+folder_name;
            var data = {
              'old_path': this.file_path,
              'new_path': new_path,
              'fid': '0'
            }
            this.APIService.sendData('renameDirectoryFolder', data).subscribe((formdata:any)=>{
              if(formdata.status == 1)
                {
                  this.componentService.dismissLoader();
                  this.modalController.dismiss('4'); 
                }
                else if(formdata.status == 2)
                {
                     this.componentService.dismissLoader();
                     this.componentService.presentToast('Folder name already exists.','danger');
                }
                else
                {
                     this.componentService.dismissLoader();
                     this.componentService.presentToast( 'Error, plz try later.','danger');
                     this.modalController.dismiss('0');
                }
            },
            err => {
                 this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
          }
          else
          {
            if(this.navParams.get('job_files') == '1')
            {
              if(this.filterTradeId == '0')
                {
                  if(tradeId == undefined || tradeId == '')
                  {
                     this.componentService.presentToast('Please select trade.','danger');
                  return false;
                  }
                }
                else
                {
                  tradeId = localStorage.getItem('filterTradeId');
                }
               
                var fileobj = {
                  file_name : folder_name,
                  status : '0',
                  type : this.file_type,
                  folder_path : localStorage.getItem('files_folder_path')
                }
                // console.log(fileobj);
  
                this.componentService.showLoader();
                this.APIService.sendData('addFoldersFiles/'+this.jobId+'/'+tradeId,fileobj).subscribe((formdata:any)=>{
                  if(formdata.status == 1)
                    {
                        this.componentService.dismissLoader();
                      this.modalController.dismiss('1');  
                    }
                    else if(formdata.status == 2)
                    {
                         this.componentService.dismissLoader();
                        this.componentService.presentToast( 'Folder name already exists.','danger');

                    }
                    else
                    {
                         this.componentService.dismissLoader();
                        this.componentService.presentToast( 'Error, plz try later.','danger');
                        this.modalController.dismiss('0');
                    }
                },
                err => {
                     this.componentService.dismissLoader();
                    this.showTechnicalError('1');
                });
            }
            else
            {
              if(this.file_path == 'nopath')
              {
                if(this.isShared == '1')
                {
                  if(onLevel == undefined || onLevel == '')
                  {
                    this.componentService.presentToast( 'Please select level.','danger');
                       return false;
                  }
                }
                else
                {
                  onLevel = null;
                }
              }
              else
              {
                onLevel = null;
              }
              if(this.navParams.get('is_smail_folder') == '1')
              {
                 this.componentService.showLoader();
                this.APIService.sendData('folder/'+this.userId, {
                                          name: folder_name,
                                          level: localStorage.getItem('smail_path'),
                                          userId: this.userId
                                      }).subscribe((formdata:any)=>{
                  if(formdata.status == 1)
                    {
                        this.componentService.dismissLoader();
                      this.modalController.dismiss('1');  
                    }
                    else if(formdata.status == 2)
                    {
                         this.componentService.dismissLoader();
                         this.componentService.presentToast('Folder name already exists.','danger');
                    }
                    else
                    {
                         this.componentService.dismissLoader();
                         this.componentService.presentToast('Error, plz try later.','danger');
                        this.modalController.dismiss('0');
                    }
                },
                err => {
                     this.componentService.dismissLoader();
                    this.showTechnicalError('1');
                });
              }
              else
              {
                 this.componentService.showLoader();
                 var rdata = {
                  'file_path':this.file_path,
                  'folder_name':folder_name,
                  'userId':this.userId,
                  'isShared':this.isShared,
                  'onLevel':onLevel,
                  'toId':localStorage.getItem('clicked_user_id'),
                  'toLevel':localStorage.getItem('clicked_whichLevel'),
                  'from_user':localStorage.getItem('userName'),
                  'show_add_folder':this.show_add_folder,
                  'clicked_fid':localStorage.getItem('clicked_fid')
                 }
             
                this.APIService.sendData('addDirectoryFolders',rdata).subscribe((formdata:any)=>{
                  if(formdata.status == 1)
                    {
                        this.componentService.dismissLoader();
                       localStorage.setItem('new_dir_folder',folder_name);
                      this.modalController.dismiss('1');  
                    }
                    else if(formdata.status == 2)
                    {
                         this.componentService.dismissLoader();
                         this.componentService.presentToast('Folder name already exists.','danger');
                    }
                    else
                    {
                         this.componentService.dismissLoader();
                         this.componentService.presentToast('Error, plz try later.','danger');
                         this.modalController.dismiss('0');
                    }
                },
                err => {
                     this.componentService.dismissLoader();
                    this.showTechnicalError('1');
                });
              }
            }
            
          }
  
      }
    }
  }
  