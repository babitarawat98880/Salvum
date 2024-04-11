import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const apiUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(
    public http:HttpClient
  ) { }

//   sendData(url:any, postData:any){
//     // let data = new URLSearchParams();
//     // data.append('email', resdata.email);
//     // data.append('password', resdata.password);
//     // data.append('fcm_token', resdata.fcm_token);
//     // const headers = new HttpHeaders();
//     // headers.set('Content-Type', 'application/x-www-form-urlencoded');
//     // console.log(resdata, "data", apiUrl+'loginUsers');
//     // return this.http.post(apiUrl+'loginUsers', resdata, { headers: headers });
//     // var httpOptions = {
//     //   headers: new HttpHeaders({
//     //     "Accept": 'application/json',
//     //     'Content-Type':  'application/json'
//     //     })
//     //   };
//   //   const httpOptions = {
//   //     headers: new HttpHeaders({
//   //         'Access-Control-Allow-Origin': '*',
//   //         'Content-Type': 'application/json; charset=utf-8',
//   //         "Accept": 'application/json',
//   //         'Auth_Token': 'MyCustomHeaderValue'
//   //     })
//   // };
//     var headers = new HttpHeaders();
//     headers.append("Accept", 'application/json');
//     headers.append('Content-Type', 'application/json' );
//     headers.append('Auth_Token','MyCustomHeaderValue');
//     headers.append( 'Access-Control-Allow-Origin', '*');
//     // const requestOptions = new RequestOptions({ headers: headers });

//     // let postData = {
//     //         "email": "Customer004",
//     //         "email": "customer004@email.com",
//     //         "tel": "0000252525"
//     // }
//     this.http.post(apiUrl+'loginUsers', postData,  {headers:headers})
//       .subscribe(data => {
//         console.log(data);
//        }, error => {
//         console.log(error);
//       });
    
//  }


// Your function for making the HTTP request
makeRequest(url:any, postParams:any) {
  return this.http.post(apiUrl+url, postParams);
  
}
sendData(url:any, postParams:any){
  return this.http.post(apiUrl+url, postParams);
}
getData(url:any,data:any){
  return this.http.get(apiUrl+url+'/'+ data)
}
}
