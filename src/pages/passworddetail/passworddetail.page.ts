import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
import { AddpasswordPage } from '../addpassword/addpassword.page';
import { EditpassPage } from '../editpass/editpass.page';
import { Router } from '@angular/router';
@Component({
  selector: 'app-passworddetail',
  templateUrl: './passworddetail.page.html',
  styleUrls: ['./passworddetail.page.scss'],
})
export class PassworddetailPage {
  stateData: any = '';
  address: {};
  newarr: Array<{}>;
  toggoleShowHide: {};
  isBrowser: any;
  API_ENDPOINT_URL: any = localStorage.getItem('API_ENDPOINT_URL');
  deletepassUrl = 'deletepassword';
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public http: HttpClient,
    public componentService: ComponentService,
    public APIService: APIService,
    public router: Router) {
    this.isBrowser = localStorage.getItem('isBrowser');
  };

  ngOnInit() {
    let other: any = [];
    this.toggoleShowHide = true;
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.stateData)
    if (this.stateData._id) {
      localStorage.setItem('pwdDetail', JSON.stringify(this.stateData));
    }
    this.address = JSON.parse(localStorage.getItem('pwdDetail') || '');
    //this.address  = this.navParams.data;
    other.push(this.address);
    this.newarr = other;
  };

  itemClicked(value) {
    this.toggoleShowHide = !value;
  };

  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  async presentModal2(myEvent1) {
    let myModal = await this.modalCtrl.create({
      component: AddpasswordPage
    });
    myModal.onDidDismiss().then((data: any) => {

    });
    await myModal.present();
  };

  async edit(data) {

    let myModal = await this.modalCtrl.create({
      component: EditpassPage
    });
    myModal.onDidDismiss().then((callback: any) => {

    });
    await myModal.present();
  };
  async showConfirm(item) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            let body = JSON.stringify(item);
            let headers = new Headers({ 'Content-Type': 'application/json' });
            return this.http.post(this.API_ENDPOINT_URL + this.deletepassUrl, body)
              .subscribe(data => {
                let passData = data;
                this.componentService.presentToast('Password was deleted successfully', 'success');
                this.navCtrl.navigateBack('passwords', passData)
              },
                err => {
                  this.showTechnicalError('1');
                });
          }
        }
      ]
    });
    (await confirm).present();
  };

  password() {
    this.navCtrl.navigateBack('passwords');
  };

  wallets() {
    this.navCtrl.navigateBack('wallet');
  };
  root() {
    this.navCtrl.navigateRoot(['dashboard', 0])
  }
}