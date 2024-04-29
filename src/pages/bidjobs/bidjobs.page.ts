import { Component, OnInit } from '@angular/core';
import { NavController , AlertController,ToastController,LoadingController } from '@ionic/angular';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';
@Component({
  selector: 'app-bidjobs',
  templateUrl: './bidjobs.page.html',
  styleUrls: ['./bidjobs.page.scss'],
})
export class BidjobsPage  {
  all_invitations : any;
  all_awarded : any;
  this_all_invitations : any;
  this_all_awarded : any;
  pageType : any;
  userId : any;
  timestamp:any;
  isBrowser:any;                                                                                            
  pre_search:any;
  post_search:any;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public componentService:ComponentService,
    public APIService:APIService) {
    this.isBrowser = localStorage.getItem('isBrowser');
    this.userId = localStorage.getItem('userinfo');
    var type = history.state.type;
    // var type = navParams.get('type');
    if(type == '1'){
      if(this.userId != undefined && this.userId != null && this.userId != ''){
        this.emailAlert();
      }
      else{
        localStorage.setItem('redirect_after','bidjobs');                                                     
        localStorage.setItem('redirect_id','1');
        this.componentService.presentToast('Please login to access this page.','info');
      }
      this.pageType = '2';
    }
    else{
      this.pageType = '1';
    }
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.getMyBids();
  }
  
  getMyBids(){
    this.componentService.showLoader();
    this.APIService.getData('bidJobsList',this.userId).subscribe((alljobs:any)=>{ 
     this.componentService.dismissLoader();
      if(alljobs.length > 0){
        var Invitations:any = [];
        var Awarded:any = [];
        alljobs.forEach(function(data){
          if(data.isPosted == '1')
          {
            if(data.isAwarded == '1')
            {
              Awarded.push(data);
            }
            else
            {
              Invitations.push(data);
            }
          }
        });
        this.this_all_invitations = Invitations;
        this.all_invitations = Invitations;
        this.this_all_awarded = Awarded;
        this.all_awarded = Awarded;
        console.log(this.all_invitations)
      }
      else
      {
        this.all_invitations = [];
        this.this_all_invitations = [];
        this.all_awarded = [];
        this.this_all_awarded = [];
      }
    },
    err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
    });
  }
  
  async emailAlert(){
    let confirm = await this.alertCtrl.create({
        header: '',
        message: 'Would you like to get job alerts on another secondary email?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              // no clicked
            }
          },
          {
            text: 'Yes',
            handler: () => {
              localStorage.setItem('job_alert_popup','1');
              this.navCtrl.navigateForward('profile');
            }
          }
        ]
      });
     await confirm.present();
  }
  
  async deleteBids(id){
    let confirm = await this.alertCtrl.create({
      header: '',
      message: 'Are you sure you want to remove this bid?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            // no clicked
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.componentService.showLoader();
            this.APIService.sendData('removeBids',{id:id}).subscribe((result:any)=>{ 
              this.componentService.dismissLoader();
              if(result.status == 1){
                this.componentService.presentToast('Bid removed successfully.','success')
                 this.getMyBids();
              }
              else{
                this.componentService.presentToast('Error,Plz try later.','danger')
              }
            },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError();
            });
          }
        }
      ]
    });
    await confirm.present();
  }
  
  showTechnicalError(type = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info')
    
    }
  
  ionViewDidLoad(){ 
      this.caclHeight();
    }
  
    caclHeight(){
      var fixed_div = document.getElementById("calc_height_bidjobs"+this.timestamp);
        if(fixed_div != null){
          var fixed_div_height = fixed_div.offsetHeight;
          var fixedHeight:any = document.getElementById('fixed_height_bidjobs'+this.timestamp );
          fixedHeight.style.marginTop  = fixed_div_height+'px';
        }
    }
  
  getInvitations()
  {
    this.pageType = '1';
  }
  
  getAwared()
  {
    this.pageType = '2';
  }
  
  openBiddetailPage(bidJobId,bid_status)
  {
  this.navCtrl.navigateForward('bidding', { state: {
  bidJobId: bidJobId,
  status: bid_status,
  }
  });
  }
  searchInvitations(ev: any) {
        this.all_invitations=this.this_all_invitations
        let val = this.pre_search;
  
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.all_invitations = this.all_invitations.filter((item) => {
            return (item.job_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
  
    }
  
  searchAwarded(ev: any) {
        this.all_awarded=this.this_all_awarded;
        let val = this.post_search;
  
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.all_awarded = this.all_awarded.filter((item) => {
            return (item.job_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
  
    }
    root(){
      this.navCtrl.navigateRoot('dashboard');
    };
    
   }
  
