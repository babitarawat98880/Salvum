import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }
  root() {
    this.navCtrl.navigateRoot(['dashboard', 0]);
  }
  sitesPage() {
    this.navCtrl.navigateRoot(['sites']);
  }
  passwordsPage() {
    this.navCtrl.navigateRoot(['passwords']);
  }
  walletsPage() {
    this.navCtrl.navigateRoot(['wallets']);
  }

}
