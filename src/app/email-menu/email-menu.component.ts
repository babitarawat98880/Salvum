import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-email-menu',
  templateUrl: './email-menu.component.html',
  styleUrls: ['./email-menu.component.scss'],
})
export class EmailMenuComponent  implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {}

  composePage() {
    this.navCtrl.navigateRoot(['compose']);
  }
  smailPage() {
    this.navCtrl.navigateRoot(['small-inbox']);
  }

}
