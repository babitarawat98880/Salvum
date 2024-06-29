import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, ModalController, AlertController} from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { AddwebsitePage } from '../addwebsite/addwebsite.page';
import { Router } from '@angular/router';
// import { ContactserviceProvider } from '../../providers/contactservice/contactservice';

@Component({
  selector: 'app-sitesdetail',
  templateUrl: './sitesdetail.page.html',
  styleUrls: ['./sitesdetail.page.scss'],
})
export class SitesdetailPage {
  siteDetail: {};
  newSiteArr: Array < {} > ;
  toggoleShowHide: {}
  isBrowser: any;
  itemCompleted: Boolean = false;
  APIURL:any = localStorage.getItem('APIURL');
  stateData:any='';
  constructor(
    public router:Router,
    public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public http: HttpClient, 
    public toastCtrl: ToastController, 
    public APIService: APIService,
    public componentService:ComponentService
  ) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
      this.http = http;
      this.isBrowser = localStorage.getItem('isBrowser');
  }

  ngOnInit() {
      let other :any= [];
      this.toggoleShowHide = true;
      if (this.stateData.data) {
          localStorage.setItem('siteDetail', JSON.stringify(this.stateData.data));
      }
      this.siteDetail = JSON.parse(localStorage.getItem('siteDetail') || '');
      other.push(this.siteDetail);
      this.newSiteArr = other;
  }
  async presentModal3(myEvent3) {
    let myModal = await this.modalCtrl.create({
      component: AddwebsitePage
    });
    myModal.onDidDismiss().then((callback: any) => {
  
    });
    await myModal.present();
     
  }

  showTechnicalError(type :any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');
     
    }

  itemClicked(value) {
      this.toggoleShowHide = !value;
  }

  recipts(siteId){
      this.navCtrl.navigateForward('SiteReciptsPage', {state: {
        siteId : siteId,
        from_detail : '1'
      }})
  }

  async edit(data) {
    let myModal = await this.modalCtrl.create({
      component: 'EditsitePage'
    });
    myModal.onDidDismiss().then((callback: any) => {
  
    });
    await myModal.present();
  };


  async showConfirm(item) {
      let confirm = this.alertCtrl.create({
          message: 'Are you sure you want to delete this ?',
          buttons: [{
                  text: 'No',
                  handler: () => {
                      console.log('Disagree clicked');
                  }
              },
              {
                  text: 'Yes',
                  handler: () => {
                      let headers = new Headers({ 'Content-Type': 'application/json' });
                        return this.http.delete(this.APIURL + "/websiteList/" +item._id)
                          .subscribe(data => {
                            this.componentService.presentToast('Site has been deleted.', 'success');
                            this.navCtrl.navigateBack('sites', item)
                      },
                      err => {
                          this.showTechnicalError('1');
                      });
                  }
              }]
      });
      (await confirm).present();
  };

wallet(){
  this.navCtrl.navigateRoot('wallets');
};

root(){
  this.navCtrl.navigateRoot(['dashboard', "0" ]);
}

site(){
  this.navCtrl.navigateBack('sites');
}
}