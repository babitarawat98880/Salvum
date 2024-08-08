import { Component, OnInit } from '@angular/core';
import { NavController, ToastController,LoadingController, ModalController } from '@ionic/angular';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Cell, Row, Table } from 'ng-pdf-make/objects/table';
import { APIService } from 'src/services/api.service';
import { Router } from '@angular/router';
import { ComponentService } from 'src/services/component.service';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ask-engg',
  templateUrl: './ask-engg.page.html',
  styleUrls: ['./ask-engg.page.scss'],
})
export class AskEnggPage{
  userId : any = localStorage.getItem('userinfo');
  jobId : any;
  rfiIds : any;
  updated_rfis : any;
  rfis : any;
  send_type : any;
  allEmails : any;
  APIURL : any;
  email_address : any;
  all_users : any;
  emails : any;
  dateTime : any;
  baseUrl = localStorage.getItem('baseUrl');
  isBrowser = localStorage.getItem('isBrowser');
  step1 : Boolean = true;
  step2 : Boolean = false;
  step3 : Boolean = false;
  dropdown : Boolean = false;
  stateData:any='';
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
    constructor(
      private transfer: FileTransfer, 
      private file: File,
      public navCtrl: NavController, 
      public APIService: APIService, 
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController, 
      public componentService: ComponentService, 
      private pdfmake: PdfmakeService,
      public modalCtrl: ModalController,
      public router:Router) {
      this.APIURL = localStorage.getItem('APIURL');
      this.stateData = this.router.getCurrentNavigation()?.extras.state;
      this.jobId = this.stateData ['jobId'];
      this.rfiIds = this.stateData ['rfiIds'];
      this.rfis = this.stateData ['rfis'];
      this.dateTime = new Date().getTime();
      this.getAllUsers();
    }
  
    getAllUsers(){
      this.APIService.get('allUsers').subscribe((users:any)=>{
        this.all_users = users;
        this.emails = users;
        var allEmails:any = [];
        users.forEach(function(user){
          allEmails.push(user.email);
        });
        this.allEmails = allEmails;
      },
      err => {
          this.showTechnicalError();
      });
    }
  
    showTechnicalError(type :any= null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
        this.componentService.presentToast('Technical error, Please '+msg,'danger');
    }
  
    selectEmail(email_address){
      this.email_address = email_address;
      this.dropdown = false;
    }
  
    filterEmails(ev: any){
      this.emails=this.all_users;
      let val = ev.target.value;
        if (val && val.trim() != '') {
          this.dropdown = true;
          this.emails = this.emails.filter((item) => {
            return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
    }
  
    downloadAndroid(url,name) {
      this.componentService.presentToast('Start downloading....','success');
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(url, this.file.externalRootDirectory + name.split('____').pop()).then((entry) => {
      this.componentService.presentToast('File downloaded.','success');

      }, (error) => {
      this.componentService.presentToast('Error','danger');
      });
    }
  
    saveNextFirst(){
      var self = this;
      var updated_rfis :any = [];
      var count = 0;
      this.rfis.forEach(function(rfi){
        if(rfi.question == undefined || rfi.question == '' || rfi.question == null){
          var number = count + 1;
        self.componentService.presentToast('RFI '+number+' should not be blank.','danger');
 }
        else{
          updated_rfis.push({
            question_engg : rfi.question,
            _id : rfi._id
          });
          count = count + 1;
          if(count == self.rfis.length){
            self.step1 = false;
            self.step2 = true;
            self.step3 = false;
            self.updated_rfis = updated_rfis;	
          }
        }
      });
    }
  
    saveNextSecond(send_type){
      if(send_type == undefined || send_type == '' || send_type == null){
           this.componentService.presentToast('Please select how to send RFI.','danger');
      }
      else{
        this.send_type = send_type;
        this.step1 = false;
        this.step2 = false;
        this.step3 = true;
      }
    }
  
    backStepSecond(){
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
    }
  
    backStepThird(){
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
    }
  
    removeAttach(index,indx){
      this.rfis[index].question_files.splice(indx,1);
    }
  
   async  addAttchs(rfiId,index){
      var self = this;
      let modal =  this.modalCtrl.create({
        component:'UploadfilePage',
        componentProps: {dateTime : this.dateTime, bid_upload : '1'}
      }
        );
       (await modal).onDidDismiss().then(res => {
        var data = res.data;
         if(data != undefined && data != '')
         {
           if(data.length > 0)
              {     
               var dateTime = self.dateTime;
               data.forEach(function(single_file){
                if(single_file.isUploaded == true)
                {
                    var file = dateTime+'____'+single_file._file.name;
                    file = file.replace(" ", "_");
                    if(Array.isArray(self.rfis[index].question_files)){
                self.rfis[index].question_files.push(file);
            }
            else{
              var arr:any = [];
              arr.push(file)
              self.rfis[index].question_files = arr;
            }
                }
               });
              }
         }
         });
       (await modal).present();
    }
  
    downloadFile(){
    this.componentService.presentToast('Start downloading....','success');
    }
  
    askEngg(email_address,description){
        var regExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(email_address == '' || email_address == undefined){
         this.componentService.presentToast('Please enter email address.','danger');
         return false;
        }
        if(regExp.test(email_address) == false){
         this.componentService.presentToast('Please enter valid email address.','danger');

               return false;
        }
        if(this.send_type == 'smail'){
          if(this.allEmails.indexOf(email_address) == -1){
         this.componentService.presentToast('Please select valid email address from dropdown.','danger');
                 return false;
          }
        }
       this.componentService.showLoader();
        var self = this;
      // start pdf
      this.pdfmake.docDefinition.content = [];
      this.pdfmake.configureStyles({ header: { fontSize: 18, bold: true } });
      var counter = 0;
      var all_trades :any= [];
      this.rfis.forEach(function(rfi){
        if(all_trades.indexOf(rfi.tradeId) == -1){
          all_trades.push(rfi.tradeId);
        }
        counter = counter + 1; 				
        // Add a text with style
        self.pdfmake.addText('RFI'+counter, 'header');
        // Create Headers cells
        const header1 = new Cell('Question');
        const header2 = new Cell(rfi.question);
        const headerRows = new Row([header1, header2]);
        // Create headers row	
        if(Array.isArray(rfi.question_files)){
          const row1 = new Row([new Cell('Attachments'), new Cell('Please click on below link to download zip:')]);
          const widths = [150, 350, 200, '*']; 
          // Create table object
          const table = new Table(headerRows, [row1], widths);
          self.pdfmake.addTable(table);
        }
        else{
          const row1 = new Row([new Cell('Attachments'), new Cell('No attachments.')]);
          const widths = [150, 350, 200, '*']; 
          // Create table object
          const table = new Table(headerRows, [row1], widths);
          self.pdfmake.addTable(table);
        }		
        
        if(Array.isArray(rfi.question_files)){
          if(rfi.question_files.length > 0){
            var rfi_attachments:any = [];
            rfi.question_files.forEach(function(file){
              var obj = {
                      source : 'directory/bids_data/'+file,
                      target : file.split('____').pop(-1)
                    }
              rfi_attachments.push(obj);
            });
            var random = Math.floor(Math.random() * 1000000);
            var zip_href = self.APIURL+'/salvum/directory/temp_data/attachment'+random+'.zip';
            self.pdfmake.docDefinition.content.push({text: "Download attachments", link:zip_href, decoration:"underline", fontSize:13, margin: [0, 5] });
            self.APIService.sendData('makeZipAttachments',{'attachments':rfi_attachments,'name':random}).subscribe((downloaded)=>{
              // zip done
            },
              err => {
                  self.showTechnicalError();
              });
          }
        }
        if(counter == self.rfis.length){
          //save updated rfis in db
          self.APIService.sendData('updateRFIsEngg', {rfis :self.updated_rfis}).subscribe((result)=>{
          // download it
          setTimeout(function(){ 
            if(description != undefined && description != ''){
              self.pdfmake.docDefinition.content.push({text:description, fontSize:13, margin: [0, 5] });
            }
            pdfMake.createPdf(self.pdfmake.docDefinition).getDataUrl(function(dataUrl){
            var rfiData = {
              RfiIds : self.rfiIds,
              email : email_address,
              description : description,
              userId : self.userId,
              jobId : self.jobId,
              file : dataUrl,
              baseUrl : self.baseUrl,
              tradeId : all_trades,
              send_type : self.send_type
            };
              self.componentService.showLoader();
              self.APIService.sendData('addRfiEmail',rfiData).subscribe((result:any)=>{
                self.componentService.dismissLoader();
                if(result.status == 1){
                  self.componentService.presentToast( 'RFI requested successfully.','success');
                       self.modalCtrl.dismiss();
                }
                else{
                  self.componentService.presentToast('Error, plz try later.','danger');
                }
              },
              err => {
                  self.componentService.dismissLoader();
                  self.showTechnicalError('1');
              });
            });
           }, 3000);
          },
            err => {
                self.showTechnicalError('1');
            });
        }	
      });
    }
  
    onEmailSelect(event){
      console.log(event)
    }
  
    root(){
    this.navCtrl.navigateRoot(['dashboard','0']);
    };
    
    goToJobs(){
        this.navCtrl.navigateBack('managejob',{ state:{
        is_direct : '0'
        }});
    };
  
    backToPage(){
      this.navCtrl.navigateForward('rfi', { state: { jobId: this.jobId } });
  }
  
    backToTradeDash(){
        this.navCtrl.navigateBack('trade-dashboard',{ state:{
          back : '1'
        }});
    }
  
  }
  