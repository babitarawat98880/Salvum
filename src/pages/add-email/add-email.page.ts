import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController,ModalController,NavParams} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentService } from '../../services/component.service';
import { APIService } from '../../services/api.service';


@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.page.html',
  styleUrls: ['./add-email.page.scss'],
})
export class AddEmailPage  {
  userId:any = localStorage.getItem('userinfo');
  user_name:any = localStorage.getItem('userName');
  isOtpSent: Boolean = false;
  emailId: any = null;
  my_email: any = null;
  email:any;
  bidJobId:any;
    constructor(
      public navCtrl: NavController,
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController,
      public route:ActivatedRoute,
      public modalController:ModalController,
      public componentService:ComponentService,
      public APIService:APIService,
      private navParams: NavParams) {
        console.log(this.navParams.get('verify'));
        // this.route.queryParams.subscribe(params => {
        //   console.log(params);
        //   var verify = this.route.snapshot.paramMap.get('verify');
        //   var invite_email = this.route.snapshot.paramMap.get('invite_email');
          var verify = navParams.get('verify');
          var invite_email = navParams.get('invite_email');
          if(verify == '1'){
            this.my_email = this.route.snapshot.paramMap.get('email');
            this.emailId = this.route.snapshot.paramMap.get('id');
            var data = {
              _id : this.emailId,
              email : this.my_email,
              name : this.user_name
            }
            this.isOtpSent = true;
            this.componentService.showLoader();
            this.APIService.sendData('updateEmailOtp',data).subscribe((result:any)=>{
              this.componentService.dismissLoader();
            if(result.status == 1){
              this.componentService.presentToast('OTP sent on your email address.Check your OTP and enter here.','success');
            }
            else{
              this.componentService.presentToast('Error,Plz try later.','danger');
            }
          },
            (err:any) => {
               this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
          }
          if(invite_email != null && invite_email != undefined){
            this.email = invite_email;
            this.bidJobId = this.route.snapshot.paramMap.get('bidJobId');
          }
        // });
    
    }
  
    ionViewDidLoad() {
      
    }
  
    dismiss() {
      this.modalController.dismiss(this.isOtpSent);
    }
  
    addEmail(email:any){
      if(email == undefined || email == null || email == ''){
        this.componentService.presentToast('Please enter an email address','danger');

      }
      else{
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(reg.test(email) == false){
        this.componentService.presentToast('please enter valid email address','danger');

        }
        else{
        this.componentService.showLoader()
          var data = {
            email : email,
            name : this.user_name,
            userId : this.userId
          }
          this.APIService.sendData('addEmail',data).subscribe((result:any)=>{
            this.componentService.dismissLoader();
          if(result.status == 1){
            this.isOtpSent = true;
            this.emailId = result.data._id;
            this.my_email = email;
        this.componentService.presentToast('OTP sent on your email address.Check your OTP and enter here.','success');

          }
          else if(result.status == 2){
        this.componentService.presentToast('Email already exists in our system.','danger');

          }
          else{
            this.componentService.presentToast('Error,Plz try later.','danger');
          }
        },
          (err:any) => {
            this.componentService.dismissLoader();
              this.showTechnicalError('1');
          });
        }
      }
    }
  
    verifyOTP(otp:any){
      if(otp == undefined || otp == null || otp == ''){
        this.componentService.presentToast( 'Please enter OTP','danger');
      
      }
      else{
       this.componentService.showLoader();
        var data;
        if(this.route.snapshot.paramMap.get('invite_email')== this.my_email){
          data = {
            otp : otp,
            email : this.my_email,
            _id : this.emailId,
            bidJobId : this.bidJobId,
            userId : this.userId
          }
        }
        else{
          data = {
            otp : otp,
            email : this.my_email,
            _id : this.emailId
          }
        }
        this.APIService.sendData('checkEmailOTP',data).subscribe((result:any)=>{
          this.componentService.dismissLoader()
        if(result.status == 1){
          this.componentService.presentToast('Email address added & verified successfully.','success');
              this.dismiss();
        }
        else if(result.status == 2){
          this.componentService.presentToast( 'Invalid OTP.','danger');
        }
        else{
          this.componentService.presentToast( 'Error,Plz try later.','danger')
        }
      },
        (err:any) => {
           this.componentService.dismissLoader();
            this.showTechnicalError('1');
        });
      }
    }
  
    showTechnicalError(type :any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast(  'Technical error, Please '+msg,'info');
    }
  
  }
  
