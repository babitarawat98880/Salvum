import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';

@Component({
  selector: 'app-assign-company',
  templateUrl: './assign-company.page.html',
  styleUrls: ['./assign-company.page.scss'],
})
export class AssignCompanyPage {
  emailId: any;
  companies: any;
  selected_comps: any = [];
  selected_alerts: any = [];
  userId: any = localStorage.getItem('userinfo');
  constructor(
    public navCtrl: NavController,
    public APIService: APIService,
    public componentService: ComponentService,
    public modalController: ModalController,
    public navParams:NavParams) {
     if(this.navParams.data){
      this.emailId = this.navParams.data['id'];
      this.selected_alerts = this.navParams.data['alertIds'];
      this.selected_comps =this.navParams.data['companyIds'];
      this.getUserComps();
     }

   
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  getUserComps() {
    this.componentService.showLoader();
    this.APIService.getData('userCompaniesList',this.userId).subscribe((companies) => {
      this.companies = companies;
      this.componentService.dismissLoader();
    },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError('1');
      });
  }

  insertContactToArray(event, companyId, type) {
    if (type == 0) {
      if (event.detail.checked== true) {
        this.selected_comps.push(companyId);
      }
      else {
        this.removeArray(this.selected_comps, companyId);
        this.removeArray(this.selected_alerts, companyId);
      }
    }
    else {
      if (event.detail.checked == true) {
        this.selected_alerts.push(companyId);
      }
      else {
        this.removeArray(this.selected_alerts, companyId);
      }
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

  save() {
    if (this.selected_comps.length > 0) {
      this.componentService.showLoader();
      this.APIService.sendData('updateJobNotisEmail',{ '_id': this.emailId, alertIds: this.selected_alerts, companyIds: this.selected_comps }).subscribe((updated:any) => {
        if (updated.status == 1) {
         this.componentService.dismissLoader();
         this.componentService.presentToast('Email preference updated.','success');
          this.dismiss();
        }
        else {
          this.componentService.dismissLoader();
         this.componentService.presentToast('Error, plz try later.','danger');
        }
      },
        err => {
     this.componentService.dismissLoader()
          this.showTechnicalError('1');
        });
    }
    else {
      this.componentService.presentToast('Please select atleast one company to add.','danger');
    }
  }

  showTechnicalError(type:any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg,'info');
  }

}
