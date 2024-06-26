import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.page.html',
  styleUrls: ['./file-manager.page.scss'],
})
export class FileManagerPage implements OnInit {

  messages = [
    { title: 'Level2 Contact Update', time: '6:16 AM 14 May' },
    { title: 'Unconnected User', time: '3:17 AM 14 May' },
    { title: 'Level2 Contact Update', time: '10:36 AM 11 May' },
    // Add more messages as needed
  ];

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard', 0]);
  }

}
