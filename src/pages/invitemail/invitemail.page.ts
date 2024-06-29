import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-invitemail',
  templateUrl: './invitemail.page.html',
  styleUrls: ['./invitemail.page.scss'],
})
export class InvitemailPage{
  tags = '';
  allValidTags : any = [];
  sendArray :any = [];
  isEmailValid: Boolean = true;
  isEmailAlreadyExist = false;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  specContInvition = 'sendInvition';
   constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public APIService: APIService,
    public componentService:ComponentService,
    public toastCtrl: ToastController,
    public http:HttpClient, 
    public modalController : ModalController) {
      this.http = http;
   };
 
   dismiss() {
     this.modalController.dismiss();
   };
 
   onInput(){
     this.isEmailValid = true;
   }
 
   validateEmail(email){ 
     if(this.tags != ''){
       var tagArray :any = [];
       var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
       if (reg.test(email) == false){
         tagArray.push(email);
         this.isEmailValid = false;
         this.isEmailAlreadyExist = false;
       }else{
         this.isEmailValid = true;
         if(this.sendArray.indexOf(email) == -1) {
           this.sendArray.push(email);
           this.tags = '';
           this.isEmailAlreadyExist = false;
         }else{
           this.isEmailAlreadyExist = true;
         }
       }
     }
     
   };
 
   showTechnicalError(type :any = null){
     var msg = (type == '1') ? 'try later.' : 'reload the page.'
     this.componentService.presentToast('Technical error, Please '+msg,'info')
   }
 
   submit(email){
     if(this.tags != ''){
       if(this.verifyTag(email)){
         this.isEmailValid = true;
         if(this.sendArray.indexOf(email) == -1) {
           this.sendArray.push(email);
           this.tags = '';
           this.isEmailAlreadyExist = false;
           if(this.sendArray.length == 0){
            this.componentService.presentToast('Please enter atleast one tag.','danger')

           }else{
             this.sendInvitation();
           }
         }else{
           this.isEmailAlreadyExist = true;
         }
       }
     }else{
       if(this.sendArray.length == 0){
        this.componentService.presentToast('Please enter atleast one tag.','danger')
         }else{
         this.sendInvitation();
       }
     }
   }
 
   sendInvitation(){
     this.componentService.showLoader();
     let body = JSON.stringify({'email': this.sendArray, 'userId': localStorage.getItem('userinfo') });
     let headers = new Headers({ 'Content-Type': 'application/json' });
     return this.http.post(this.API_ENDPOINT_URL+this.specContInvition, body)
         .subscribe((data:any) => { 
         this.componentService.dismissLoader();
         this.tags = '';
         this.sendArray = [];
           if(data.status == 0){
             if(data.error == 'You can\'t invite by yourself.' || data.error == 'already connected with user.' || data.error == 'You can\'t invite by yourself.already connected with user.'){
             this.componentService.presentToast(data.error,'danger');
             } else{
             this.componentService.presentToast(data.error,'success');
               this.modalController.dismiss();
             }
             
           }else{
             var msg = '';
             for(var i=0; i < this.sendArray.length; i++){
               if(msg == ''){
                 msg = this.sendArray[i];
               }else{
                 msg = msg + ',' + this.sendArray[i]
               }
             }
             this.componentService.presentToast('Invitation Send on this' + ' '+ msg,'success')
             this.modalController.dismiss();
             this.navCtrl.navigateBack('invite');
         }  
      },
       err => {
           this.componentService.dismissLoader();
           this.showTechnicalError('1');
       });
       
   }
 
   verifyTag(tag){
     var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
       if (reg.test(tag) == false){ 
         return false;
       }else{
         return true;
       }  
   }  
 
   removeEmailAddress(index){
     this.sendArray.splice(index, 1);
   }
 }
