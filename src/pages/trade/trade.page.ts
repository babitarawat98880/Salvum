import { Component } from '@angular/core';
import { NavController, ModalController, AlertController,ToastController,LoadingController } from '@ionic/angular';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
})
export class TradePage  {
  stateData:any='';
  alltrades:any;
  all_trades:any;
  timestamp:any;
  job_id:string;
  jobstree:any;
  file_path:any;
  only_view:any;
  selected_trades:any = [];
  isBrowser = localStorage.getItem('isBrowser');
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
    constructor(public modalCtrl: ModalController ,  
      public navCtrl: NavController, 
      public componentService: ComponentService, 
      public alertCtrl: AlertController, 
      public APIService: APIService,
      public loadingCtrl: LoadingController,
      public router:Router
      ) {
      var current_date = new Date();
      this.timestamp = current_date.getTime();
      this.stateData = this.router.getCurrentNavigation()?.extras.state;
       this.job_id = this.stateData.job_id; 
      this.only_view = this.stateData.only_view;
      if(this.job_id == undefined)
      {
        var localJobId = localStorage.getItem('currentJobId');
        if(localJobId != '' && localJobId != undefined && localJobId != null){
          this.job_id = localJobId;
        }
        else{
          this.navCtrl.navigateForward('managejob', { state: {
            is_direct : '0'
          }});
        }
      } 
    }
  
    ionViewDidEnter(){
      this.getTrades();
    }
  
    ionViewDidLoad(){
      this.caclHeight();
    }
  
    caclHeight(){
      var fixed_div = document.getElementById("calc_height_trades"+this.timestamp);
        if(fixed_div != null){
          var fixed_div_height = fixed_div.offsetHeight;
          var d :any = document.getElementById('fixed_height_trades'+this.timestamp)
          d.style.marginTop = fixed_div_height+'px';
        }
    }
  
    getTrades()
    {
       this.componentService.showLoader();
        this.APIService.getData('trades',this.job_id).subscribe((alltrades)=>{
          this.alltrades = alltrades;
          this.all_trades = alltrades;
          this.componentService.dismissLoader();
        },
        err => {
            this.componentService.dismissLoader();
            this.showTechnicalError();
        });
    }
     async editJobPage(myEvent11,job_id) 
     {
      let modal = await this.modalCtrl.create({ 
        component: 'EditjobPage',
        componentProps: { job_id: this.job_id }
      });
      modal.onDidDismiss().then(data => { 
        this.getTrades();
      });
      await modal.present();
    }
  
    showTechnicalError(type:any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg, 'info');
    }
  
  addTradePage(job_id) {
      this.navCtrl.navigateForward('addtrade',{ state : {
      job_id: job_id
    }});
    }
  async deleteTrade(tradeId) {
      let confirm = this.alertCtrl.create({
        header: 'Are you sure?',
        message: 'It will delete all data related to this trade.',
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
              this.componentService.showLoader();
              this.APIService.sendData('deleteTrades',{tradeId : tradeId}).subscribe((deleted:any)=>{
                if(deleted.status == 1){
                 this.componentService.dismissLoader();
                 this.componentService.presentToast('Trades deleted.','success')
                 this.getTrades();
                }
                else
                {
                   this.componentService.dismissLoader();
                   this.componentService.presentToast('Error, plz try later.','danger');
                }
              },
              err => {
                   this.componentService.dismissLoader();;
                  this.showTechnicalError('1');
              });
            }
          }
        ]
      });
      (await confirm).present();
    } 
    getItems(ev: any) {
        this.alltrades = this.all_trades;
        let val = ev.target.value;
  
        if (val && val.trim() != '') {
          this.alltrades = this.alltrades.filter((item) => {
            return (item.trade_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
    }
    tradeCalendar(tradeId) {
      this.navCtrl.navigateForward('TradecalendarPage',{state: {
      job_id: this.job_id,
      trade_id: tradeId
    }});
    }
    jobCalendar(jobId) {
      this.navCtrl.navigateForward('job-calendar', {state:{
      job_id: jobId,
      from: 'trade'
    }});
    }
  
    insertToArray(event,jobId){
      if(event.target.checked == true)
      {
        this.selected_trades.push(jobId);
      }
      else
      {
        this.removeArray(this.selected_trades, jobId);
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
  
    deleteMultipleTrades()
    {
      if(this.selected_trades.length > 0)
      {
         this.deleteTrade(this.selected_trades);
      }else{
        this.componentService.presentToast('Please Select Atleast One Trade.','danger');
      }
    }
  
    EditTrade(tradeId)
    {
      this.navCtrl.navigateForward('EdittradePage', { state: {tradeId : tradeId, job_id : this.job_id, isEdit : '1'} })
    }
  
    root(){
      this.navCtrl.navigateRoot(['dashboard', 0]);
    };
    
    goToJobs(){
      this.navCtrl.navigateForward('managejob', { state: {
      is_direct : '0'
      }});
    };
  
    backToPage()
    {
      this.navCtrl.navigateBack('trade-dashboard', {state:{
        jobId : this.job_id
      }})
    }
  }
  