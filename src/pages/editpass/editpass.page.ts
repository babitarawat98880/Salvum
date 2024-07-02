import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, ModalController ,ActionSheetController, Platform, LoadingController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FileUploader } from 'ng2-file-upload';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
declare var cordova: any;

@Component({
  selector: 'app-editpass',
  templateUrl: './editpass.page.html',
  styleUrls: ['./editpass.page.scss'],
})
export class EditpassPage  {
  data: any = {};
  lastImage:string;
  currentName:string;
  imageData:string;
  filetype_error: any = '0';
  filesize_error: any = '0';
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  updateURL = 'updatepassword';
  uploader:any;
  loading:any;
  iswebfileUploader:Boolean = false;
  extnal:any;
  APIURL = localStorage.getItem('APIURL');
  isBrowser:any;
  constructor(
    public navCtrl: NavController, 
    public modalController: ModalController,
    public http:HttpClient ,
    public toastCtrl: ToastController,
    private camera: Camera, 
    private transfer: FileTransfer, 
    private file: File, 
    private filePath: FilePath, 
    public actionSheetCtrl: ActionSheetController, 
    public platform: Platform, 
    public loadingCtrl: LoadingController,
    public componentService:ComponentService,
    public APIService:APIService) {
    this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
    this.uploader  = new FileUploader({
      url: this.APIURL + '/updatepassword', 
      allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
      itemAlias: 'file', 
      additionalParameter: {
        folder_path: 'images',
        'fields' : JSON.stringify(this.data)
      },
      maxFileSize: 500*1024*1024
    });

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }

    this.uploader.onWhenAddingFileFailed = (check) => { 
      if(check.size > 500*1024*1024){
        this.filesize_error = '1';
      }
      else{
        this.filetype_error = '1';
      }
    }

    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      this.iswebfileUploader = false;
    };

    this.uploader.onCompleteAll = () => {
      this.componentService.dismissLoader();
      this.componentService.presentToast('Password has been updated successfully.','success');
      this.navCtrl.navigateBack('passwords');
    };
  }

  showTechnicalError(type :any = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please '+msg,'info');
  }

  closeErrorS(){
    this.filesize_error = '0';
  }

  ngOnInit() {
    this.data  = JSON.parse(localStorage.getItem('passworddetail') ||'');
    console.log(this.data);
  }

  dismiss() {
    this.modalController.dismiss('empty');
  } 

  updatePasword(){
     let body = this.data;
     let headers = new Headers({ 'Content-Type': 'application/json' });
     return this.http.post(this.APIURL +'/walletDeatil/12341241214',  body)
          .subscribe(data => {
            this.componentService.presentToast('Password has been updated successfully.','success');
             this.modalController.dismiss(); 
            },
            err => {
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
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
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
   this.imageData = imagePath;
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);


          this.currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
      
  
          this.copyFileToLocalDir(correctPath, this.currentName, this.createFileName());
        });
  }, (err) => {
    
  });
}

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
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
    this.componentService.presentToast(text,'danger');
  }
 
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    if(this.isBrowser == 'true'){
      this.componentService.showLoader;
      // let body = JSON.stringify(this.extnal);
      //this.addweb = this.extnal;
      if(this.uploader.queue.length == 0){
        this.updatePasword(); 
      }else{
        this.componentService.showLoader();
        // let body = JSON.stringify(this.extnal);
        //this.addweb = this.extnal;
        this.uploader.queue[0].options.additionalParameter.fields = JSON.stringify(this.data);
        this.uploader.queue[0].upload();
      }
    }else{
      // Destination URL
     this.componentService.showLoader();
     
      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);
     
      // File name only
      var filename = this.lastImage;
      let body = JSON.stringify(this.data);
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename , 'fields' : body}
      };
      const fileTransfer: FileTransferObject = this.transfer.create();

      fileTransfer.upload(targetPath, this.API_ENDPOINT_URL+this.updateURL, options).then(data => {
       this.componentService.dismissLoader();
        let passadddata = data;
        this.componentService.presentToast('Password was updated successfully','success');
        this.modalController.dismiss();
        // this.navCtrl.navigateBack('passwords',passadddata);
      });
    }
  }

  closeError(){
    this.filetype_error = '0';
  }

}
