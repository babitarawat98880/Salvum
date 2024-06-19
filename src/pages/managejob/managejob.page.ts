import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';

@Component({
  selector: 'app-managejob',
  templateUrl: './managejob.page.html',
  styleUrls: ['./managejob.page.scss'],
})
export class ManagejobPage {
  jobs: any;
  all_jobs: any;
  timestamp: any;
  userId: any = '';
  jobstree: any;
  isAssociate: any;
  file_path: any;
  fixed_div_height: any;
  toId: any;
  companyId: any;
  ses_companyId: any;
  selected_jobs: any = [];
  all_shared_jobs: any = [];
  order: string = '_id';
  reverse: boolean = true;
  filter_by: string = '0';
  filter_by_status: string = '-1';
  isBrowser = localStorage.getItem('isBrowser');
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public componentService: ComponentService,
    public APIService: APIService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.userId = localStorage.getItem('userinfo');
    this.ses_companyId = localStorage.getItem('switched_comp');
    this.isAssociate = history.state.isAssociate;
    if (history.state.is_direct == '0') {
      if (this.isAssociate == '1') {
        this.toId = history.state.toId;
        this.companyId = history.state.companyId;
        this.getAssociateJobs();
      }
      else {
        this.getJobs();
      }
    } else {
      this.componentService.showLoader();
      this.APIService.getData('getUserCurrentSubscription',this.userId).subscribe((subscription:any) => {
        if (subscription.amount == '0' && subscription.is_activated_license == '0') {
          this.componentService.presentToast('Access denied, Please upgrade your subscription or add license.', 'info')
          this.componentService.dismissLoader();
          this.navCtrl.navigateRoot('dashboard');
        }
        else {
          this.componentService.dismissLoader();
          if (this.isAssociate == '1') {
            this.toId = history.state.toId;
            this.companyId = history.state.companyId;
            this.getAssociateJobs();
          }
          else {
            this.getJobs();
          }
        }
      },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError();
        });
    }
    if (localStorage.getItem('job_alert_popup_on_job') == '1') {
      this.showAlert();
    }
  }
async showAlert(){
  let confirm =  await this.alertCtrl.create({
    header: '',
    message: 'Would you like to get job alerts on another secondary email?',
    buttons: [
      {
        text: 'No',
        handler: () => {
          localStorage.removeItem('job_alert_popup_on_job');
        }
      },
      {
        text: 'Yes',
        handler: () => {
          this.navCtrl.navigateForward('profile');
        }
      }
    ]
  });
 await confirm.present();
}
  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info')

  }

  ionViewDidLoad() {
    var fixed_div = document.getElementById("calc_height" + this.timestamp);
    if (fixed_div != null) {
      this.fixed_div_height = fixed_div.offsetHeight;
      var f: any = document.getElementById('custom_height' + this.timestamp)
      f.style.marginTop = this.fixed_div_height + 'px';
    }
  }

  getJobs() {
    this.componentService.dismissLoader();


    // this.companyProvider.getAllJobs(this.userId).subscribe((jobs)=>{
    this.APIService.getData('myJobsList',this.userId+'/'+this.ses_companyId ).subscribe((jobs) => {
      this.componentService.dismissLoader();
      this.jobs = jobs;
      this.all_jobs = jobs;
      this.ionViewDidLoad();
    },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
      });
  }
  getAssociateJobs() {
    this.componentService.dismissLoader();
    this.APIService.getData('associateJobsList', this.toId+'/'+this.companyId ).subscribe((jobs) => {
      this.componentService.dismissLoader();
      this.jobs = jobs;
      this.all_jobs = jobs;
    },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
      });
  }

  // presentModal(myEvent11) {
  //   let modal = this.modalCtrl.create('AddjobPage');
  //   modal.onDidDismiss(data => { 
  //     if(data == '1'){
  //       this.getJobs();
  //     }
  //   });
  //   modal.present({
  //     ev: myEvent11
  //   });
  // }

  addJob() {
    this.navCtrl.navigateForward('add-job');
  }

  openBidjobsPage() {
    this.navCtrl.navigateForward('bidjobs', {
      state: {
        type: '0'
      }
    });
  }

  openManageCompanyPage() {
    this.navCtrl.navigateForward('CompaniesPage');
  }
  getItems(ev: any) {
    this.jobs = this.all_jobs;
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.jobs = this.jobs.filter((item) => {
        return (item.job_title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  async deleteJob(jobId) {
    let confirm = this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'It will delete all trades and other data associated with these jobs.',
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
            this.componentService.dismissLoader();

            this.APIService.sendData('deleteJobs',{ jobId: jobId }).subscribe((deleted:any) => {
              if (deleted.status == 1) {
                this.componentService.dismissLoader();
                this.componentService.presentToast('Jobs Deleted.', 'success')
                this.selected_jobs = [];
                this.getJobs();
              }
              else {
                this.componentService.dismissLoader();
                this.componentService.presentToast('Error, plz try later.', 'danger')
              }
            },
              err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
              });
          }
        }
      ]
    });
    (await confirm).present();
  }

  async openClose(jobId, status) {
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
            this.componentService.dismissLoader();

            this.APIService.sendData('openCloseJobs/'+status,{ jobId: jobId }).subscribe((deleted:any) => {
              if (deleted.status == 1) {
                this.componentService.dismissLoader();
                this.componentService.presentToast('Jobs Updated Successfully.', 'success');
                this.selected_jobs = [];
                this.getJobs();
              }
              else {
                this.componentService.dismissLoader();
                this.componentService.presentToast('Error, plz try later.', 'danger');
              }
            },
              err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
              });
          }
        }
      ]
    });
    (await confirm).present();
  }

  editJob(jobId) {
    this.navCtrl.navigateForward('TradePage', {
      state: {
        job_id: jobId,
        only_view: '1'
      }
    });
  }

  jobCalendar(jobId) {
    this.navCtrl.navigateForward('JobcalendarPage', {
      state: {
        job_id: jobId
      }
    });
  }

  tradeDashboard(jobId, job_title) {
    localStorage.setItem('active_job_breadcrumb', job_title);
    this.navCtrl.navigateForward('TradeDashboardPage', { state: { jobId: jobId } });
  }

  async editJobPage(myEvent11, job_id) {
    let modal = await this.modalCtrl.create({
      component: 'EditjobPage',
      componentProps: {
        job_id: job_id,
        ev: myEvent11
      },
    });
    modal.onDidDismiss().then((data: any) => {
      if (data == '1') {
        this.getJobs();
      }
    });

    (await modal).present();
  }

  root() {
    this.navCtrl.navigateRoot('dashboard');
  };

  insertToArray(event, jobId) {
    if (event.target.checked == true) {
      this.selected_jobs.push(jobId);
    }
    else {
      this.removeArray(this.selected_jobs, jobId);
    }
  }

  removeArray(arr, what) {
    var a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  deleteMultipleJobs() {
    if (this.selected_jobs.length > 0) {
      this.deleteJob(this.selected_jobs);
    }
    else {
      this.componentService.presentToast('Please Select Atleast One Job.', 'info');
    }
  }

  openCloseJobs(status) {
    if (this.selected_jobs.length > 0) {
      this.openClose(this.selected_jobs, status);
    }
    else {
      this.componentService.presentToast('Please Select Atleast One Job.', 'info')

    }
  }

  async shareJobs(jobId, job_number, job_title, companyId) {
    var userName = localStorage.getItem('userName');
    var already: any = [];
    this.all_shared_jobs.forEach(function (share) {
      already.push(share.user_email);
    })
    let modal = await this.modalCtrl.create({
      component: 'ShareJobContactsPage',
      componentProps: {
        already: already,
        companyId: companyId
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if (data != undefined && data != null) {
        if (data.length > 0) {
          this.componentService.dismissLoader();

          var returnedArr: any = [];
          data.forEach(function (contact) {
            var new_obj = {
              fromId: localStorage.getItem('userinfo'),
              jobId: jobId,
              privilege: contact.privilege,
              userId: contact.userId,
              to_email: contact.email,
              to_name: contact.name,
              from_user: userName,
              job_number: job_number,
              job_title: job_title,
              companyId: companyId
            }
            returnedArr.push(new_obj);
          });
          this.APIService.sendData('shareJobs',returnedArr).subscribe((shared:any) => {
            if (shared.status == '1') {
              this.componentService.dismissLoader();
              this.componentService.presentToast('Job shared successfully.', 'success')

              this.getJobs();
            }
            else {
              this.componentService.dismissLoader();
              this.componentService.presentToast('Error, plz try later.', 'danger')

            }
          },
            err => {
              this.componentService.dismissLoader();
              this.showTechnicalError('1');
            });
        }
      }
    });
    await modal.present();
  }

  jobFilter(value, type) {
    if (type == '1') {
      if (value == '0') {
        this.order = '_id';
        this.reverse = true;
      }
      if (value == 'date_asc' || value == 'date_desc') {
        this.order = 'date_created';
        this.reverse = value == 'date_asc' ? false : true;
      }
      if (value == 'po_asc' || value == 'po_desc') {
        this.order = 'job_number';
        this.reverse = value == 'po_asc' ? false : true;
      }
      if (value == 'alpha_asc' || value == 'alpha_desc') {
        this.order = 'job_title';
        this.reverse = value == 'alpha_asc' ? false : true;
      }
    }

    if (type == 'status') {
      if (value == '-1') {
        this.jobs = this.all_jobs;
        this.order = '_id';
        this.reverse = true;
      }
      else {
        if (this.all_jobs != '') {
          var filterd_jobs: any = [];
          this.all_jobs.forEach(function (job) {
            if (job.status == value) {
              filterd_jobs.push(job);
            }
          });
          this.jobs = filterd_jobs;
        }
      }
    }
  }
} 