import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, NavParams, NavController, ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { FileUploader } from 'ng2-file-upload';
import * as CryptoJS from 'crypto-js';
declare var cordova: any;
@Component({
  selector: 'app-addwebsite',
  templateUrl: './addwebsite.page.html',
  styleUrls: ['./addwebsite.page.scss'],
})
export class AddwebsitePage {
  selectCategory: string;
  weblink: string;
  username: string;
  password: string;
  image: string = '';
  weblevel: string;
  iswebfileUploader: Boolean = false;
  filetype_error: any = '0';
  addweb: Object = {};
  extnal: {}
  lastImage: string;
  API_ENDPOINT_URL: any = localStorage.getItem('API_ENDPOINT_URL');
  websiteURL = 'addwebsite';
  isBrowser: any = '';
  APIURL: any;
  uploadedImage: String = '';
  filesize_error: any = '0';
  uploader: any;
  loading: any;
  userId: any;
  all_levels: any = [];
  allowed_levels: any = [];
  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public http: HttpClient,
    public componentService: ComponentService,
    public navCtrl: NavController,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public APIService: APIService) {
    this.http = http;
    this.APIURL = localStorage.getItem('APIURL');
    this.unlock();
    this.uploader = new FileUploader({
      url: this.APIURL + '/addwebsite',
      allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
      itemAlias: 'file',
      additionalParameter: {
        folder_path: 'images',
        'fields': JSON.stringify(this.addweb)
      },
      maxFileSize: 500 * 1024 * 1024
    });

    this.uploader.onBeforeUploadItem = (item) => {
      console.log(item, "sdd")
      item.withCredentials = false;
    }

    this.uploader.onWhenAddingFileFailed = (check) => {
      console.log(check, "sddsd")
      if (check.size > 500 * 1024 * 1024) {
        this.filesize_error = '1';
      }
      else {
        this.filetype_error = '1';
      }
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.iswebfileUploader = false;
    };

    this.uploader.onCompleteAll = () => {
      this.componentService.dismissLoader();
      this.modalCtrl.dismiss('data');
    };
  }

  showTechnicalError(type :any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  closeErrorS() {
    this.filesize_error = '0';
  }

  unlock() {
    this.userId = localStorage.getItem('userinfo');
    this.all_levels = JSON.parse(localStorage.getItem('alllevel') || '');

    if (this.all_levels && this.all_levels.length > 0) {
      this.all_levels.forEach((value) => {

        this.allowed_levels = [];
        var decrypted = CryptoJS.AES.decrypt(value, this.userId);
        var i;
        if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
          this.allowed_levels = [];
          for (i = 1; i <= 1; i++) {
            this.allowed_levels.push(i);
          }
        } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
          this.allowed_levels = [];
          for (i = 1; i <= 2; i++) {
            this.allowed_levels.push(i);
          }
        } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
          this.allowed_levels = [];
          for (i = 1; i <= 3; i++) {
            this.allowed_levels.push(i);
          }
        } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
          this.allowed_levels = [];
          for (i = 1; i <= 4; i++) {
            this.allowed_levels.push(i);
          }
        } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
          this.allowed_levels = [];
        }
      });
    }
  };


  ngOnInit() {
    this.isBrowser = localStorage.getItem('isBrowser');
  }
  //   presentModal3(myEvent1) {
  //   let modal = this.modalCtrl.create(AddwebsitePage);
  //   modal.present({
  //     ev: myEvent1
  //   });
  // }
  dismiss() {
    // this.modalCtrl.dismiss();
    this.modalCtrl.dismiss('empty');
  }

  addwebsite() {

    this.componentService.showLoader();
    let body = JSON.stringify(this.addweb);
    return this.http.post(this.API_ENDPOINT_URL + this.websiteURL, body)
      .subscribe(data => {
        let websiteData = data
        this.componentService.dismissLoader();
        this.componentService.presentToast('Website has been added successfully', 'success');
        this.navCtrl.navigateBack('sites', websiteData);
      },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError('1');
        });
  }


  public async presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Choose Image',
          handler: () => {
            if (this.isBrowser == true) {
              this.iswebfileUploader = true;
            } else {
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    (await actionSheet).present();
  }


  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);

          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));


          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    }, (err) => {

    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    this.componentService.presentToast(text, 'danger');
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  onFileSelected(event) {
    console.log(event, this.image)
    const file: File = event[0];
    console.log(file);
    }
  public uploadImage() {
    console.log(this.image, "image")
    if (this.selectCategory == undefined || this.selectCategory == '') {
      this.componentService.presentToast('Select site category.', 'danger');
    } else if (this.weblink == undefined || this.weblink == '') {
      this.componentService.presentToast('Please add link of the website.', 'danger');
    } else if (this.username == undefined || this.username == '') {
      this.componentService.presentToast('Please enter your username/email.', 'danger');
    } else if (this.password == undefined || this.password == '') {
      this.componentService.presentToast('Please enter your password.', 'danger');
    } else if (this.weblevel == undefined || this.weblevel == '') {
      this.componentService.presentToast('Please select level.', 'danger');
    } else {
      if (this.isBrowser == 'true') {
        this.addweb = {
          selectCategory: this.selectCategory,
          weblink: this.weblink,
          username: this.username,
          password: this.password,
          weblevel: this.weblevel,
        };
        console.log(this.uploader.queue, "this.uploader.queue")
        if (this.uploader.queue.length == 0) {
          this.componentService.presentToast('Please select logo.', 'danger');
        } else {
          this.extnal = {
            'userId': localStorage.getItem('userinfo'),
            'siteData': this.addweb
          };
          this.componentService.showLoader();
          // let body = JSON.stringify(this.extnal);
          this.addweb = this.extnal;
          console.log(JSON.stringify(this.addweb));
          this.uploader.queue[0].options.additionalParameter.fields = JSON.stringify(this.addweb);
          this.uploader.queue[0].upload();
        }
      } else {
        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        if (targetPath == "file:///data/user/0/io.ionic.starter/files/undefined") {
          this.componentService.presentToast('Please select logo.', 'danger');
        } else {
          this.addweb = {
            selectCategory: this.selectCategory,
            weblink: this.weblink,
            username: this.username,
            password: this.password,
            weblevel: this.weblevel,
          };

          var filename = this.lastImage;
          this.extnal = {
            'userId': localStorage.getItem('userinfo'),
            'siteData': this.addweb
          };


          this.componentService.showLoader();
          let body = this.extnal;//JSON.stringify(this.extnal);
          var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename, 'fields': body }
          };

          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer.upload(targetPath, this.APIURL + '/addwebsite', options).then(data => {
            this.componentService.dismissLoader();
            this.componentService.presentToast('Website has been added successfully.', 'success');
            this.modalCtrl.dismiss('data');
          });
        }
      }
    }
  }

  closeError() {
    this.filetype_error = '0';
  }
}