import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { Router } from '@angular/router';
import { FilemanagerfilesPage } from '../filemanagerfiles/filemanagerfiles.page';
import { JobfilePage } from '../jobfile/jobfile.page';
import { UploadfilePage } from '../uploadfile/uploadfile.page';
@Component({
  selector: 'app-addrfi',
  templateUrl: './addrfi.page.html',
  styleUrls: ['./addrfi.page.scss'],
})
export class AddrfiPage{
  userId:any;
  question: any = '';
  user_id: any = '';
  jobId:any;
  filterTradeId:any;
  allsusers:any;
  alltrades:any;
  files:any;
  alluserIds:any;
  allusers:any = [];
  dateTime:any;
  stateData:any='';
  tradeId:any='';
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
    constructor(
      public navCtrl: NavController, 
      public componentService: ComponentService, 
      public APIService: APIService, 
      public toastCtrl: ToastController, 
      public loadingCtrl: LoadingController, 
      public modalCtrl: ModalController,
      public router:Router) {
      this.userId = localStorage.getItem('userinfo');
      this.stateData = this.router.getCurrentNavigation()?.extras.state;
      this.jobId = this.stateData['jobId'];
      if(this.jobId == undefined){
        this.jobId = localStorage.getItem('add_rfis_jobId');
      }
      else{
        localStorage.setItem('add_rfis_jobId',this.jobId);
      }
      this.filterTradeId = localStorage.getItem('filterTradeId');
      if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
        this.filterTradeId = '0';
      }
      this.dateTime = new Date().getTime();
  
      this.APIService.getData('trades',this.jobId).subscribe((alltrades)=>{
        this.alltrades = alltrades;
        this.APIService.getData('jobUsers',this.jobId).subscribe((allusers)=>{
          this.allsusers = allusers;
          this.sortUsers();
        },
        err => {
            this.showTechnicalError();
        });
      },
      err => {
          this.showTechnicalError();
      });
    }
  
    sortUsers(){
      this.allusers = [];
      var self = this;
      if(this.filterTradeId != 0){
        if(this.allsusers != ''){
          this.allsusers.forEach(function(user){
            if(user.tradeId == self.filterTradeId){
              self.allusers.push(user);
            }
          });
        }
      }
      else{
        this.alluserIds = [];
        if(this.allsusers != ''){
          this.allsusers.forEach(function(user){
            if(self.alluserIds.indexOf(user._id) == -1){
              self.allusers.push(user);
              self.alluserIds.push(user._id);
            }
          });
        }
      }
    }
  
    changeTrade(tradeId){  	
      var self = this;
      if(tradeId != '' && tradeId != undefined){
        this.allusers = [];
        if(this.allsusers != ''){
          this.allsusers.forEach(function(user){
            if(user.tradeId == tradeId){
              self.allusers.push(user);
            }
          });
        }
      }
    }
  
    addManualRfi(question,tradeId,user_id)
    {
      if(question == '' || question == undefined )
      {
           this.componentService.presentToast( 'Please enter question.', 'danger');
      }
      else
      {
        if(this.filterTradeId == '0')
        {
          if(tradeId == undefined || tradeId == '')
          {
           this.componentService.presentToast('Please select trade.','danger');

             return false;
          }
          if(user_id == '' || user_id == undefined){
           this.componentService.presentToast('Please select user.','danger');
            return false;
          }
        }
        else
        {
          if(user_id == '' || user_id == undefined){
           this.componentService.presentToast('Please select user.','danger');
            return false;
          }
          tradeId = localStorage.getItem('filterTradeId');
        }
        this.addRFI(question,tradeId,user_id);
      }
    }
  
    addRFI(question,tradeId,user_id){
     this.componentService.showLoader();
      var all_files :any= [];
      var bid_files:any = [];
      if(this.files != undefined)
        {
          if(this.files.length > 0)
          {
            this.files.forEach(function(file){
              all_files.push(file.name);
            });
            bid_files = all_files;
          }
        }
      this.APIService.sendData('manualRFI',{question: question, tradeId: tradeId, inviteId: user_id,question_files:bid_files}).subscribe((rfis:any)=>{
        this.componentService.dismissLoader(); 
          if(rfis.status == '1'){
              this.modalCtrl.dismiss('1');
     this.navCtrl.navigateBack('rfi', { state: { jobId: this.jobId } });

          }
          else{
              this.modalCtrl.dismiss('0');
     this.navCtrl.navigateBack('rfi', { state: { jobId: this.jobId } });

          }
        },
        err => {
            this.componentService.dismissLoader();;
            this.showTechnicalError();
        });
    }
  
    dismiss(){
     this.navCtrl.navigateBack('rfi', { state: { jobId: this.jobId } });
    }
  
    showTechnicalError(type :any= null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
        this.componentService.presentToast('Technical error, Please '+msg,'danger');

    }
  
    async filemanagerFiles(){
      let modal = this.modalCtrl.create({
        component: FilemanagerfilesPage,
        componentProps:{
          reply_rfi : '1'
        }
      });
       (await modal).onDidDismiss().then(resdata => {
        var data = resdata.data;
        if(data != undefined && data != '')
            {       
             var filesArray :any = [];
             var dateTime = this.dateTime;
             data.forEach(function(single_file){
                var fileobj = {
                  file_name : single_file.name,
                  name : dateTime+'____'+single_file.name,
                  folder_path : localStorage.getItem('filemanager_file_path'),
                  random : dateTime
                }
                filesArray.push(fileobj);
              });
  
             if(this.files != undefined)
             {
                this.files = this.files.concat(filesArray);
             }
             else
             {
                this.files = filesArray;
             }
             this.APIService.sendData('addBidFiles',filesArray).subscribe((filesdata)=>{
               console.log('done'); 
             },
              err => {
                  this.showTechnicalError('1');
              });
            }
       });
       (await modal).present();
    }
  
   async jobFiles(){
      let modal = await this.modalCtrl.create({
        component:JobfilePage,
        componentProps:{
          reply_rfi : '1',
          jobId : '0'
        }
      });
       modal.onDidDismiss().then(res => {
        var data = res.data;
        if(data != undefined && data != '')
            {       
             var filesArray :any = [];
             var dateTime = this.dateTime;
             var file_path,file_name;
             data.forEach(function(single_file){
                
                if(single_file.path == undefined)
                {
                  file_path = 'directory/jobs_data';
                  file_name = single_file.file_name;
                }
                else
                {
                  file_path = single_file.path;
                  file_name = single_file.name;
                }
                var fileobj = {
                  file_name : file_name,
                  name : dateTime+'____'+file_name,
                  folder_path : file_path,
                  random : dateTime
                }
                filesArray.push(fileobj);
              });
  
             if(this.files != undefined)
             {
                this.files = this.files.concat(filesArray);
             }
             else
             {
                this.files = filesArray;
             }
             this.APIService.sendData('addBidFiles',filesArray).subscribe((filesdata)=>{
               console.log('done'); 
             },
              err => {
                  this.showTechnicalError('1');
              });
            }
       });
       modal.present();
    }
  
  
  
   async uploadFiles()
    {
      let modal = await this.modalCtrl.create({
        component:UploadfilePage,
        componentProps:{dateTime : this.dateTime, bid_upload : '1'}})
       modal.onDidDismiss().then(res => {
        var data = res.data;
        if(data != undefined || data != '')
        {
          if(data.length > 0)
              {     
               var filesArray:any = [];
               var dateTime = this.dateTime;
               data.forEach(function(single_file){
                if(single_file.isUploaded == true)
                {
                  var fileobj = {
                      file_name : single_file._file.name,
                      name : dateTime+'____'+single_file._file.name,
                      random : dateTime
                    }
                    filesArray.push(fileobj);
                }
                });
  
               if(this.files != undefined)
               {
                  this.files = this.files.concat(filesArray);
               }
               else
               {
                  this.files = filesArray;
               }
              }
        }
        });
       modal.present();
    }
  
    removeFile(index){
      this.files.splice(index,1);
    }
  
    root(){
        this.navCtrl.navigateRoot(['dashboard', "0"]);
      };
      
    goToJobs(){
        this.navCtrl.navigateForward('managejob',{ state:{
        is_direct : '0'
        }});
      };
  
    backToTradeDash()
        {
          this.navCtrl.navigateBack('trade-dashboard',{state:{
            back : '1'
          }});
        }
  
  }
  