import { Component, OnInit, Input } from '@angular/core';
import { NavController ,ModalController, AlertController,ToastController,LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { JobfilePage } from '../jobfile/jobfile.page';
import { ContactslistPage } from '../contactslist/contactslist.page';
import { Router } from '@angular/router';
import { GroupslistPage } from '../groupslist/groupslist.page';
@Component({
  selector: 'app-addtrade',
  templateUrl: './addtrade.page.html',
  styleUrls: ['./addtrade.page.scss'],
})
export class AddtradePage {
  @Input('whichOne') whichOne;  
  public uploader: FileUploader;
  uploaderOptions: any;
    pet: string = "basicdetail";
    isAndroid: boolean = false;
    isOther: boolean = false;
    jobdetails : any;
    job_number : string;
    pm_name : string;
    pm_contact : string;
    timestamp : any;
    site_address : string;
    trade_name : string;
    site_city : string;
    site_state : string;
    site_zip : string;
    all_events_name : any;
    userId : any='';
    job_title : string; 
    job_id : string; 
    files_tab : string = 'local'; 
    icon_choosed : string = '0'; 
    trade_choosed : string = '1'; 
    filetype_error: any = '0'; 
    filesize_error: any = '0';
    add_disabled: boolean;
    trade_icon:string;
    form: FormGroup;
    all_icons: any = [];
    alls_icons: any = [];
    all_invitees : any;
    all_events : any;
    my_events : any;
    events : any;
    all_codeTypes : any;
    images_types : any;
    reminder_one_month: string;
    reminder_two_weeks: string;
    reminder_one_week: string;
    reminder_three_days: string;
    reminder_one_day: string;
    calendarDate: any = null;
    dte:any;
    mnth:any;
    all_trades:any;
    all_files:any = [];
    // alls_trades:any;
    curr_year:any;
    allYears:any;
    baseUrl:any = localStorage.getItem('APIURL');
    eventSource : any;
    dateTime:any;
    viewTitle;
    isBrowser:any;
    file_uploader_cats:any;
    isToday:boolean;
    calendar = {
      mode: 'month',
      currentDate: new Date()
    };
    stateData:any = '';
    active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
    constructor( 
      public router:Router,
      public modalCtrl: ModalController , 
      public navCtrl: NavController, 
      public APIService: APIService, 
      public alertCtrl: AlertController, 
      public componentService: ComponentService, 
      private formBuilder:FormBuilder) {
      this.dateTime = new Date().getTime();
      this.isBrowser = localStorage.getItem('isBrowser');
      this.reminder_one_month = '0';
      this.reminder_two_weeks = '0';
      this.reminder_one_week = '0';
      this.reminder_three_days = '0';
      this.reminder_one_day = '0';
      this.all_events = [];
      this.all_invitees = [];
      this.all_codeTypes = {
        'C' : 'Contract',
        'S' : 'Specification',
        'D' : 'Drawing',
        'O' : 'Other'
      };
      this.file_uploader_cats = [
        {
          name : 'Bid proposal',
          visible : false,
          required : false
        },
        {
          name : 'AIA Proposal',
          visible : false,
          required : false
        },
        {
          name : 'Supplementary Agreement',
          visible : false,
          required : false
        },
        {
          name : 'Bid breakdown',
          visible : false,
          required : false
        },
        {
          name : 'Trade license',
          visible : false,
          required : false
        },
        {
          name : 'Additional Trade License',
          visible : false,
          required : false
        },
        {
          name : 'Public Works License',
          visible : false,
          required : false
        },
        {
          name : 'State License',
          visible : false,
          required : false
        },
        {
          name : 'Insurance',
          visible : false,
          required : false
        },
        {
          name : 'Workers Comp Insurance',
          visible : false,
          required : false
        },
        {
          name : 'Umbrella Policy',
          visible : false,
          required : false
        },
        {
          name : 'Bid Bond',
          visible : false,
          required : false
        },
        {
          name : 'Bond',
          visible : false,
          required : false
        },
        {
          name : 'Misc.',
          visible : false,
          required : false
        },
        {
          name : 'Total Estimated Cost',
          visible : false,
          required : false
        }
      ];
  
      var current_date = new Date();
      this.stateData = this.router.getCurrentNavigation()?.extras.state;
      this.timestamp = current_date.getTime();
        
      this.job_id = this.stateData['job_id'];  
      this.userId = localStorage.getItem('userinfo');
  
      if(this.job_id == undefined)
      {
        var localJobId = localStorage.getItem('currentJobId');
        if(localJobId != '' && localJobId != undefined && localJobId != null){
          this.job_id = localJobId;
        }
        else{
          this.navCtrl.navigateForward('managejobs',{ state:{
            is_direct : '0'
          }});
        }
      }
  
      // this.job_id = job_id; 
      this.APIService.getData('jobDetails',this.job_id).subscribe((jobdetails:any)=>{
        jobdetails = jobdetails[0];
        this.job_number = jobdetails.job_number;
        this.job_title = jobdetails.job_title;
  
  
        this.APIService.getTradesList(this.baseUrl).subscribe((all_trades)=>{
        
          this.all_trades = all_trades;
            this.APIService.getData('lastTradeDetails',this.job_id).subscribe((tradedetails:any)=>{
              if(tradedetails != null)
              {
                this.pm_name = tradedetails.pm_name;
                this.pm_contact = tradedetails.pm_contact;
                this.site_address = tradedetails.site_address;
                this.site_city = tradedetails.site_city;
                this.site_state = tradedetails.site_state;
                this.site_zip = tradedetails.site_zip;
              }
          },
          err => {
              this.showTechnicalError();
          });
        },
        err => {
            this.showTechnicalError();
        });
      },
      err => {
          this.showTechnicalError();
      }); 
  
      var myDate = new Date();
      this.mnth = myDate.getMonth()+1;
      this.dte = myDate.getDate();
      this.mnth = (this.mnth+"").length > 1 ? this.mnth : "0"+this.mnth;
      this.dte = (this.dte+"").length > 1 ? this.dte : "0"+this.dte;
      var selectedDate =(myDate.getFullYear() +'-'+ this.mnth) +'-'+ this.dte;
      this.calendarDate = selectedDate;
  
      this.getAllYears();
  
      this.form = this.formBuilder.group({
        job_title: new FormControl({value: this.job_title, disabled: true}, []),
        job_number: new FormControl({value: this.job_number, disabled: true}, []),
        trade_name: ['', [Validators.required]],
        trade_index: ['', []],
        isOther: ['', []],
        trade_task: ['', []],
        trade_icon: ['', []],
        job_description: ['', []],
        pm_name: ['', []],
        pm_contact: ['', []],
        site_address: ['', []],
        site_city: ['', []],
        site_state: ['', []],
        site_zip: ['', []], 
        userId: ['', []],
        reminder_one_month: ['', []],
        reminder_two_weeks: ['', []],
        reminder_one_week: ['', []],
        reminder_three_days: ['', []],
        reminder_one_day: ['', []],
        curr_year: ['', []],
        visible: ['', []],
        required: ['', []],
        files_tab: ['', []],
        uploader_categories: ['',[]],
        required_uploads: ['',[]]
      });
      var APIURL = localStorage.getItem('APIURL');
      this.uploader  = new FileUploader({
        allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'],
        url: APIURL+'/tradeFilesUpload', 
        itemAlias: 'file',
        maxFileSize: 500*1024*1024
       });
  
          this.uploader.onBeforeUploadItem = (item) => {
              item.withCredentials = false;
          }
  
          this.uploader.onWhenAddingFileFailed = (check) => { 
            console.log(check)
                if(check.size > 500*1024*1024){
                  this.filesize_error = '1';
                }
                else{
                  this.filetype_error = '1';
                }
              }
  
          this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => { 
            var response = JSON.parse("[" + response + "]"); 
            item.name =  response[0].data.file_name; 
            this.all_files.push(item);
            
          };
  
    }
  
    form_submit_btn(){
      document.getElementById('form_submit_btn'+this.timestamp)!.click();
    }
  
    tradeSelected(index){
      if(index == ''){
        this.trade_icon = '';
      }
      else{
        if(this.all_trades[index].name != 'Others'){
          this.isOther = false;
          this.trade_name = this.all_trades[index].name;
        }
        else{
          this.isOther = true;
          this.trade_name = '';
        }
        this.trade_icon = this.all_trades[index].icon;
      }
    }
  
    showTechnicalError(type :any= null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');
    }
  
    getAllYears(){
      var cur_year = new Date().getFullYear();
      this.curr_year = cur_year;
      var last_year = new Date().getFullYear() + 50;
      var i;
      var allYears:any = [];
      for(i=cur_year; i<=last_year; i++){
        allYears.push(i);
      }
      this.allYears = allYears; 
    }
  
    goPreviousMonth() {
        this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() - 1));
        this.curr_year = this.calendar.currentDate.getFullYear();
      }
  
      goNextMonth() {
        this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() + 1));
        this.curr_year = this.calendar.currentDate.getFullYear();
      }
  
      goYear(choosed_year) {
        this.calendar.currentDate = new Date(this.calendar.currentDate.setFullYear(choosed_year));
      }
  
    clickthisone(type)
    { 
      if(this.uploader.queue.length > 0)  
      {
        for(var i=0; i< this.uploader.queue.length; i++){
          if(this.uploader.queue[i]['codeType'] == '0')
          {
            this.uploader.queue[i]['codeType'] = type;
          }  
        }
      }
    }
  
  
    async  presentModal13(myEvent13) 
     {
      let modal = await this.modalCtrl.create({
        component:'SelectattachmentPage',
        componentProps:{}
      });
      modal.present();
     }
   async presentModal14(myEvent14) 
     {
      let modal = await this.modalCtrl.create({
        component:'AddeventPage',
        componentProps:{
          current_date : this.calendarDate,
          isAdd : '1',
          all_events_name: this.all_events_name
        } });
      modal.onDidDismiss().then(res => {
        var data = res.data;
        if(data != undefined){
          var selectedDate = data.start_date;
          this.calendar.currentDate = new Date(selectedDate);
          this.all_events.push(data);
          var my_events:any = [];
          var eventSource:any = [];
          var all_events_name:any = [];
          this.all_events.forEach(function(event){
  
            if(selectedDate == event.start_date)
            {
              my_events.push(event); 
            }
            all_events_name.push(event.event_tagline);
            eventSource.push({
               title: event.event_title,
               startTime: new Date(event.start_date.split('-')[0],(Number(event.start_date.split('-')[1]) - 1),(Number(event.start_date.split('-')[2]))),
               endTime: new Date(event.start_date.split('-')[0],(Number(event.start_date.split('-')[1]) - 1),(Number(event.start_date.split('-')[2]))),
               allDay:true,
               color: 'primary',
               message: event.event_description,
               random: event.random
             });
  
          });
          this.my_events = my_events;
          this.eventSource = eventSource;
          this.all_events_name = all_events_name;
        }
     });
      modal.present();
      
  }  
  
  async editEvent(id,event,indx){
      let modal =  await this.modalCtrl.create({
      component:'AddeventPage',
      componentProps:{
        event_id: id, isEdit : '1', eve : event, all_events_name: this.all_events_name
      } });
   modal.onDidDismiss().then(res => {
    var data = res.data;
          if(data != undefined)
          {
            if(id == null){
              this.my_events[indx] = data;
              var self = this;
              var count = 0;
                this.all_events.forEach(function(eve){
                  if(event.random == eve.random){
                    self.all_events[count] = data;
                  }
                  else{
                    count = count + 1;
                  }
                });
                this.componentService.presentToast('Event updated.','success');
            } 
          }
        });
      modal.present();
  }
  
  removeFromQueue(file){
    this.all_files.splice(this.all_files.indexOf(file),1);
  }
  
  deleteFiles(file,index){
    this.all_files.splice(index,1);
  }
  
  async filemanagerFiles(fileCode){
    let modal =  await this.modalCtrl.create({
      component:'FilemanagerfilesPage',
      componentProps:{
        reply_rfi : '1',
        show_file_code : '1',
        fileCode : fileCode
        } });

     modal.onDidDismiss().then(((res:any) => {
      var data = res.data;
      if(data != undefined && data != '')
          {       
           var filesArray:any = [];
           var dateTime = this.dateTime;
           data.forEach(function(single_file){
              var fileobj = {
                file_name : single_file.name,
                name : single_file.name,
                folder_path : localStorage.getItem('filemanager_file_path'),
                random : dateTime,
                codeType : localStorage.getItem('sal_file_code')
              }
              filesArray.push(fileobj);
            });
  
           if(this.all_files != undefined)
           {
              this.all_files = this.all_files.concat(filesArray);
           }
           else
           {
              this.all_files = filesArray;
           }
           this.APIService.sendData('addBidFiles',filesArray).subscribe((filesdata)=>{
             console.log('done'); 
           },
            err => {
                this.showTechnicalError('1');
            });
          }
     }));
     modal.present();
  }
  
  async jobFiles(fileCode){
    let modal =  await this.modalCtrl.create({
      component:JobfilePage,
      componentProps:{
        reply_rfi : '1',
        jobId : '0',
        show_file_code : '1',
        fileCode : fileCode
        } });
     modal.onDidDismiss().then((res => {
      var data = res.data;
      if(data != undefined && data != '')
          {       
           var filesArray:any = [];
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
                name : file_name,
                folder_path : file_path,
                random : dateTime,
                codeType : localStorage.getItem('sal_file_code')
              }
              filesArray.push(fileobj);
            });
  
           if(this.all_files != undefined)
           {
              this.all_files = this.all_files.concat(filesArray);
           }
           else
           {
              this.all_files = filesArray;
           }
           this.APIService.sendData('addBidFiles',filesArray).subscribe((filesdata)=>{
             console.log('done'); 
           },
            err => {
                this.showTechnicalError('1');
            });
          }
     }));
     modal.present();
  }
  
  async deleteEvents(index){
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
              var event = this.my_events[index];
              this.my_events.splice(index,1);
              this.removeArray(this.all_events,event);
              var new_eventSource:any = [];
              var all_events_name :any= [];
              var self = this;
              this.eventSource.forEach(function(eve){
                if(event.random != eve.random){
                  new_eventSource.push(eve);
                  all_events_name.push(eve.event_tagline);
                }
                else{
                  self.removeArray(self.all_events,eve);
                }
              });
              this.eventSource = new_eventSource;
              this.all_events_name = all_events_name;
            }
          }
        ]
      });
      (await confirm).present();
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
  
  changeBidStatus(index,status)
  {
    this.all_invitees[index].bid_status = status;
  }
  
  async addContactInvites(myEvent14) 
  {
    var userId = localStorage.getItem('userinfo'); 
    var already_arr :any= [];
      if(this.all_invitees.length > 0)
      {
        this.all_invitees.forEach(function(data){
          already_arr.push(data.invite_email);
        });
      }
      let modal =  await this.modalCtrl.create({
        component:ContactslistPage,
        componentProps:{
          already : already_arr
          } });
    modal.onDidDismiss().then((res => {
      var data = res.data;
      if(data.length != undefined && data.length != 0)
      {
        var returnedArr:any = [];
        data.forEach(function(contact){
          var new_obj = {
              isMember : '1',
              userId : userId,
              inviteId : contact.userId, 
              invite_email : contact.email,
              status : '1',
              invite_name: '',
              invite_company: '',
              invite_phone: '',
              invite_title: '',
              bid_status: '1'
            }
          returnedArr.push(new_obj); 
        });
        this.all_invitees = this.all_invitees.concat(returnedArr);
      }
    }));
    modal.present();
  }
  
  async addGroupInvites() 
  {
    var userId = localStorage.getItem('userinfo'); 
    var already_arr:any = [];
      if(this.all_invitees.length > 0)
      {
        this.all_invitees.forEach(function(data){
          already_arr.push(data.invite_email);
        });
      }
      let modal =  await this.modalCtrl.create({
        component:GroupslistPage,
        componentProps:{
          already : already_arr
          } });
    modal.onDidDismiss().then(res => {
      var data = res.data;
      if(data.length != undefined && data.length != 0)
      {
        var returnedArr :any = [];
        var returnedEmails:any = [];
        data.forEach(function(contact){
          if(contact.emails != '')
          {
            var counter = 0;
            contact.emails.forEach(function(email){
              var new_obj = {
                isMember : '1',
                userId : userId,
                inviteId : contact.userIds[counter], 
                invite_email : email,
                status : '1',
                invite_name: '',
                invite_company: '',
                invite_phone: '',
                invite_title: '',
                bid_status: '1'
              }
              counter = counter + 1;
  
              if(already_arr.indexOf(email) == -1 && returnedEmails.indexOf(email) == -1)
              {
                returnedArr.push(new_obj);
                returnedEmails.push(email);
              }
            })
          } 
        });
        this.all_invitees = this.all_invitees.concat(returnedArr);
      }
    });
    modal.present();
  }
  
  async addExternalContacts() 
  {
    var userId = localStorage.getItem('userinfo'); 
    var already_arr :any = [];
      if(this.all_invitees.length > 0)
      {
        this.all_invitees.forEach(function(data){
          already_arr.push(data.invite_email);
        });
      }
      let modal =  await this.modalCtrl.create({
        component:ContactslistPage,
        componentProps:{
          already : already_arr, is_external : '1'
          } });
    modal.onDidDismiss().then(res => {
      var data = res.data
      if(data.length != undefined && data.length != 0)
      {
        var returnedArr :any= [];
        data.forEach(function(contact){
          var new_obj = {
              isMember : '0',
              userId : userId,
              inviteId : '0', 
              invite_email : contact.email,
              status : '1',
              invite_name: '',
              invite_company: '',
              invite_phone: '',
              invite_title: '',
              bid_status: '1'
            }
          returnedArr.push(new_obj); 
        });
        this.all_invitees = this.all_invitees.concat(returnedArr);
      }
    });
    modal.present();
  }
  
  async addContactManually()
    {
      var already_arr:any = [];
      if(this.all_invitees.length > 0)
      {
        this.all_invitees.forEach(function(data){
          already_arr.push(data.invite_email);
        });
      }
      let modal = await this.modalCtrl.create({component:'AddcontactPage',
        componentProps:{trade_page:'1',already : already_arr}
     });
        modal.onDidDismiss().then(res => {
          var data = res.data;
          if(data != null && data != undefined && data != '')
          {
            this.all_invitees = this.all_invitees.concat(data);
            console.log(this.all_invitees)
          }
         });
      modal.present(); 
    }
  
  deleteInvitees(index)
  {
    this.all_invitees.splice(index,1);
  }
  
  addTrade(){ 
      for (let i in this.form.controls) {
        this.form.controls[i].markAsTouched();
      }
      if(this.form.valid){
      this.componentService.showLoader();
        this.form.value.uploader_categories = this.file_uploader_cats;
        var required_uploads :any= [];
        this.form.value.uploader_categories.forEach(function(cat){
          if(cat.visible == true && cat.required == true){
            required_uploads.push(cat.name);
          }
        });
        this.form.value.required_uploads = required_uploads;
          this.APIService.sendData('trades/'+this.job_id,this.form.value).subscribe((formdata:any)=>{
          if(formdata.status == '1')
          {
            var current_trade_id = formdata.data._id;
            this.APIService.sendData('calendarEvents/'+this.job_id+'/'+current_trade_id ,this.all_events).subscribe((formdata)=>{
                this.APIService.sendData('addInviteBidders/'+this.job_id+'/'+current_trade_id,this.all_invitees).subscribe((formdata)=>{
                  // upload files 
                  if(this.all_files.length > 0) 
                  {
                    var filesArray:any = []; 
                    var file_type = '';
                    var images_types = ['jpg','png','jpeg','gif','bmp']; 
                    this.all_files.forEach(function(single_file){
                        if(images_types.indexOf(single_file.name.split('.').pop()) >= 0)
                        {
                          file_type = '0';
                        }
                        else
                        {
                          file_type = '1';
                        }
                        var fileobj = {
                          file_name : single_file.name.replace(" ","_"),
                          code : single_file.codeType,
                          status : '1',
                          type : file_type,
                          folder_path : (single_file.folder_path != '' && single_file.folder_path != null && single_file.folder_path != undefined) ? single_file.folder_path : '',
                          file_path : 'directory/jobs_data'
                        }
                        filesArray.push(fileobj);
                    });
                    this.APIService.sendData('addTradeFiles/'+this.job_id+'/'+current_trade_id+'/temp',filesArray).subscribe((filesdata)=>{
                        this.componentService.dismissLoader();
                        this.componentService.presentToast('Trade information has been saved successfully.','success');
                           //this.navCtrl.pop();
                            this.navCtrl.navigateForward('EdittradePage', {state:{  
                              job_id: this.job_id,
                              tradeId: current_trade_id
                            }});
                        },
                        err => {
                            this.componentService.dismissLoader();
                            this.showTechnicalError('1');
                        });
                  }
                  else
                  {
                    this.componentService.dismissLoader();
                    this.componentService.presentToast( 'Trade information has been saved successfully.','success');
                   // this.form.reset();
                        this.navCtrl.navigateForward('EdittradePage',{state: {  
                          job_id: this.job_id,
                          tradeId: current_trade_id
                        }});
                  }
                },
                err => {
                    this.componentService.dismissLoader()
                    this.showTechnicalError('1');
                });  
            },
            err => {
                this.componentService.dismissLoader()
                this.showTechnicalError('1');
            });
            
          }
          else if(formdata.status == '2')
          {
            this.componentService.dismissLoader();
            this.componentService.presentToast('Trade Aready Exists.','danger'); 
          }
          else
          {
            this.componentService.dismissLoader();
            this.componentService.presentToast('Error, plz try later.','danger');
          }
        
        },
        err => {
            this.componentService.dismissLoader()
            this.showTechnicalError('1');
        });
      }
      else
      {

        this.componentService.presentToast('Trade name is required.', 'danger');
         this.pet = 'basicdetail';
      }
    }
    
  
  
      onViewTitleChanged(title) {
          this.viewTitle = title;
      }
  
      onEventSelected(event) {
          console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
      }
  
      changeMode(mode) {
          this.calendar.mode = mode;
      }
  
      today() {
          this.calendar.currentDate = new Date();
      }
  
      onTimeSelected(ev) {
          var myDate = ev.selectedTime;
          var mnth = myDate.getMonth()+1;
          var dte = myDate.getDate();
          mnth = (mnth+"").length > 1 ? mnth : "0"+mnth;
          dte = (dte+"").length > 1 ? dte : "0"+dte;
          var selectedDate =(myDate.getFullYear() +'-'+ mnth) +'-'+ dte;
          this.calendarDate = selectedDate;
          var my_events :any = [];
          this.all_events.forEach(function(event){
  
            if(selectedDate == event.start_date)
            {
              my_events.push(event); 
            }
  
          });
          this.my_events = my_events;
  
      }
  
      onCurrentDateChanged(event:Date) {
          var today = new Date();
          today.setHours(0, 0, 0, 0);
          event.setHours(0, 0, 0, 0);
          this.isToday = today.getTime() === event.getTime();
          if(event.getTime() < today.getTime())
          {
            this.add_disabled = true;
            this.componentService.presentToast('Please select future date to add event.','danger');
          }
          else
          {
            this.add_disabled = false;
          }
      }
      
  
       root(){
          this.navCtrl.navigateRoot(['dashboard', "0"]);
        };
        
        goToJobs(){
          this.navCtrl.navigateForward('managejob',{state:{
          is_direct : '0'
          }});
        };
  
        backToPage()
        {
          this.navCtrl.navigateForward('trade',{state:{
            job_id : this.job_id
          }})
        }
  
        backToTradeDash()
        {
          this.navCtrl.navigateForward('trade-dashboard',{state:{
            back : '1'
          }});
        }
  
        getIcons(ev: any) { 
        this.icon_choosed = '0';
        this.all_icons=this.alls_icons;
          let val = ev.target.value;
          if (val && val.trim() != '') {
            this.all_icons = this.all_icons.filter((item) => {
              return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
          }
        }
  
        
        chooseIcon(icon)
        {
          this.trade_icon = icon;
          this.icon_choosed = '1';
        }
  
        chooseTrade(trade)
        {
          this.trade_name = trade;
          this.trade_choosed = '1';
        }
  
        closeError(){
          this.filetype_error = '0';
        }
        closeErrorS(){
          this.filesize_error = '0';
        }
  
        next(){
          if(this.pet == 'basicdetail'){
            this.pet = 'invite';
          }
          else if(this.pet == 'invite'){
            this.pet = 'events';
          }
          else if(this.pet == 'events'){
            this.pet = 'reminder';
          }
        }
  
        prev(){
          if(this.pet == 'reminder'){
            this.pet = 'events';
          }
          else if(this.pet == 'invite'){
            this.pet = 'basicdetail';
          }
          else if(this.pet == 'events'){
            this.pet = 'invite';
          }
        }
  
  
  }
  
  