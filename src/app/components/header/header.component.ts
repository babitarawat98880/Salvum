import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {}

  root() {
    this.navCtrl.navigateRoot(['dashboard', 0]);
  }
  smailPage() {
    this.navCtrl.navigateRoot(['small-inbox']);
  }
  contactsPage() {
    this.navCtrl.navigateRoot(['contacts']);
  }
  fileManagerPage() {
    this.navCtrl.navigateRoot(['file-manager']);
  }
  bidJobsPage() {
    this.navCtrl.navigateRoot(['bidjobs']);
  }
  membersPage() {
    this.navCtrl.navigateRoot(['members']);
  }
  invitePage() {
    this.navCtrl.navigateRoot(['invite']);
  }
  walletPage() {
    this.navCtrl.navigateRoot(['wallet']);
  }

}
