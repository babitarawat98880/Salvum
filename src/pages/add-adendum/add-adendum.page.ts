import { Component, OnInit } from '@angular/core';
import { NavController, NavParams , ModalController, AlertController,ToastController,LoadingController } from '@ionic/angular';
import { FileUploader } from 'ng2-file-upload';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-add-adendum',
  templateUrl: './add-adendum.page.html',
  styleUrls: ['./add-adendum.page.scss'],
})
export class AddAdendumPage {

  modal_title : any;
  public uploader: FileUploader;
  uploaderOptions: any;
  filterTradeId: any;
  jobId: any;
  alltrades: any;
  dateTime: any;
  adendumId: any;
  isEdit: any;
  name: any;
  tradeId: any;
  filetype_error: any = '0';
  filesize_error: any = '0';
  public hasBaseDropZoneOver:boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams , 
    public modalController: ModalController, 
    public APIService: APIService, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public componentService:ComponentService) {
    var APIURL = localStorage.getItem('APIURL');
          if(navParams.get('is_edit') == '1'){
            this.isEdit = '1';
            this.modal_title = 'Edit Adendum';
            this.filterTradeId = '0';
            this.adendumId = navParams.get('adendumId');
            this.name = navParams.get('adendum_name');
            this.tradeId = navParams.get('adendum_tradeId');
            this.jobId = navParams.get('jobId');
            this.APIService.getData('trades',this.jobId).subscribe((alltrades)=>{
              this.alltrades = alltrades;
            },
            err => {
                this.showTechnicalError();
            });
          }
          else
          {
            this.isEdit = '0';
            this.modal_title = 'Add Adendum';
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
            this.dateTime = new Date().getTime();
            this.uploader  = new FileUploader({
              allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'],
              url: APIURL+'/adendumFilesUpload/'+this.dateTime, 
              itemAlias: 'file',
              maxFileSize: 500*1024*1024
             });
  
            this.uploader.onWhenAddingFileFailed = (check) => { 
                if(check.size > 500*1024*1024){
                  this.filesize_error = '1';
                }
                else{
                  this.filetype_error = '1';
                }
              }
  
            this.uploader.onBeforeUploadItem = (item) => {
                  item.withCredentials = false;
              }
          }
        
      }
    closeError(){
      this.filetype_error = '0';
    }
  
    closeErrorS(){
      this.filesize_error = '0';
    }
  
   saveAdendum(name,tradeId)
    {
      if(name == undefined || name == ''){
           this.componentService.presentToast('Please enter name.','danger');
           return false;
      }
  
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
  
      if(this.uploader.queue.length == 0)
      {
           this.componentService.presentToast('Please select Files.','danger');
           return false;
      }
      else
      {
        var all_files:any = [];
        var dateTime = this.dateTime;
        this.uploader.queue.forEach(function(file){
          if(file.isUploaded == true)
          {
            all_files.push(dateTime+'____'+file._file.name);
          }
        });
      }
      var data = {
            name: name,
            jobId: this.jobId,
            tradeId: tradeId,
            files: all_files
      };
     this.componentService.showLoader();
      this.APIService.sendData('addAdendum',data).subscribe((adendum_data:any)=>{
        this.componentService.dismissLoader();
        if(adendum_data.status == '1')
        { 
          this.modalController.dismiss('1');
        }
        else if(adendum_data.status == '2')
        {
         this.componentService.presentToast('Adendum already exists.','danger');

        }
        else
        {
           this.componentService.presentToast( 'Error, plz try later.','danger');

        }  
        },
        err => {
           this.componentService.dismissLoader();
            this.showTechnicalError('1');
        });
  
    }
  
    showTechnicalError(type:any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'danger');

    }
  
    editAdendum(name,tradeId)
    {
      if(name == undefined || name == '')
      {
           this.componentService.presentToast('Please enter name.','danger');

           return false;
      }
  
      if(tradeId == undefined || tradeId == '')
      {
        
         this.componentService.presentToast( 'Please select trade.','danger');
         return false;
      }
      var data = {
            name: name,
            tradeId: tradeId
      };
      this.componentService.showLoader();
      this.APIService.sendData('editAdendum/'+this.adendumId,data).subscribe((adendum_data:any)=>{
       this.componentService.dismissLoader();
        if(adendum_data.status == '1')
        { 
          this.modalController.dismiss('1');
        }
        else if(adendum_data.status == '2')
        {
           this.componentService.presentToast('Adendum already exists.','danger');

        }
        else
        {
          
           this.componentService.presentToast( 'Error, plz try later.','danger');

        }  
        },
        err => {
            this.componentService.dismissLoader();
            this.showTechnicalError('1');
        });
  
    }
  
    dismiss()
    {
      this.modalController.dismiss();
    }
  
    public fileOverBase(e:any):void {
      this.hasBaseDropZoneOver = e;
    }
  }
  