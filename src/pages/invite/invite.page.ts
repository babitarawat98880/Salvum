import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
import { InvitemailPage } from '../invitemail/invitemail.page';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
declare var gapi: any;
declare var WL: any;
declare var window: any;

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage {
  outlookClientID = 'ae10e214-991f-4dd3-8d57-36a995595340';
  outlookClientSecret = 'xsanNW046?%xgxOIPTM39#^';
  outlookRedirectUrl = 'http://localhost:8100/';
  OutlookContactsList: any;
  config: object = {
    'client_id': '1065094829001-t4ugmilrod6huv27l13eqmsevoopmolo.apps.googleusercontent.com',
    'scope': 'https://www.google.com/m8/feeds'
  };
  isBrowser: any;
  formattedSignature: any;
  baseUrl: any = localStorage.getItem('APIURL');
  constructor(
    public componentService: ComponentService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    public APIService: APIService) {
    this.http = http;
  }

  ngOnInit() {
    this.isBrowser = localStorage.getItem('isBrowser');
    var url = window.location.href;
    if (url.search('verified') >= 0) {
      this.yahooLogin();
    }
    if (url.search('confirmed') >= 0) {
      this.gmailLogin();
    }
    if (url.search('accepted') >= 0) {
      this.hotmailLogin('1');
    }
  }

  outlookLogin() {
    this.platform.ready().then(() => {
      this.outLookLogin().then(code => {
        console.log('back...')
        const credentials = `client_id=${this.outlookClientID}
        &client_secret=${this.outlookClientSecret}&redirect_uri=${this.outlookRedirectUrl}
        &grant_type=authorization_code
        &code=${code}`;

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', credentials)
          .subscribe((data: any) => {
            console.log('enter..')
            console.log(data)
            this.callFinalApi(data.access_token);
          }, (error) => {
            console.log(error);
          });
      });
    });
  }

  outLookLogin(): Promise<any> {
    return new Promise((resolve, reject) => {

      const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?state=Eav6wrDocSdnkKHfvdzBs9XmtE2SitGd&scope=profile+openid+email+offline_access+User.Read+Mail.Send+Contacts.ReadWrite.Shared&response_type=code&approval_prompt=auto&client_id=${this.outlookClientID}&redirect_uri=${this.outlookRedirectUrl}`;

      // var browserRef = window.open(url, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
      var browserRef = window.cordova.InAppBrowser.open(url, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

      browserRef.addEventListener("loadstart", (event) => {
        console.log('event')
        console.log(event)
        if ((event.url).indexOf(this.outlookRedirectUrl) === 0) {
          console.log('hello1')
          browserRef.removeEventListener("exit", (event) => { });
          browserRef.close();
          let code = this.getParameterByName('code', event.url);
          if (code) {
            console.log('code')
            console.log(code)
            resolve(code);
          } else {
            console.log('reject')
            reject("Problem authenticating with outlook");
          }
        }
      });
      browserRef.addEventListener("exit", function (event) {
        reject("The Outlook sign in flow was canceled");
      });
    });
  }

  callFinalApi(access_token) {
    console.log('final entry...')
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', `Bearer $` + access_token);
    this.http.get('https://graph.microsoft.com/beta/me/people/?$skip=0&$top=1000')
      .subscribe((rows: any) => {

        this.OutlookContactsList = rows;
        console.log('rows')
        console.log(rows)
      }, error => {
        console.log(error);
      })

  }

  // to get query string form the auth url of outlook
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


  inviteContacts() {
    gapi.auth.authorize(this.config).then((data) => {
      this.contact(data.access_token);
    })
  }

  contact(token) {
    this.componentService.showLoader();
    return this.http.get('http://www.google.com/m8/feeds/contacts/default/full?access_token=' + token + "&alt=json")
      .subscribe(async (data: any) => {
        this.componentService.dismissLoader();
        let myModal = await this.modalCtrl.create({
          component: 'ImportmailPage',
          componentProps: {
            data: data.feed.entry
          }
        });
        myModal.onDidDismiss().then((data: any) => {
        });
        await myModal.present();
      },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError();
        });
  }

  showTechnicalError(type :any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  hotmail() {

    WL.init({
      client_id: '00000000442014C0',
      redirect_uri: 'http://localhost:8100',
      scope: ["wl.contacts_emails"],
      response_type: "token"
    });

    WL.login({
      scope: ["wl.contacts_emails"]
    }).then(function (response) {
      console.log(response)
      WL.api({
        path: "me/contacts",
        method: "GET",
      }).then(
        function (response) {
          //your response data with contacts 
          console.log(response.data);
        },
        function (responseFailed) {
          console.log(responseFailed);
        }
      );

    },
      function (responseFailed) {
        console.log("Error signing in: " + responseFailed.error_description);
      });
  }


  async inviteSpecificCons() {
    let myModal = await this.modalCtrl.create({
      component: InvitemailPage
    });
    myModal.onDidDismiss().then((data: any) => {
    });
    await myModal.present();
  }



  root() {
    this.navCtrl.navigateRoot(['dashboard', "0"]);
  };

  members() {
    this.navCtrl.navigateForward('members');
  };

  yahooLogin() {
    this.componentService.showLoader();
    return this.http.get(this.baseUrl.replace(':3002','') + '/yaho')
      .subscribe(async data => {
        this.componentService.dismissLoader();
        if (data[0] != 1) {
          let myModal = await this.modalCtrl.create({
            component: 'ImportmailPage',
            componentProps: {
            yahoo_contacts: data,
            type: 'yahoo'
            }
          });
          myModal.onDidDismiss().then((data: any) => {
          });
          await myModal.present();
        }
        else {
          window.location.href = data[1];
        }
      },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError('1');
        });
  }

  gmailLogin() {
    this.componentService.showLoader();
    return this.http.get(this.baseUrl.replace(':3002','') + '/gmail?get_contacts=all')
      .subscribe(async data => {
        this.componentService.dismissLoader();
        if (data[0] != 1) {
          let myModal = await this.modalCtrl.create({
            component: 'ImportmailPage',
            componentProps: {
            gmail_contacts: data,
            type: 'gmail'
            }
          });
          myModal.onDidDismiss().then((data: any) => {
          });
          await myModal.present();
        }
        else {
          window.location.href = data[1];
        }
      },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError('1');
        });
  }

  hotmailLogin(code = '0') {
   this.componentService.showLoader();
    return this.http.get(this.baseUrl.replace(':3002','') + '/hotmail?code=' + code)
      .subscribe(async data => {
        this.componentService.dismissLoader();
        if (data[0] != 1) {
          console.log('enter')
          let myModal = await this.modalCtrl.create({
            component: 'ImportmailPage',
            componentProps: {
            hotmail_contacts: data,
            type: 'hotmail'
            }
          });
          myModal.onDidDismiss().then((data: any) => {
          });
          await myModal.present();
        }
        else {
          window.location.href = data[1];
        }

      },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError('1');
        });
  }
}
