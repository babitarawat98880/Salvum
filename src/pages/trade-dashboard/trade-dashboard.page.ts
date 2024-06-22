import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, LoadingController, MenuController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-trade-dashboard',
  templateUrl: './trade-dashboard.page.html',
  styleUrls: ['./trade-dashboard.page.scss'],
})
export class TradeDashboardPage {
  jobId: any = '';
  from_smail: any;
  userId: any;
  is_any_trade_posted: any = '0';
  total_contacts: string = '0';
  total_trades: string = '0';
  total_photos: string = '0';
  total_docs: string = '0';
  total_adendums: string = '0';
  total_bids: string = '0';
  total_downloads: string = '0';
  total_contracts: string = '0';
  total_transmittals: string = '0';
  total_smails: string = '0';
  total_emails: string = '0';
  total_rfis: string = '0';
  stateData: any = '';
  isBrowser = localStorage.getItem('isBrowser');
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public APIService: APIService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public componentService: ComponentService,
    public menuCtrl: MenuController) {
    this.menuCtrl.enable(true);
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    if (this.stateData) {
      this.jobId = this.stateData.jobId;
    }
    // this.jobId = navParams.get('jobId');
    if (this.jobId != undefined) {
      if (this.jobId != localStorage.getItem('currentJobId')) {
        localStorage.removeItem('saved_filter_list');
        localStorage.removeItem('saved_filter_trades');
        localStorage.removeItem('saved_filter_trade_names');
      }
    }
    this.from_smail = this.stateData.from_smail;
    if (this.stateData.job_title != undefined) {
      localStorage.setItem('active_job_breadcrumb', this.stateData.job_title);
      this.active_job_breadcrumb = this.stateData.job_title;
    }
    if (this.stateData.back == '1') {
      this.jobId = localStorage.getItem('currentJobId');
    }
    else {
      if (this.jobId == undefined) {
        var localJobId = localStorage.getItem('currentJobId');
        if (localJobId != '' && localJobId != undefined && localJobId != null) {
          this.jobId = localJobId;
        }
        else {
          this.navCtrl.navigateForward('managejob', {
            state: {
              is_direct: '0'
            }
          });
        }
      }
      else {
        localStorage.setItem('currentJobId', this.jobId);
      }
    }

  }

  ionViewDidEnter() {
    this.userId = localStorage.getItem('userinfo');
    this.loadStats();
  }

  showTechnicalError(type = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  loadStats() {
    this.componentService.showLoader();
    this.APIService.getData('jobDashboard', this.jobId + '/' + this.userId).subscribe((dashboard) => {
      this.componentService.dismissLoader();
      this.is_any_trade_posted = dashboard[0].is_any_trade_posted;
      this.total_contacts = dashboard[0].contacts;
      this.total_trades = dashboard[0].trades;
      this.total_photos = dashboard[0].photos;
      this.total_docs = dashboard[0].docs;
      this.total_adendums = dashboard[0].adendums;
      this.total_bids = dashboard[0].bids;
      this.total_downloads = dashboard[0].downloads;
      this.total_contracts = dashboard[0].contracts;
      this.total_transmittals = dashboard[0].transmittals;
      this.total_smails = dashboard[0].smails;
      this.total_emails = dashboard[0].emails;
      this.total_rfis = dashboard[0].rfis;
    },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
      });
  }

  tradeContacts() {
    this.navCtrl.navigateForward('TradeContactsPage', { state: { jobId: this.jobId } });
  }

  goTotrades() {
    this.navCtrl.navigateForward('trade', { state: { job_id: this.jobId } });
  }

  goToAdendums() {
    this.navCtrl.navigateForward('AdendumPage', { state: { jobId: this.jobId } });
  }

  goToBids() {
    this.navCtrl.navigateForward('ViewbidPage', { state: { jobId: this.jobId } });
  }

  goToDownloads() {
    this.navCtrl.navigateForward('DownloadsPage', { state: { jobId: this.jobId } });
  }

  goToEmails() {
    this.navCtrl.navigateForward('RfiMailsPage', { state: { jobId: this.jobId, emails: '1' } });
  }

  goToSmails() {
    // this.navCtrl.push('SmailInboxPage', {jobId : this.jobId, job_smail : '1'});
    this.navCtrl.navigateForward('RfiMailsPage', { state: { jobId: this.jobId, emails: '0' } });
  }

  goToContracts() {
    this.navCtrl.navigateForward('ContractsPage', { state: { jobId: this.jobId } });
  }

  goToTransmittals() {
    this.navCtrl.navigateForward('TransmittalsPage', { state: { jobId: this.jobId } });
  }

  goToRFIs() {
    this.navCtrl.navigateForward('RfisPage', { state: { jobId: this.jobId } });
  }

  goToFiles(type) {
    this.navCtrl.navigateForward('JobphotosPage', { state: { jobId: this.jobId, file_type: type } });
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard', 0]);
  };

  goToJobs() {
    this.navCtrl.navigateForward('managejob', {
      state: {
        is_direct: '0'
      }
    });
  };

  backToSmail() {
    this.navCtrl.navigateForward('small-inbox', {
      state: {
        from_job: '1',
        jobId: this.jobId
      }
    });
  }

}
