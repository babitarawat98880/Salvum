import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { FilemanagerfilesPage } from '../filemanagerfiles/filemanagerfiles.page';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sendrfi',
  templateUrl: './sendrfi.page.html',
  styleUrls: ['./sendrfi.page.scss'],
})
export class SendrfiPage {
  RfiId: any;
  question: any;
  answer: any = '';
  dateTime: any;
  userId: any;
  jobId: any;
  files: any;
  tradeId: any;
  inviteId: any;
  stateData: any = '';
  isBrowser = localStorage.getItem('isBrowser');
  APIURL:any = localStorage.getItem('APIURL');
  baseUrl:any = '';
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public APIService: APIService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public componentService: ComponentService,
    public router: Router) {
    this.baseUrl = this.APIURL.replace(':3002','')
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    this.RfiId = this.stateData['RfiId'];
    this.question = this.stateData['question'];
    this.userId = this.stateData['userId'];
    this.jobId = this.stateData['jobId'];
    this.tradeId = this.stateData['tradeId'];
    this.inviteId = this.stateData['inviteId'];
    this.dateTime = new Date().getTime();
  }

  replyRFI(question, answer) {
    if (question == '' || question == undefined) {
      this.componentService.presentToast('Question is required.', 'danger');
      return false;
    }
    if (answer == '' || answer == undefined) {
      this.componentService.presentToast('Please enter your answer.', 'danger');
      return false;
    }
    this.componentService.showLoader();
    var all_files: any = [];
    var bid_files = null;
    if (this.files != undefined) {
      if (this.files.length > 0) {
        this.files.forEach(function (file) {
          all_files.push(file.name);
        });
        // bid_files = JSON.stringify(all_files);
        bid_files = all_files;
      }
    }
    this.APIService.sendData('replyRFI', { id: this.RfiId, question: question, answer: answer, answer_files: bid_files, userId: this.userId, jobId: this.jobId, tradeId: this.tradeId, inviteId: this.inviteId, APIURL: this.APIURL, baseUrl: this.baseUrl }).subscribe((formdata: any) => {
      if (formdata.status == 1) {
        this.componentService.dismissLoader();
        this.componentService.presentToast('RFI has been replied successfully.', 'success');
        this.modalCtrl.dismiss();
      }
      else {
        this.componentService.dismissLoader();
        this.componentService.presentToast('Error, plz try later.', 'danger');
      }
    },
      err => {
        this.componentService.dismissLoader();;
        this.showTechnicalError('1');
      });
  }

  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'danger');

  }

  async filemanagerFiles() {
    let modal = await this.modalCtrl.create({
      component: FilemanagerfilesPage,
      componentProps: {
        reply_rfi: '1'
      }
    });
    modal.onDidDismiss().then(res => {
      var data = res.data;
      if (data != undefined && data != '') {
        var filesArray: any = [];
        var dateTime = this.dateTime;
        data.forEach(function (single_file) {
          var fileobj = {
            file_name: single_file.name,
            name: dateTime + '____' + single_file.name,
            folder_path: localStorage.getItem('filemanager_file_path'),
            random: dateTime
          }
          filesArray.push(fileobj);
        });

        if (this.files != undefined) {
          this.files = this.files.concat(filesArray);
        }
        else {
          this.files = filesArray;
        }
        this.APIService.sendData('addBidFiles', filesArray).subscribe((filesdata) => {
          console.log('done');
        },
          err => {
            this.showTechnicalError('1');
          });
      }
    });
    modal.present();
  }

  async uploadFiles() {
    let modal = await this.modalCtrl.create({
      component: 'UploadfilePage',
      componentProps: { dateTime: this.dateTime, bid_upload: '1' }
    });
    modal.onDidDismiss().then(res => {
      var data = res.data
      if (data != undefined || data != '') {
        if (data.length > 0) {
          var filesArray: any = [];
          var dateTime = this.dateTime;
          data.forEach(function (single_file) {
            if (single_file.isUploaded == true) {
              var fileobj = {
                file_name: single_file._file.name,
                name: dateTime + '____' + single_file._file.name,
                random: dateTime
              }
              filesArray.push(fileobj);
            }
          });

          if (this.files != undefined) {
            this.files = this.files.concat(filesArray);
          }
          else {
            this.files = filesArray;
          }
        }
      }
    });
    modal.present();
  }

  removeFile(index) {
    this.files.splice(index, 1);
  }

  dismiss() {
    this.navCtrl.navigateForward('rfi', { state: { jobId: this.jobId } });
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
