import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { error } from 'jquery';
const apiUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(
    public http: HttpClient
  ) { }

  // Your function for making the HTTP request
  makeRequest(url: any, postParams: any) {
    return this.http.post(apiUrl + url, postParams);

    // const headers = new HttpHeaders(
    //   {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     Accept: '*/*',
    //   }
    // );
    // const body = new HttpParams({ fromObject: postParams });
    // const options = { headers: headers };
    // return this.http.post(apiUrl + url, body.toString(), options).subscribe(res => {
    //   console.log(res);
    // }, error => {
    //   console.log(error)
    // });

  }
  sendData(url: any, postParams: any) {
    return this.http.post(apiUrl + url, postParams);
  }
  getData(url: any, data: any) {
    return this.http.get(apiUrl + url + '/' + data)
  }
  get(url: any) {
    return this.http.get(apiUrl + url)
  }
  putData(url: any, data: any) {
    return this.http.put(apiUrl + url, data);
  }
  postData(url: any, data: any) {
    return this.http.post(apiUrl + url + '/', data);
  }
  deleteDirectoryFiles(file_path, fid: any = null, isShared: any = null, userId: any = null, toId: any = null, toLevel: any = null, from_user: any = null, show_add_folder: any = null, clicked_fid: any = null, isRoot: any = null) {
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
  // add Transmittals
  addTransmittal(subject, rec_id, tradeId, comments, userId, jobId, submittals, senders, description, sending_items, sender_sign, other_type) {
    let data = new URLSearchParams();
    data.append('subject', subject);
    data.append('rec_id', rec_id);
    data.append('tradeId', tradeId);
    data.append('comments', comments);
    data.append('sender_id', userId);
    data.append('jobId', jobId);
    data.append('description', description);
    data.append('submittals', submittals);
    data.append('sender_sign', sender_sign);
    data.append('other_type', other_type);
    data.append('sending_items', JSON.stringify(sending_items));
    data.append('senders', JSON.stringify(senders));
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(apiUrl + 'addTransmittal', data, { headers: headers });
  }
  getTradesList(baseUrl) {
    var base = baseUrl.replace(':3002', '');
    return this.http.get(base + '/userpanel/assets/json/trades_list.json');
  }
}
