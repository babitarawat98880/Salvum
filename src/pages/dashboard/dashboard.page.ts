import { Component, OnInit } from '@angular/core';
import { MenuController } from "@ionic/angular"; 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  APIURL:any;
  API_ENDPOINT_URL:any;
  userImage:any;
  userName:any;
  pages: Array<{title: string, component: any, icon: string, url:string}>;

  constructor(
    private menu: MenuController
  ) { 
    this.APIURL = localStorage.getItem('APIURL');
    this.API_ENDPOINT_URL = localStorage.getItem('API_ENDPOINT_URL');
    this.userImage = localStorage.getItem('userImage');
    this.userName = localStorage.getItem('userName'); 
    this.pages = [
      { title: 'Profile', component: 'ProfilePage', icon: "person-outline", url:'/profile' },
      { title: 'License', component: 'LicensePage', icon: "ribbon", url:'/profile' },
      { title: 'History', component: 'HistoryPage', icon: "time-outline" , url:'/profile'},
      { title: 'Upgrade Package', component: 'PricingPage', icon: "pricetag-outline", url:'/profile' },
    ];
  }

  ngOnInit() {
  }
  close(){
    this.menu.close();
  }
}
