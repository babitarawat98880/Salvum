import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-passwords',
  templateUrl: './passwords.page.html',
  styleUrls: ['./passwords.page.scss'],
})
export class PasswordsPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard', 0]);
  }
  walletPage() {
    this.navCtrl.navigateRoot(['wallet']);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

}
