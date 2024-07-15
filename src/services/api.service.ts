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
get(url:any){
  return this.http.get(apiUrl+url)
}
putData(url:any,data:any){
	return this.http.put(apiUrl+url, data);
 }
postData(url:any,data:any){
	return this.http.post(apiUrl+url+'/', data);
 }
 deleteDirectoryFiles(file_path,fid :any= null,isShared:any = null,userId :any= null,toId:any = null,toLevel:any = null,from_user:any = null,show_add_folder:any = null,clicked_fid:any = null,isRoot :any= null) {
  let data = new URLSearchParams();
   data.append('file_path', file_path);
   data.append('fid', fid);
   data.append('isShared', isShared); 
   data.append('userId', userId);
   data.append('toId', toId);
   data.append('toLevel', toLevel);
   data.append('from_user', from_user);
   data.append('show_add_folder', show_add_folder);
   data.append('clicked_fid', clicked_fid);
   data.append('isRoot', isRoot);
    return this.http.post('deleteDirectoryFiles', data);
  } 
  getTradesList(baseUrl){ 
    var base = baseUrl.replace(':3002','');
   return this.http.get(base+'/userpanel/assets/json/trades_list.json');
  } 
}
