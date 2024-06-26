import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit {

  messages = [
    { name: 'demo 1', email: '01userdemo&#64;gmail.com', sent: 1 },
    { name: 'demo 2', email: '02userdemo&#64;gmail.com', sent: 1 },
    { name: 'demo 3', email: '03userdemo&#64;gmail.com', sent: 0 },
    { name: 'demo 4', email: '04userdemo&#64;gmail.com', sent: 0 },
    { name: 'demo 5', email: '05userdemo&#64;gmail.com', sent: 1 },
    { name: 'demo 6', email: '06userdemo&#64;gmail.com', sent: 0 },
    { name: 'demo 7', email: '07userdemo&#64;gmail.com', sent: 0 }
  ];

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard', 0]);
  }

}
