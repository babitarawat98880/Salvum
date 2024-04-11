import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    var API_ENDPOINT_URI = 'https://www.serrare.com:3002';
    localStorage.setItem('API_ENDPOINT_URL',API_ENDPOINT_URI+'/'); 
    localStorage.setItem('APIURL',API_ENDPOINT_URI); 
  }
}
