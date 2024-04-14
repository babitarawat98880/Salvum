import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from "@ionic/angular"; 
import { NavController,IonContent, PopoverController, ModalController,AlertController,ToastController, NavParams, LoadingController } from '@ionic/angular';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import * as filesize from 'filesize';
// import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  userImage:any;
  userName:any;
  pages: Array<{title: string, component: any, icon: string, url:string}>;
  countChanged:any;
  level0:string;
  level1:string;
  level2:string;
  level3:string;
  isBrowser:any;
  count :any;
  userId :any;
  dashboard_data :any;
  subscription :any;
  subscription_amount :any = '0';
  subscription_expiry :any;
  license_expiry :any;
  total_contacts :string = '0';
  total_jobs_posted :string = '0';
  total_jobs_invitation :string = '0';
  total_applied_jobs :string = '0';
  subscription_title :string = '';
  consumed_percent :any = '0';
  is_license_activated :any;
  space_type :any;
  is_recurring_billing : any;
  subscriptionId : any;
  stats :any ;
  companies :any ;
  current_companyId :any ;
  companyId :any ;
  data: Object = {};
  email: Object = {};
  sms: Object = {};
  checkDate : any;
  passinfo:any;
  sendData = {};
  items: Array<{}>;
  lenthlevel1 : number;
  lenthlevel2 : number;
  lenthlevel3 : number;
  lenthlevel4 : number;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  accptInvitation = 'accptinvitation';
  notificationData = 'notification';
  alllevel:any;
  new_notis:any;
  members:any = [];
  objData:any='';
  APIURL:any = localStorage.getItem('APIURL');
  @ViewChild('content', { static: false }) content: IonContent;
  constructor(
    private menu: MenuController,
    private navCtrl: NavController,
    public popoverCtrl: PopoverController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public componentService:ComponentService,
    public APIService:APIService,
    public route: ActivatedRoute,
    public router: Router
  ) { 
    this.APIURL = localStorage.getItem('APIURL');
    this.API_ENDPOINT_URL = localStorage.getItem('API_ENDPOINT_URL');
    this.userImage = localStorage.getItem('userImage');
    this.userName = localStorage.getItem('userName'); 
    this.pages = [
      { title: 'Profile', component: 'ProfilePage', icon: "person-outline", url:'/profile' },
      { title: 'License', component: 'LicensePage', icon: "ribbon", url:'/profile' },
      { title: 'History', component: 'HistoryPage', icon: "time-outline" , url:'/profile'},
      { title: 'Upgrade Package', component: 'PricingPage', icon: "pricetag-outline", url:'/profile' },
    ];
    localStorage.setItem('openedLevel', null || '');
    this.route.queryParams.subscribe(params => {
      console.log(this.route.snapshot.paramMap.get('id'));
      this.objData.id = this.route.snapshot.paramMap.get('id')
     
    });

    if(this.objData.userId != ':id' && this.objData.userId != '0' && this.objData.userId != ':userId' && this.objData.userId != undefined){
      localStorage.setItem('isUserId', 'true');
      localStorage.setItem('memberId',this.objData.userId);
      this.sendData = {
        memberId : this.objData.userId,
        memberstatus : '2'
      }
      localStorage.setItem('view', 'Inbox');
      this.APIService.putData('accptinvitation',this.sendData).subscribe((dashboard_data:any)=>{
        if(dashboard_data.error){
          this.componentService.presentToast(dashboard_data.error,'danger' );
        }else{
          this.componentService.presentToast('Invitation has been accepted successfully.','success' );
            // this.events.publish('countChanged:changed', '');
            this.countChanged = '1';
        }
      },
      (err:any) => {
          this.showTechnicalError();
      });
    }
    this.userId = localStorage.getItem('userinfo');
    // this.getUpdates().subscribe((new_notis:any) => {
    //   this.new_notis = new_notis;
    //   if(this.new_notis.type == 1){
    //     this.friendRequests();
    //   }
    // });

    if(localStorage.getItem('job_alert_popup') == '1'){
      this.jobAlert();
    }
  }

  ngOnInit() {
    console.log(this.userId)
    // this.componentService.showLoader();
    var created_date = new Date();
    var expiry_date, timeDiff;
    this.APIService.getData('getUserDashboardData',this.userId).subscribe((dashboard_data:any)=>{  
      this.componentService.dismissLoader();
      this.dashboard_data = dashboard_data[0];
      this.subscription = this.dashboard_data['subscription'];
      this.stats = this.dashboard_data['stats'];
      this.space_type = this.stats.space_type;
      this.companyId = this.stats.companyId;
      this.current_companyId = this.stats.companyId;
      localStorage.setItem('switched_comp',this.companyId);
      this.is_recurring_billing = this.stats.is_recurring_billing;
      this.subscriptionId = this.stats.subscriptionId;
      var space_type = this.space_type;
      // var gbs = filesize(this.stats.actual_consumed_space, {exponent: (space_type == 'bytes' ? 0 : (space_type == 'KB' ? 1 : (space_type == 'MB' ? 2 : (space_type == 'GB' ? 3 : (space_type == 'TB' ? 4 : 5)))))}).split(' ')[0];
      // this.consumed_percent = Math.round((gbs/this.stats.actual_consumed_space)*100);
      if(this.subscription != '')
      {
        this.subscription_title = this.subscription['title'];
        this.subscription_amount = this.subscription['amount'];
        expiry_date = new Date(this.subscription['expiry_date']);

        timeDiff = Math.abs(expiry_date.getTime() - created_date.getTime());
        this.subscription_expiry = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      }
      else
      {
        this.subscription_amount = '0';
      }

      this.is_license_activated = this.dashboard_data['is_license_activated'];
      if(this.is_license_activated > 0){
        expiry_date = new Date(this.stats['license_end']);

        timeDiff = Math.abs(expiry_date.getTime() - created_date.getTime());
        this.license_expiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
      this.total_contacts = this.dashboard_data['total_contacts'];
      this.total_jobs_posted = this.dashboard_data['total_jobs_posted'];
      this.total_jobs_invitation = this.dashboard_data['total_jobs_invitation'].length;
      this.total_applied_jobs = this.dashboard_data['total_applied_jobs'];
        //get user companies
        this.APIService.getData('userCompaniesList',this.userId).subscribe((companies:any)=>{
          this.companies=companies;
          console.log(this.companies)
     
          if(companies != ''){
            var self = this;
            console.log(this.companyId)
            this.
            companies.forEach(function(company:any){
              if(company._id == self.companyId){
                localStorage.setItem('curr_comp_name',company.company_name);
              }
            });
          }
        },
        (err:any) => {
            this.showTechnicalError();
        });
     this.componentService.dismissLoader()
    },
    (err:any) => {
       this.componentService.dismissLoader()
        this.showTechnicalError();
    });
  }
  async jobAlert(){
    let confirm =  await this.alertCtrl.create({
      header: '',
      message: 'Would you like to get job alerts on another secondary email?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            localStorage.removeItem('job_alert_popup');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.navigateForward('ProfilePage');
          }
        }
      ]
    });
    await confirm.present();
  }
  
  close(){
    this.menu.close();
  }
  ionViewDidLoad() { 
    this.isBrowser = localStorage.getItem('isBrowser');
    // get dashboard data
     this.componentService.showLoader()
      var created_date = new Date();
      var expiry_date, timeDiff;
      this.APIService.getData('getUserDashboardData',this.userId).subscribe((dashboard_data:any)=>{  
        this.componentService.dismissLoader();
        this.dashboard_data = dashboard_data[0];
        this.subscription = this.dashboard_data['subscription'];
        this.stats = this.dashboard_data['stats'];
        this.space_type = this.stats.space_type;
        this.companyId = this.stats.companyId;
        this.current_companyId = this.stats.companyId;
        localStorage.setItem('switched_comp',this.companyId);
        this.is_recurring_billing = this.stats.is_recurring_billing;
        this.subscriptionId = this.stats.subscriptionId;
        var space_type = this.space_type;
        // var gbs = filesize(this.stats.actual_consumed_space, {exponent: (space_type == 'bytes' ? 0 : (space_type == 'KB' ? 1 : (space_type == 'MB' ? 2 : (space_type == 'GB' ? 3 : (space_type == 'TB' ? 4 : 5)))))}).split(' ')[0];
        // this.consumed_percent = Math.round((gbs/this.stats.actual_consumed_space)*100);
        if(this.subscription != '')
        {
          this.subscription_title = this.subscription['title'];
          this.subscription_amount = this.subscription['amount'];
          expiry_date = new Date(this.subscription['expiry_date']);

          timeDiff = Math.abs(expiry_date.getTime() - created_date.getTime());
          this.subscription_expiry = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        }
        else
        {
          this.subscription_amount = '0';
        }

        this.is_license_activated = this.dashboard_data['is_license_activated'];
        if(this.is_license_activated > 0){
          expiry_date = new Date(this.stats['license_end']);

          timeDiff = Math.abs(expiry_date.getTime() - created_date.getTime());
          this.license_expiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
        }
        this.total_contacts = this.dashboard_data['total_contacts'];
        this.total_jobs_posted = this.dashboard_data['total_jobs_posted'];
        this.total_jobs_invitation = this.dashboard_data['total_jobs_invitation'].length;
        this.total_applied_jobs = this.dashboard_data['total_applied_jobs'];
          //get user companies
          this.APIService.getData('userCompaniesList',this.userId).subscribe((companies:any)=>{
            this.companies=companies;
            if(companies != ''){
              var self = this;
             console.log(this.companyId , "this.companyId ")
              companies.forEach(function(company:any){
                if(company._id == self.companyId){
                  localStorage.setItem('curr_comp_name',company.company_name);
                }
              });
            }
          },
          (err:any) => {
              this.showTechnicalError();
          });
       this.componentService.dismissLoader()
      },
      (err:any) => {
         this.componentService.dismissLoader()
          this.showTechnicalError();
      });

      // this.friendRequests();
  };

  showTechnicalError(type:any = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please '+msg,'info' );
  }

  async presentPopover1(myEvent1: Event) {
    const popover = await this.popoverCtrl.create({
      component: 'AddnotificationPage',
      event: myEvent1,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log(`Popover dismissed with role: ${role}`);
  }
 async presentModal(myEvent1:any) {
    let modal = await this.modalCtrl.create({
      component: 'ModalsPage',
      componentProps:{  ev: myEvent1},
    })
    await modal.present();
   
  };

  showMessages(){
    // this.navCtrl.navigateForward('MessagePage',this.items)
  };
  
  async switchCompany(){
    if(this.companyId != '' && this.companyId != undefined && this.companyId != null){
      if(this.companyId == this.current_companyId){
        this.componentService.presentToast('Please change another company to switch.you are already under this company.','danger');
      }
      else{
        let confirm = await this.alertCtrl.create({
        header: '',
        message: 'After switching the company, you will only see the selected company job and license system. Do you wish to continue?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.companyId = this.current_companyId;
            }
          },
          {
            text: 'Yes',
            handler: () => {
             this.componentService.showLoader();
              this.APIService.sendData('switchUserCompany',{userId : this.userId, companyId : this.companyId}).subscribe((result:any)=>{
                if(result.status == 1)
                {
                  this.componentService.dismissLoader();
                  this.componentService.presentToast('You are switched to selected company.','success')
                     this.current_companyId = this.companyId;
                     localStorage.setItem('switched_comp',this.companyId);
                    //  this.events.publish('is_license_activated:changed', '');
                     this.is_license_activated = '0';
                }
                else
                {
                    this.componentService.dismissLoader();
                    this.componentService.presentToast('Error, plz try later.','danger')
          
                }
              },
              (err:any) => {
                  this.componentService.dismissLoader();
                  this.showTechnicalError('1');
              });
            }
          }
        ]
      });
     await confirm.present();
      }
    }
    else{
      this.componentService.presentToast('Please select company.','danger')
      
    }
  }

  openSmailPage(){
    localStorage.setItem('view', 'Inbox');
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '{}');
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value:any) => {
          //console.log(value);
          var decrypted = CryptoJS.AES.decrypt(value, userId || '');
          if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
              isLevelOpened = true;
          }
      });
    }

    if (!isLevelOpened) {
      // let toast = this.toastCtrl.create({
      //   message: 'Please open level first.',
      //   duration: 3000,
      //   position: 'top',
      //   cssClass: 'info'
      // });
      // toast.present();
      localStorage.setItem('openedLevel', '0')
      this.navCtrl.navigateForward('SmailInboxPage');
    }else{
      localStorage.setItem('openedLevel','all')
      this.navCtrl.navigateForward('SmailInboxPage');
    }
  };

  openBidPage(){
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '{}');
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value:any) => {
          //console.log(value);
          var decrypted = CryptoJS.AES.decrypt(value, userId ||'');
          if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
              isLevelOpened = true;
          }
      });
    }

    if (!isLevelOpened) {
      this.componentService.presentToast('Please open level first.','info')
  
    }else{
      this.navCtrl.navigateForward('bidjobs', { state: {
        type: '0'
      } });
    }
    
  };

  openFilesPage(){
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '{}');
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value:any) => {
          //console.log(value);
          var decrypted = CryptoJS.AES.decrypt(value, userId || '');
          if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
              isLevelOpened = true;
          }
      });
    }

    if (!isLevelOpened) {
      this.componentService.presentToast( 'Please open level first.','info' )
    }else{
      this.navCtrl.navigateForward('FilemanagerPage');
    }
    
  };

  async openJobsPage(){
    if(this.is_license_activated == '0')
    {
      let modal = await this.modalCtrl.create({ component: 'UpdateLicensePage' });
        modal.onDidDismiss().then((data:any) => {
          if(data != null && data != undefined){
            if(data == '1')
            {
              this.componentService.presentToast( 'License has been updated successfully.','success')
              //  this.events.publish('is_license_activated:changed', '');
               this.goToJobsPage();
            }
          }
        });
        return await modal.present();
    }
    else
    {
      this.goToJobsPage();
    }    
  };

  goToJobsPage()
  {
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '{}');
      var userId = localStorage.getItem('userinfo');
      var isLevelOpened = false;
      if (this.alllevel) {
        this.alllevel.forEach((value:any) => {
            //console.log(value);
            var decrypted = CryptoJS.AES.decrypt(value, userId || '');
            if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                isLevelOpened = true;
            }
        });
      }

      if (!isLevelOpened) {
        this.componentService.presentToast('Please open level first.','info');
      }else{
        this.navCtrl.navigateForward('ManagejobPage',{ state:{
          is_direct : '0'
        }
        });
      }
  }

  openContacts(){
    this.navCtrl.navigateForward('ContactsPage');
  };
  
 async openUpgradePack(){
    if(this.is_recurring_billing == '1'){
      let confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'It will cancel the auto renewable subscriptiion and your package will be remain in working till expiry date.',
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
        this.componentService.showLoader()
            this.APIService.sendData('cancelSubscription',{userId : this.userId,subscriptionId : this.subscriptionId}).subscribe((result:any)=>{
              if(result.status == 1)
              {this.componentService.dismissLoader();
                this.componentService.presentToast('Your subscriptiion has been canceled.','success')
                   this.is_recurring_billing = '0';
                   this.subscriptionId = null;
                  //  this.events.publish('no_recurring:changed', '');
              }
              else
              {
                this.componentService.dismissLoader();
                this.componentService.presentToast('Error, plz try later.','danger');
              }
            },
            (err:any) => {
               this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    await confirm.present();
    }
    else{
      this.navCtrl.navigateForward('PricingPage');
    }
  };

  acceptContact(contact:any){
    var data = {
      memberId : contact.memberId,
      memberstatus : '2',
    };

    this.componentService.showLoader();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });
    // return this.http.put(this.API_ENDPOINT_URL+'accptinvitation', data, options).map(res => res.json()).subscribe(data => {
    //   if(data.error){
    //       let toast = this.toastCtrl.create({
    //           message: data.error,
    //           duration: 3000,
    //           position: 'top',
    //           cssClass: 'danger'
    //       });
    //       toast.present();
    //   }else{
    //       let toast = this.toastCtrl.create({
    //           message: 'Invitation has been accepted successfully.',
    //           duration: 3000,
    //           position: 'top',
    //           cssClass: 'success'
    //       });
    //       toast.present();
    //       // this.events.publish('countChanged:changed', '');
    //       this.countChanged = '1';
    //   }
    //  this.componentService.dismissLoader();
    //   this.friendRequests();
    // },
    //   (err:any) => {
    //     this.componentService.dismissLoader()
    //       this.showTechnicalError('1');
    //   });
  };

  rejectContact(contact:any){
    var data = {
      memberId : contact.memberId,
      memberstatus : 0,
      'action': 'reject'
    };

    this.componentService.showLoader();
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });
    // return this.http.put(this.API_ENDPOINT_URL + 'accptinvitation', data, options).map(res => res.json()).subscribe(response => {
    //   // var newdata = data;
    //   this.friendRequests();
    //   loading.dismissAll();
    //   if(response.error != null){
    //     let toast = this.toastCtrl.create({
    //       message: response.error,
    //       duration: 3000,
    //       position: 'top',
    //       cssClass: 'danger'
    //     });
    //     toast.present();
    //   }else{
    //     let toast = this.toastCtrl.create({
    //       message: 'Invitation has been declined.',
    //       duration: 3000,
    //       position: 'top',
    //       cssClass: 'success'
    //      });
    //     toast.present();
    //   }
    //   this.events.publish('countChanged:changed', '');
    //   this.countChanged = '1';
    // },
    //   err => {
    //       loading.dismissAll();
    //       this.showTechnicalError('1');
    //   });
  };

  friendRequests(){
    // this.userId = localStorage.getItem('userinfo');
    // this.memberServiceProvider.membersList(this.userId).subscribe((data)=>{
    //   this.members = [];
    //   for(var i=0; i < data.length; i++){
    //     if(data[i].memberstatus == 1 && data[i].senderId != this.userId){
    //       this.members.push(data[i]);
    //     }
    //   }
    // });
    this.APIService.getData('friend_requests',this.userId).subscribe((data:any)=>{
      this.members = data;
    },
    (err:any) => {
        this.showTechnicalError();
    });
  }

  openExtraspace(){
   this.navCtrl.navigateForward('ExtraspacePage',{state:{
    page_type : '1'
   }
   });
  };
}
