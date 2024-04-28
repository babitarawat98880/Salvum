import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, NavController ,Platform ,ActionSheetController, LoadingController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
// import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileUploader } from 'ng2-file-upload';
import { EventService } from '../../services/event.service';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';
import { FileTransfer,FileTransferObject } from '@ionic-native/file-transfer/ngx'; 
import * as $ from 'jquery';
declare var cordova: any; 

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  data : any = {'linkdin': '', 'gplus': '', 'twitter': '','facebook':''} 
  imagedate : object = {} 
  public uploader: FileUploader;
  imagenew:string;
  uid : object = {};
  userSocialLink : object = {};
  lastImage:string;
  isBrowser:any;
  filetype_error: any = '0';
  filesize_error: any = '0';
  image:any = '';
  updateImageURL = localStorage.getItem('APIURL') + '/updateProfile';
  imageUrl = localStorage.getItem('APIURL') + '/images/';
  correctImage = '';
  constructor(
    public navCtrl: NavController,
    public http:HttpClient,
    private camera: Camera, 
    private transfer: FileTransfer, 
    private file: File, 
    private filePath: FilePath,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController, 
    public platform: Platform, 
    public loadingCtrl: LoadingController, 
    public events: EventService,
    public componentService:ComponentService,
    public APIService:APIService) {
      this.data = history.state.someData;
    }

  ngOnInit() {
    this.isBrowser = localStorage.getItem('isBrowser');
    var APIURL = localStorage.getItem('APIURL');
      this.uploader  = new FileUploader({
        url: APIURL + '/profileFilesUpload', 
        allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
        itemAlias: 'file', 
        additionalParameter: {
          folder_path: 'images'
        },
        maxFileSize: 500*1024*1024
        }); 

      this.uploader.onWhenAddingFileFailed = (check) => {  
        console.log(check)
        if(check.size > 500*1024*1024){
          this.filesize_error = '1';
        }
        else{
          this.filetype_error = '1';
        }
      }

      this.uploader.onBeforeUploadItem = (item) => {
        item.withCredentials = false;
      this.componentService.showLoader();
      }

     // this.events.publish('username:changed', []);

      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
       this.componentService.dismissLoader();
       console.log(response, "res")
        var data = JSON.parse(response);
        this.APIService.getData('updateProfile',localStorage.getItem('userinfo')+'/'+data.data.file_name).subscribe((all_files:any)=>{
          this.componentService.presentToast( 'Profile Picture has been updated successfully.','success');
          this.componentService.dismissLoader();
          this.navCtrl.navigateForward('profile', { state:{ filename : item.file.name} });
        },
        (err:any) => {
          console.log(err)
          this.componentService.dismissLoader();
            this.showTechnicalError('1');
        });
      };

      this.uploader.onCompleteAll = () => {
        console.log('complete');
      };
  }

  closeErrorS(){
    this.filesize_error = '0';
  }

  ionViewDidLoad() {
    this.isBrowser = localStorage.getItem('isBrowser');
    // if(this.navParams.get('email') == undefined)
    // {
    //   this.navCtrl.navigateForward('profile');
    // }
  };

  showTechnicalError(type:any = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please '+msg,'info');
  }

  updateGernalInfo (data:any){ 
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(data.name == undefined || data.name == ''){
      this.componentService.presentToast('Please enter your name.','danger');
    }else if(data.email == undefined || data.email == ''){
      this.componentService.presentToast('Please enter your email address.','danger');
    }else if(reg.test(data.email) == false){
      this.componentService.presentToast('Please enter valid email address.','danger');
    }else{
     this.componentService.showLoader();
      let body = this.data;
      return this.APIService.sendData('updateUser',body).subscribe((data:any) => {
        //this.data = data;
        this.componentService.dismissLoader();
        if(data.status == '1')
        {
          let profiledata = data;
          this.componentService.presentToast('General information has been updated successfully.','success');
          this.events.publish('user:updated', profiledata);
          this.navCtrl.navigateForward('profile',profiledata);
        }
        else if(data.status == '2')
        {
          this.componentService.presentToast('Email already exist.','danger');
        }
        else
        {
          this.componentService.presentToast('Error, please try later.','danger');
        }
        
      },
      (err:any) => {
         this.componentService.dismissLoader();
          this.showTechnicalError('1');
      });
    }
    
  };



  updateUserSocialLink (){
   
    this.componentService.showLoader()
    let body = this.data;
      return this.APIService.sendData('updateUserSocailLink',body)
        .subscribe((data:any) => {
          this.data = data;
         this.componentService.dismissLoader();
            if(data.status == '1')
            {
              let socialdata = data;
              this.componentService.presentToast('Social Links has been updated successfully.','success');
              this.events.publish('user:updated', Date.now());
              this.navCtrl.navigateForward('profile',socialdata);
            }
            else
            {
              this.componentService.presentToast('Error, please try later.','danger'); 
            }
      },
      (err:any) => {
         this.componentService.dismissLoader();
          this.showTechnicalError('1');
      });
  };


 public async  presentActionSheet() {
    let actionSheet = await this.actionSheetCtrl.create({
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
    await actionSheet.present();
  }


  public takePicture(sourceType:any) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  this.camera.getPicture(options).then((imagePath:any) => {
  this.imagenew = imagePath;
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.correctImage = currentName;
  
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
  }, (err:any) => {
    
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
  private copyFileToLocalDir(namePath:any, currentName:any, newFileName:any) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
 
  private presentToast(text:any) {
    this.componentService.presentToast(text,'danger'); 
   
  }
 
  // Always get the accurate path to your apps folder
  public pathForImage(img:any) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
    // File name only
    var filename = this.lastImage;
    console.log(filename, "file")
    this.componentService.showLoader()
    this.imagedate = {
      userId : localStorage.getItem('userinfo')
    }
    let body = JSON.stringify(this.imagedate);
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename , 'fields' : body}
    };
    const fileTransfer: FileTransferObject = this.transfer.create();
    // const fileTransfer: TransferObject = this.transfer.create();
    fileTransfer.upload(targetPath, this.updateImageURL, options).then(data => {
     this.componentService.dismissLoader();
      let imageData = data;
      console.log(imageData, "uploadImage")
      this.componentService.presentToast('Profile has been updated successfully.','success')
      
        this.navCtrl.navigateForward('profile',{state:{imageData}});
    });
  };

  profile(){
    this.navCtrl.navigateRoot('profile');
  };

  root(){
    this.navCtrl.navigateRoot('dashboard');
  }

  readUrl(event:any) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.onload = (event:any) => {
      $('.preview_image').attr('src', event.target.result);
    }

    reader.readAsDataURL(event.target.files[0]);
  }
}

  uploadImg(){ 
    // console.log(this.uploader.queue.length,this.uploader.queue )
    if(this.uploader.queue.length > 0){
      this.uploader.queue[0].upload();
    }
  }

  closeError(){
    this.filetype_error = '0';
  }
}
