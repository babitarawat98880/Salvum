import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
// import { SignaturePad } from 'angular2-signaturepad/angular2-signaturepad';
// import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Router } from '@angular/router';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { UploadfilePage } from '../uploadfile/uploadfile.page';
import { FilemanagerfilesPage } from '../filemanagerfiles/filemanagerfiles.page';
@Component({
  selector: 'app-addtransmittal',
  templateUrl: './addtransmittal.page.html',
  styleUrls: ['./addtransmittal.page.scss'],
})
export class AddtransmittalPage {
  item:any='';
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public uploader: FileUploader;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  uploaderOptions: any;
  tabs: string = "basicdetail";
  filterTradeId: any;
  alltrades: any;
  jobId: any;
  other_type: any = '';
  submittal_type: any = '';
  sub_other_type: any;
  userId: any;
  all_submittals: any = [];
  all_contracts: any;
  all_contracts_list: any;
  all_RFIs: any;
  sub_sign: any = '';
  tradeId: any = '';
  show_duplicate: any = '0';
  senders: any = {};
  indexed_conts: any;
  rec_id: any = '';
  isBrowser: any;
  sending_items: any = [];
  issue_date: any;
  current_date: any;
  due_date: any;
  quantity: any;
  indexed_rfis: any;
  action_items: any = [];
  send_from: any = localStorage.getItem('userName');
  curr_comp_name: any = localStorage.getItem('curr_comp_name');
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  errors: any = ['', null, undefined];
  sender_sign: any = '';
  all_selected_trades: any = [];
  state: any = 'new';
  sub_comments: any = '';
  all_action_items: any;
  stateData:any='';
  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 500,
    'canvasHeight': 100,
    'backgroundColor': '#fff'
  };
  constructor(
    public navCtrl: NavController,
    public router: Router,
    public APIService: APIService,
    public componentService: ComponentService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
  public http:HttpClient) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    this.isBrowser = localStorage.getItem('isBrowser');
    this.filterTradeId = localStorage.getItem('filterTradeId');
    if (this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == '') {
      this.filterTradeId = '0';
    }

    this.all_action_items = ['For approval', 'For your use', 'As requested', 'Approved as submitted', 'Approved as noted', 'Return for corrections', 'Resubmit copies for approval', 'submit [#] copies for distribution', 'return [#] corrected prints', 'for review and comment', 'revise and resubmit/work may not proceed', 'for bids due', 'prints returned after loan'];

    var current_date = new Date();
    this.current_date = current_date.getFullYear() + "-" + ("0" + (current_date.getMonth() + 1)).slice(-2) + "-" + ("0" + current_date.getDate()).slice(-2);
    this.issue_date = this.current_date;

    this.userId = localStorage.getItem('userinfo');
    this.jobId = this.stateData['jobId'];
    if (this.jobId == undefined) {
      var localJobId = localStorage.getItem('currentJobId');
      if (localJobId != '' && localJobId != undefined && localJobId != null) {
        this.jobId = localJobId;
      }
      else {
        this.navCtrl.navigateBack('transmittals', { state:{'jobID': this.jobId}});
      }

    }
    this.APIService.getData('trades',this.jobId).subscribe((alltrades) => {
      this.alltrades = alltrades;
    },
      err => {
        this.showTechnicalError();
      });
    this.APIService.getData('getContracts',this.jobId).subscribe((contracts:any) => {
      this.all_contracts_list = contracts;
      console.log(this.all_contracts_list,"this.all_contracts_list")
      this.getContractsTradeWise();
      if (contracts != '') {
        var contractss: any = [];
        contracts.forEach(function (cont) {
          contractss[cont._id] = cont;
        });
        this.indexed_conts = contractss;
      }
    },
      err => {
        this.showTechnicalError();
      });
    this.APIService.getData('getRFIs',this.jobId).subscribe((RFIs:any) => {
      this.all_RFIs = RFIs;
      if (RFIs != '') {
        var rfis: any = [];
        RFIs.forEach(function (rfi) {
          rfis[rfi._id] = rfi;
        });
        this.indexed_rfis = rfis;
      }
    },
      err => {
        this.showTechnicalError();
      });
  }

  insertContactToArray(evn, item) {
    var event = evn.target;
    if (event.checked == true) {
      this.action_items.push(item);
    }
    else {
      this.removeArray(this.action_items, item);
    }
    console.log(this.action_items)
  }

  removeArray(arr, what) {
    var a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  tabschanged() {
    if (this.tabs == 'submittals_tab' && this.sender_sign != '') {
      this.show_duplicate = '1';
    }
  }

  ngAfterViewInit() {
    // this.signaturePad.set('minWidth', 1);
    // this.signaturePad.clear();
  }

  drawComplete() {
    this.show_duplicate = '0';
    // this.sender_sign = this.signaturePad.toDataURL();
  }

  clearSign() {
    // this.signaturePad.clear();
    this.sender_sign = '';
  }

  drawCompleteS() {
    // this.sub_sign = this.signaturePad.toDataURL();
  }

  clearSignS() {
    // this.signaturePad.clear();
    this.sub_sign = '';
  }

  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info')
  }

  addSubmittalReq(submittal_type) {
    if (submittal_type == 'request') {
      var new_item = {
        type: 'request',
        item: '',
        code: Math.floor(Math.random() * 100000),
        issue_date: this.issue_date,
        due_date: this.due_date,
        quantity: this.quantity,
        sub_by: this.send_from,
        tradeId: this.tradeId,
        state: this.state,
        sub_comments: this.sub_comments,
        sign: this.sub_sign,
        action_items: this.action_items
      };
      this.all_submittals.splice(0, 0, new_item);
      this.submittal_type = '';
      this.issue_date = this.current_date;
      this.due_date = '';
      this.quantity = '';
      this.tradeId = '';
      this.state = 'new';
      this.sub_comments = '';
      this.sub_sign = '';
      this.action_items = [];
    }
  }

  addTransmittal(subject, rec_id, tradeId = '0', comments, description, sending_items, type = null) {
    if (type == 'submittal') {
      this.tabs = 'submittals_tab';
    }
    else {
      if (subject == '' || subject == undefined) {
        this.componentService.presentToast('Please enter valid subject.', 'danger');
        this.tabs = 'basicdetail';
        return false;
      }
      if (rec_id == '' || rec_id == undefined) {
        this.componentService.presentToast('Please select valid receiver.', 'danger');

        this.tabs = 'basicdetail';
        return false;
      }

      if (description == '' || description == undefined) {
        this.componentService.presentToast('Please enter description.', 'danger');

        this.tabs = 'basicdetail';
        return false;
      }

      if (comments == '' || comments == undefined) {
        this.componentService.presentToast('Please enter comments.', 'danger');
        this.tabs = 'basicdetail';
        return false;
      }

      var self = this;
      if (this.all_submittals.length > 0) {
        this.all_submittals.forEach(function (sub) {
          if (self.all_selected_trades.indexOf(sub.tradeId) == -1 && self.errors.indexOf(sub.tradeId) == -1) {
            self.all_selected_trades.push(sub.tradeId);
          }
        });
      }

      var submittals = JSON.stringify(this.all_submittals);
      var all_selected_trades = JSON.stringify(this.all_selected_trades);
      this.componentService.showLoader();
      var data = {
        'subject': subject,
        'rec_id':rec_id,
        'tradeId': tradeId,
        'comments': comments,
        'sender_id':this.userId,
        'jobId':this.jobId,
        'description':description,
        'submittals':submittals,
        'sender_sign':this.sender_sign,
        'other_type':this.other_type,
        'sending_items':sending_items,
        'senders': this.senders
      }
      this.http.post(this.API_ENDPOINT_URL+'addTransmittal', data).subscribe((formdata:any) => {
      // this.APIService.sendData('addTransmittal', data).subscribe((formdata:any) => {
        this.componentService.dismissLoader();
        if (formdata.status == '1') {

          this.componentService.presentToast('Transmittal added successfully.', 'success');
          this.backPage();
        }
        else {

          this.componentService.presentToast('Error, plz try later.', 'danger');

        }
      },
        err => {
          this.componentService.dismissLoader()
          this.showTechnicalError('1');
        });
    }
  }

  sendToSelected() {
    var self = this;
    if (this.all_contracts.length > 0) {
      this.all_contracts.forEach(function (cont) {
        if (cont.inviteId == self.rec_id) {
          self.senders = cont;
        }
      });
    }
    console.log(this.senders)
  }

  getContractsTradeWise(tradeId = null) {
    var all_sentTo :any = [];
    var all_emails :any = [];
    var contracts :any = [];
    var self = this;
    this.APIService.getData('tradeContacts',this.jobId).subscribe((j_contacts:any) => {
      this.APIService.getData('jobCoworkers',this.jobId).subscribe((coworkers:any) => {
        if (j_contacts.length > 0) {
          all_sentTo = all_sentTo.concat(j_contacts);
        }
        if (coworkers.length > 0) {
          all_sentTo = all_sentTo.concat(coworkers);
        }
        if (this.all_contracts_list.length > 0) {
          all_sentTo = all_sentTo.concat(this.all_contracts_list);
        }
        if (all_sentTo.length > 0) {
          all_sentTo.forEach(function (cont) {
            if (cont.inviteId == 0) {
              if (all_emails.indexOf(cont.invite_email) == -1) {
                all_emails.push(cont.invite_email);
                contracts.push({
                  user_email: cont.invite_email,
                  user_name: cont.invite_name,
                  inviteId: contracts.length + 1
                });
              }
            }
            else {
              if (self.errors.indexOf(cont.user_email) == -1) {
                if (all_emails.indexOf(cont.user_email) == -1) {
                  all_emails.push(cont.user_email);
                  contracts.push({
                    user_email: cont.user_email,
                    user_name: cont.invite_name,
                    inviteId: cont.inviteId
                  });
                }
              }
              else {
                if (all_emails.indexOf(cont.invite_email) == -1) {
                  all_emails.push(cont.invite_email);
                  contracts.push({
                    user_email: cont.invite_email,
                    user_name: cont.invite_name,
                    inviteId: cont.inviteId
                  });
                }
              }
            }
          });
          this.all_contracts = contracts;
          console.log(contracts)
        }
      });
    });

  }

  addSubmittal(submittal_type, item) {
    console.log(item, "+++++",this.item);
    if (submittal_type == '' || submittal_type == undefined) {
      this.componentService.presentToast('Please select submittal type.', 'danger');
      return false;
    }
    if (item == '' || item == undefined || item == null) {

      this.componentService.presentToast('Please select submittal item.', 'danger');
      return false;
    }

    if (submittal_type == 'rfi') {
      if (item.length > 0) {
        var counter = 0;
        var self = this;
        item.forEach(function (single) {
          var new_item = {
            type: submittal_type,
            item: single,
            code: Math.floor(Math.random() * 100000),
            issue_date: self.issue_date,
            due_date: self.due_date,
            quantity: self.quantity,
            sub_by: self.send_from,
            tradeId: self.tradeId,
            state: self.state,
            sign: self.sub_sign,
            sub_comments: self.sub_comments,
            action_items: self.action_items
          };
          self.all_submittals.splice(0, 0, new_item);
          if (self.sending_items.indexOf('rfi') == -1) {
            self.sending_items.push('rfi');
          }
          counter = counter + 1;
          if (counter == item.length) {
            self.submittal_type = '';
            self.item = '';
            self.issue_date = self.current_date;
            self.due_date = '';
            self.quantity = '';
            self.tradeId = '';
            self.state = 'new';
            self.sub_comments = '';
            self.sub_sign = '';
            self.action_items = [];
            self.componentService.presentToast('Submittal added.', 'success')
          }
        })
      }
    }
    else {
      var new_item = {
        type: submittal_type,
        item: item,
        code: Math.floor(Math.random() * 100000),
        issue_date: this.issue_date,
        due_date: this.due_date,
        quantity: this.quantity,
        tradeId: this.tradeId,
        sub_by: this.send_from,
        state: this.state,
        sign: this.sub_sign,
        sub_comments: this.sub_comments,
        action_items: this.action_items
      };
      console.log(item)
      if (!this.all_submittals.includes(new_item)) {
        this.all_submittals.splice(0, 0, new_item);
        if (submittal_type == 'contract') {
          if (this.sending_items.indexOf('contract') == -1) {
            this.sending_items.push('contract');
          }
        }

        this.submittal_type = '';
        this.item = '';
        this.issue_date = this.current_date;
        this.due_date = '';
        this.quantity = '';
        this.tradeId = '';
        this.state = 'new';
        this.sub_sign = '';
        this.sub_comments = '';
        this.action_items = [];
        this.componentService.presentToast('Submittal added.', 'success');

      }
      else {
        this.componentService.presentToast('Submittal already added.', 'danger');
      }
    }

  }

  async removeSubmittal(index) {
    let confirm = this.alertCtrl.create({
      header: 'Are you sure?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.all_submittals.splice(index, 1);
          }
        }
      ]
    });
    (await confirm).present();
  }

  async filemanagerFiles() {
    let modal = await this.modalCtrl.create({
      component: FilemanagerfilesPage,
      componentProps: { transmittal_file: '1' }
    });
    modal.onDidDismiss().then(res => {
      var data = res.data;
      if (data != undefined && data != '' && data != null) {
        var self = this;
        if (data.length > 0) {
          data.forEach(function (file) {
            var new_item = {
              type: self.submittal_type == 'other' ? (self.errors.indexOf(self.sub_other_type) == -1 ? self.sub_other_type : 'other') : self.submittal_type,
              item: file.path,
              code: Math.floor(Math.random() * 100000),
              sub_by: self.send_from,
              issue_date: self.issue_date,
              due_date: self.due_date,
              quantity: self.quantity,
              tradeId: self.tradeId,
              state: self.state,
              sign: self.sub_sign,
              sub_comments: self.sub_comments,
              action_items: self.action_items
            };
            self.all_submittals.splice(0, 0, new_item);
            if (self.sending_items.indexOf(new_item['type']) == -1) {
              self.sending_items.push(new_item['type']);
            }
          });
          this.submittal_type = '';
          this.item = '';
          this.sub_other_type = '';
          this.issue_date = this.current_date;
          this.due_date = '';
          this.quantity = '';
          this.tradeId = '';
          this.state = 'new';
          this.sub_sign = '';
          this.sub_comments = '';
          this.action_items = [];
        }
      }
    });
    (await modal).present();
  }

  async uploadFiles() {
    let modal = await this.modalCtrl.create({
      component: UploadfilePage,
      componentProps: { transmittal_file: '1' }
    }
    );
    modal.onDidDismiss().then(res => {
      var data = res.data
      if (data != undefined && data != '' && data != null) {
        var self = this;
        if (data.length > 0) {
          data.forEach(function (file) {
            var new_item = {
              type: self.submittal_type == 'other' ? (self.errors.indexOf(self.sub_other_type) == -1 ? self.sub_other_type : 'other') : self.submittal_type,
              item: 'directory/transmittal_files/' + file.file,
              code: Math.floor(Math.random() * 100000),
              date_created: file.date,
              sub_by: self.send_from,
              issue_date: self.issue_date,
              due_date: self.due_date,
              quantity: self.quantity,
              tradeId: self.tradeId,
              state: self.state,
              sign: self.sub_sign,
              sub_comments: self.sub_comments,
              action_items: self.action_items
            };
            self.all_submittals.splice(0, 0, new_item);
            if (self.sending_items.indexOf(new_item['type']) == -1) {
              self.sending_items.push(new_item['type']);
            }
          });
          this.submittal_type = '';
          this.item = '';
          this.sub_other_type = '';
          this.issue_date = this.current_date;
          this.due_date = '';
          this.quantity = '';
          this.tradeId = '';
          this.state = 'new';
          this.sub_sign = '';
          this.sub_comments = '';
          this.action_items = [];
        }
      }
    });
    (await modal).present();
  }

  async jobFiles() {
    let modal = await this.modalCtrl.create({
      component: 'JobfilesPage',
      componentProps: { jobId: this.jobId }
    });
    modal.onDidDismiss().then(res => {
      var data = res.data;
      if (data != undefined && data != '' && data != null) {
        console.log(data)
        var self = this;
        var file_item;
        if (data.length > 0) {
          data.forEach(function (file) {
            if (data.path == undefined) {
              file_item = 'directory/jobs_data/' + file.file_name;
            }
            else {
              file_item = file.path;
            }
            var new_item = {
              type: self.submittal_type == 'other' ? (self.errors.indexOf(self.sub_other_type) == -1 ? self.sub_other_type : 'other') : self.submittal_type,
              item: file_item,
              code: Math.floor(Math.random() * 100000),
              date_created: file.date_created,
              sub_by: self.send_from,
              issue_date: self.issue_date,
              due_date: self.due_date,
              quantity: self.quantity,
              tradeId: self.tradeId,
              state: self.state,
              sign: self.sub_sign,
              sub_comments: self.sub_comments,
              action_items: self.action_items
            };
            self.all_submittals.splice(0, 0, new_item);
            if (self.sending_items.indexOf(new_item['type']) == -1) {
              self.sending_items.push(new_item['type']);
            }
          });
          this.submittal_type = '';
          this.item = '';
          this.tradeId = '';
          this.sub_other_type = '';
          this.issue_date = this.current_date;
          this.due_date = '';
          this.quantity = '';
          this.state = 'new';
          this.sub_comments = '';
          this.sub_sign = '';
          this.action_items = [];
        }
      }
    });
    (await modal).present();
  }

  async seeAcItems(act_items) {
    let modal = this.modalCtrl.create({
      component: 'ActionItemsPage',
      componentProps: { action_items: act_items }
    }
    );
    (await modal).present();
  }

  uploadNow() {
    this.uploader.uploadAll();
  }

  backPage() {
    this.navCtrl.navigateBack('transmittals', { state:{'jobID': this.jobId}});
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard', "0"]);
  };

  goToJobs() {
    this.navCtrl.navigateBack('managejob', {
      state: {
        is_direct: '0'
      }
    });
  };

  backToTradeDash() {
    this.navCtrl.navigateBack('trade-dashboard', {
      state: {
        back: '1'
      }
    });
  }

}
