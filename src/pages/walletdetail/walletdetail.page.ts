import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-walletdetail',
  templateUrl: './walletdetail.page.html',
  styleUrls: ['./walletdetail.page.scss'],
})
export class WalletdetailPage {
  addr: {};
  new: Array<{}>;
  items: Array<{}>;
  toggoleShowHide: {};
  isBrowser: any;
  stateData:any='';
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public APIService: APIService,
    public componentService: ComponentService,
    public router:Router) {
    this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.stateData, "state")
  }
  ngOnInit() {
    let other :any= [];
    this.items = [];
    this.toggoleShowHide = true;
    if (this.stateData  != '') {
      localStorage.setItem('walletDetail', JSON.stringify(this.stateData ));
    }
    this.addr = JSON.parse(localStorage.getItem('walletDetail') || '');
    other.push(this.addr);
    this.new = other;
  }

  itemClicked(value) {
    this.toggoleShowHide = !value;
    return true
  }

  showTechnicalError(type :any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg,'info');
    }


  async showConfirm(item, index) {
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
            let body = item;
            return this.APIService.sendData('deletewallet',body)
              .subscribe(data => {
                let webdel = data;
                this.componentService.presentToast( 'Wallet has been deleted successfully.','success')
                this.navCtrl.navigateBack('wallets', webdel);
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

  root() {
    this.navCtrl.navigateRoot(['dashboard',0]);
  };

  wallet() {
    this.navCtrl.navigateBack('wallet');
  };

  wallets() {
    this.navCtrl.navigateBack('wallets');
  };
}