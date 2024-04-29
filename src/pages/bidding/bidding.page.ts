import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController,ToastController,LoadingController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';
@Component({
  selector: 'app-bidding',
  templateUrl: './bidding.page.html',
  styleUrls: ['./bidding.page.scss'],
})
export class BiddingPage  {
  userId:any;
  bidJobId:any;
  bidjobdetail:any;
  posted_by :any;
  posted_email :any;
  posted_image :any;
  pm_name :any;
  tradeId :any;
  pm_contact :any;
  bid_status :any;
  bid_original_status :any;
  jobId :any;
  job_number :any;
  job_name :any;
  trade_name :any;
  site_address :any;
  trade_task :any;
  download_attachments :any;
  job_description :any;
  all_events :any;
  applied_bids :any;
  invite_email :any;
  invite_name :any;
  isAwarded :any;
  all_attachments :any;
  APIURL :any;
  isVisible : any = '0';
  all_codeTypes :any;
  isBrowser:any;
  current_date:any;
  downloaded_href : any = '#';
  baseUrl : any = localStorage.getItem('baseUrl');
  isBidExpired:Boolean=false;
  errors:any=['',null,undefined];
  constructor(
    private transfer: FileTransfer, 
    private file: File,
    public navCtrl: NavController,
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public APIService: APIService,
    public componentService:ComponentService) {
    this.isBrowser = localStorage.getItem('isBrowser');
    this.bidJobId = history.state.bidJobId;
    this.bid_status = history.state.status;
    this.userId = localStorage.getItem('userinfo');
    this.APIURL = localStorage.getItem('APIURL');
    var currentdate = new Date(); 
    this.current_date = currentdate.getFullYear() + "-"
                  + (currentdate.getMonth()+1 < 10 ? "0"+(currentdate.getMonth()+1) : currentdate.getMonth()+1)  + "-" 
                  + (currentdate.getDate() < 10 ? "0"+currentdate.getDate() : currentdate.getDate()) + " "  
                  + (currentdate.getHours() < 10 ? "0"+currentdate.getHours() : currentdate.getHours()) + ":"  
                  + (currentdate.getMinutes() < 10 ? "0"+currentdate.getMinutes() : currentdate.getMinutes());
    if(this.bid_status == 'associate_accept' || this.bid_status == 'associate_reject')
    {
      var status = this.bid_status == 'associate_accept' ? '1' : '2';
      this.componentService.showLoader();
      var postData = {
        'employeeId':this.bidJobId,
        'status':status
      }
      this.APIService.sendData('changeStatusEmployee',postData).subscribe((updated)=>{
        this.componentService.presentToast('Status updated successfully.','success');
            this.componentService.dismissLoader();
             this.navCtrl.navigateRoot('login');
      },
        err => {
            this.componentService.dismissLoader();
            this.showTechnicalError('1');
        });
    }
    else if(this.bid_status == '11'){
      var isLogged = localStorage.getItem('userinfo');
      if(isLogged != undefined && isLogged != null && isLogged != ''){
        this.navCtrl.navigateForward('FilemanagerPage', {state:{
              notis_redirect : '1'
            }});
      }
      else{
        localStorage.setItem('redirect_after','file_sharing');
          localStorage.setItem('redirect_id',null || '');
          this.componentService.presentToast('Please login to access this page.','info')
      
          this.navCtrl.navigateRoot('login',{
           state: {email : this.bidJobId} 
          });
      }
    }
    else
    {
        if((this.bid_status == '1' || this.bid_status == '2' || this.bid_status == '3') && (this.userId == '' || this.userId == null || this.userId == undefined)){
   this.presentAlert();
      }
      
      this.all_codeTypes = {
          'C' : 'Contract',
          'S' : 'Specification',
          'D' : 'Drawing',
          'O' : 'Other'
        };
       this.componentService.showLoader();
      this.APIService.getData('bidJobsDetail',this.bidJobId).subscribe((bidjobdetails)=>{
        if(bidjobdetails == '')
        {
         this.componentService.presentToast('Invalid post.','danger');
         this.componentService.dismissLoader()
         this.navCtrl.navigateRoot('login');
        }
          else
          {
            this.bidjobdetail = bidjobdetails[0];
          this.posted_by = this.bidjobdetail.posted_by;
          this.posted_email = this.bidjobdetail.posted_email;
          this.posted_image = this.bidjobdetail.posted_image;
          this.jobId = this.bidjobdetail.jobId;
          this.tradeId = this.bidjobdetail.tradeId;
          this.pm_name = this.bidjobdetail.pm_name;
          this.pm_contact = this.bidjobdetail.pm_contact;
          this.job_number = this.bidjobdetail.job_number;
          this.job_name = this.bidjobdetail.job_name;
          this.trade_name = this.bidjobdetail.trade_name;
          this.site_address = this.bidjobdetail.site_address;
          this.trade_task = this.bidjobdetail.trade_task;
          this.job_description = this.bidjobdetail.job_description;
          this.invite_email = this.bidjobdetail.invite_email;
          this.invite_name = this.bidjobdetail.invite_name;
          this.isAwarded = this.bidjobdetail.isAwarded;
          this.bid_original_status = this.bidjobdetail.bid_status;
          localStorage.setItem('bid_job_name',this.job_name);
          // if(navParams.get('from_page') == '1'){
          //   this.myRFIs();
          // }
          // if(navParams.get('go_transmittal') == '1' || this.bid_status == '9'){
          //   this.myTransmittals();
          // }
          // if(localStorage.getItem('unc_email') == '1' || ((this.userId != '' && this.userId != null && this.userId != undefined) && (this.bidjobdetail.isMember == '0'))){
          // let alert = this.alertCtrl.create({
          //     header: '',
          //     message: 'Do you want to add the unaccounted e-mail into your account and have this job’s alerts sent to it?',
          //     buttons: [
          //       {
          //         text: 'No',
          //         role: 'cancel',
          //         handler: () => {
          //           localStorage.removeItem('unc_email');
          //         }
          //       },
          //       {
          //         text: 'Yes',
          //         handler: () => {
          //           localStorage.removeItem('unc_email');
          //           localStorage.setItem('job_alert_popup','1');
          //           this.navCtrl.push('ProfilePage',{
          //             bidJobId : this.bidJobId,
          //             unconnected : '1',
          //             invite_email : this.invite_email
          //           });
          //         }
          //       }
          //     ]
          //   });
          //   alert.present();
          // }
          var self = this;
          this.APIService.getData('getCalendarEvents',this.tradeId+'/'+'trades').subscribe((all_events)=>{
              this.all_events = all_events;
              if(this.all_events != ''){
                this.all_events.forEach(function(eve){
                  if(eve.event_tagline == 'Bid Deadline'){
                    var bid_dead_date = eve.start_date+' '+eve.event_time;
                    if(self.current_date > bid_dead_date){
                      self.isBidExpired = true;
                    }
                    
                  }
                });
              }
              console.log(self.isBidExpired)
          },
          err => {
             this.showTechnicalError();
          });
  
          this.APIService.getData('getTradeFiles',this.tradeId).subscribe((all_attachments)=>{
              this.all_attachments = all_attachments;
              interface Attachment {
                source: string;
                target: string;
            }
            
            // Assuming attachments is initially an empty array
            let attachments: Attachment[] = [];
              if(this.all_attachments != '')
              {		
                this.all_attachments.forEach(function(data){
              
                 var obj = {
                    source : 'directory/jobs_data/'+data.file_name,
                    target : data.file_name.indexOf('_--_') >= 0 ? data.file_name.split('_--_').pop(-1) : data.file_name.split('____').pop(-1)
                  }
                  attachments.push(obj);
                })
              }
              this.download_attachments = attachments;
            },
            err => {
               this.componentService.dismissLoader();
                this.showTechnicalError();
            });
  
          this.APIService.getData('getAppliedBids',this.tradeId+'/'+this.bidJobId).subscribe((applied_bids)=>{
              this.applied_bids = applied_bids;
              if(this.applied_bids.length > 0)
              {
                interface returnArr {
                  bid_comments: string;
                  bid_date: string;
                  files:string,
                  bid_status:string,
                  bidId : string,
                  reply_comment: string,
                  isAccepted:string
              }
              
              // Assuming attachments is initially an empty array
              let returnArr: returnArr[] = [];
                this.applied_bids.forEach(function(data){
                  var obj = {
                    bid_comments : data.bid_comments,
                    bid_date : data.bid_date,
                    files : data.files == null ? [] : JSON.parse(data.files), 
                    bid_status : data.bid_status,
                    bidId : data.bidId,
                    reply_comment : data.reply_comment,
                    isAccepted : data.isAccepted,
                  };
                  returnArr.push(obj);
                });
                this.applied_bids = returnArr;
              }
              this.componentService.dismissLoader();
              this.isVisible = '1';
            },
            err => {
              this.componentService.dismissLoader();
                this.showTechnicalError();
            });
          }
      },
        err => {
          this.componentService.dismissLoader();
            this.showTechnicalError();
        });
    }
  
  }
  
  myRFIs() 
  {
    localStorage.setItem('award_state','pre_awarded');
    this.navCtrl.navigateForward('MyRfisPage', { state: {
      jobId:this.jobId,
      tradeId:this.tradeId,
      InviteId:this.bidJobId,
      isAwarded:this.isAwarded
    }});
  }
 async  presentAlert(){
    let alert =  await this.alertCtrl.create({
      header: '',
      message: 'Are you existing member of salvum?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            localStorage.setItem('redirect_after','biddetails');
          localStorage.setItem('redirect_id',this.bidJobId);
          this.componentService.presentToast('Please login with your account.','info')
        
          this.navCtrl.navigateRoot('login');
          }
        }
      ]
    });
   await alert.present();
  }
  openSubmitbidPage(bid_status)
  {
    if(bid_status !== undefined && bid_status != '')
    {
      this.navCtrl.navigateForward('SubmitbidPage', { state: {
        jobId:this.jobId,
        tradeId:this.tradeId,
        bid_status:bid_status,
        bidJobId:this.bidJobId,
        invite_email:this.invite_email
      }});
    }
    else
    {
      this.componentService.presentToast('Please select status.','danger');
    }
  }
  
  downloadFile()
  {
    this.componentService.presentToast('Start downloading....','info');
  }
  
  downloadAndroid(url,name) {
    this.componentService.presentToast('Start downloading....','success');
   
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(url, this.file.externalRootDirectory + name.split('____').pop()).then((entry) => {
      this.componentService.presentToast( 'File downloaded.','success');
     
    }, (error) => {
      this.componentService.presentToast( 'Error','danger');

    });
  }
  
  viewContract()
  {
    this.navCtrl.navigateForward('ViewcontractPage', {state:{
      jobId : this.jobId,
      tradeId : this.tradeId,
      bidId : this.bidJobId
    }})
  }
  myTransmittals()
  {
    this.navCtrl.navigateForward('direct-transmittals',{ state: {
      jobId : this.jobId,
      InviteId : this.bidJobId,
      tradeId : this.tradeId
    }});
  }
 async  downloadPdf()
  {
    let modal = await this.modalCtrl.create({ 
      component: 'PdfPage',
      componentProps:{   
        jobId : this.jobId,
        tradeId : this.tradeId,
        bidId : this.bidJobId
      }});
   
      await modal.present();
  }
  root(){
    this.navCtrl.navigateRoot('dashboard');
  };
  goToBids()
  {
    this.navCtrl.navigateForward('bidjobs', {state : {
      type: '0'
    }});
  }
  downloadAll()
  {
    if(this.download_attachments != '')
    {
     this.componentService.showLoader();
      this.APIService.sendData('downloadBidAttachments',this.download_attachments).subscribe((downloaded:any)=>{
        if(downloaded['status'] == '1')
        {
         this.componentService.dismissLoader();
          this.downloaded_href = this.APIURL+'/salvum/'+downloaded.data.path;
          console.log(this.downloaded_href)
          this.componentService.presentToast('Start downloading...','success')
            
              setTimeout(function(){ 
                var downloadZip :any= document.getElementById('download_zip_attachments');
                downloadZip.click(); 
              }, 1000);
        }
        else
        {
         this.componentService.dismissLoader();
         this.componentService.presentToast('Error, plz try later.','danger')
        
        }
      },
        err => {
           this.componentService.dismissLoader();
            this.showTechnicalError();
        });
    }
    else
    {
      this.componentService.presentToast('No attachments found.','danger')

    }
  }
  
  changeStatusBid(id,status){
    this.componentService.showLoader();
    var data={
    'bidId':id,
    'bid_status':status
    }
      this.APIService.sendData('updateBidStatus',data).subscribe((updated)=>{
        if(updated['status'] == 1)
        {
              this.componentService.dismissLoader();
              this.componentService.presentToast('Status updated.','success');
            
        }
        else
        {
            this.componentService.dismissLoader();
            this.componentService.presentToast('Error, plz try later.','danger');
            
        }
      },
      err => {
         this.componentService.dismissLoader();
          this.showTechnicalError('1');
      });
  }
  
  showTechnicalError(type:any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast( 'Technical error, Please '+msg,'info');
    
    }
  
  }
  
