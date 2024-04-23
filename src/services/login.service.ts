import { Injectable } from '@angular/core';
// import { Http, URLSearchParams } from '@angular/http';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const apiUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  API_ENDPOINT_URI = 'https://www.serrare.com:3002';
  constructor(public http: HttpClient) {
  }

  login(email:any,password:any,fcm_token:any){
  	let data = new URLSearchParams();
   	data.append('email', email);
    data.append('password', password);
   	data.append('fcm_token', fcm_token);
     return this.http.post(apiUrl+'loginUsers',data).pipe(map(res => {
      return res;
     }))
    
  
 }

}