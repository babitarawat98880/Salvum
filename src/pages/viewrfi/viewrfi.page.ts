import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-viewrfi',
  templateUrl: './viewrfi.page.html',
  styleUrls: ['./viewrfi.page.scss'],
})
export class ViewrfiPage {
  rfi:any;
  APIURL:any;
  role:any;
  baseUrl = localStorage.getItem('baseUrl');
  isBrowser = localStorage.getItem('isBrowser');
    constructor(
      private transfer: FileTransfer, 
      public toastCtrl : ToastController, 
      private file: File,
      public navCtrl: NavController, 
      public navParams: NavParams, 
      public modalController: ModalController, 
      public loadingCtrl: LoadingController, 
      public APIService: APIService,
      public componentService:ComponentService) {
      this.role = navParams.get('role');
      if(navParams.get('page_type') == '1')
      {
        var RfiId = navParams.get('RfiId');
        this.componentService.showLoader();
        this.APIService.getData('getRFIDetails',RfiId).subscribe((data:any)=>{
          var rfis = {
            question: data.question,
            question_engg: data.question_engg,
            answer: data.answer,
            answer_files: data.answer_files,
            question_files:data.question_files,
            question_date: data.question_date,
            answer_date: data.answer_date,
            _id: data._id 
              };
            this.rfi = rfis;
          this.componentService.dismissLoader();;
        },
        err => {
            this.componentService.dismissLoader();;
            this.showTechnicalError();
        });
        
      }
      else
      {
        this.rfi = navParams.get('rfi');
      }
      this.APIURL = localStorage.getItem('APIURL');
    }
  
    showTechnicalError(type = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'danger')
    }
  
    downloadAndroid(url,name) {
      this.componentService.presentToast('Start downloading....','success');
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(url, this.file.externalRootDirectory + name.split('____').pop()).then((entry) => {
      this.componentService.presentToast('File downloaded.', 'success');
      }, (error) => {
      this.componentService.presentToast( 'Error', 'danger');
      });
    }
  
  dismiss(){
    this.modalController.dismiss();
  }
  
  }
  