import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { EventService } from 'src/services/event.service';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
@Component({
  selector: 'app-extcont',
  templateUrl: './extcont.page.html',
  styleUrls: ['./extcont.page.scss'],
})
export class ExtcontPage {
  data: Array<{}>;
  finaldata : {};
  extnal : {};
  isBrowser:any;
  invititionMail : Array<any> = [];
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
   getContact='getContacts';
   addExternalContacts = 'addContacts';
   sendEmailInvition = 'sendInvition';
   userId = localStorage.getItem('userinfo');
   constructor(
    public navCtrl: NavController, 
    public http:HttpClient, 
    public alertCtrl: AlertController,
    public events: EventService,
    public componentService:ComponentService,
    public APIService:APIService) {
       this.isBrowser = localStorage.getItem('isBrowser');
   }
 
   ngOnInit() {
     this.componentService.showLoader();
     var userId = localStorage.getItem('userinfo');
       return this.APIService.getData(this.getContact , userId).subscribe((data:any) => {
          this.componentService.dismissLoader();
          this.data = data.data;
         },
         err => {
          this.componentService.dismissLoader();
             this.showTechnicalError();
         })
      
   }
 
   showTechnicalError(type:any = null){
     var msg = (type == '1') ? 'try later.' : 'reload the page.'
     this.componentService.presentToast( 'Technical error, Please '+msg,'info');
   }
 
   sendmail(mails){
     if(this.invititionMail.length > 0){
       for(let data of this.invititionMail) {
         if(data == mails.externalContacts){
           var index = this.invititionMail.findIndex(x => x == mails.externalContacts);
           this.invititionMail.splice(index, 1);
           console.log(this.invititionMail);
           return false;
         }
       }
     this.invititionMail.push(mails.externalContacts);
     }else{
       this.invititionMail.push(mails.externalContacts)
     }
   }
 
    Invitation(){
       if(this.invititionMail.length == 0){
        this.componentService.presentToast('Please select atleast one checkbox','danger');
       }else{
            
      return this.APIService.sendData(this.sendEmailInvition, {'email': this.invititionMail, 'userId': this.userId}).subscribe((data:any) => {
        if(data.error != null){
        this.componentService.presentToast(data.error, '');
         this.invititionMail = [];
         this.ngOnInit();
       } else {
        this.componentService.presentToast('Invitation mail has been sent.', 'success');
         this.invititionMail = [];
         this.ngOnInit();
       }			         
     },
     err => {
         this.showTechnicalError('1');
     });
   }
   }
 
   Import(){
    this.navCtrl.navigateForward('InvitePage');
 
   }
 
 
async  Add(){
  let prompt = await this.alertCtrl.create({
       header: 'Add External Contact',
       inputs: [
         {
           name: 'email',
           placeholder: 'Email',
 
            type: 'text'
         }
       ],
 
       buttons: [
         {
           text: 'Cancel',
           handler: data => {
             console.log('Cancel clicked');
           }
         },
         {
           text: 'Add Contact',
           handler: data => {
 
 
             var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
             // var str = data.email;
             if (reg.test(data.email) == false) 
             {
              this.componentService.presentToast('Please Enter Valid Email','danger')
             
                         return false;
             }else if (data.email.includes(",") == true) 
             {
              this.componentService.presentToast('Please Enter Valid Email','danger')
               
                         return false;
             }else{
              this.componentService.showLoader();
             this.invititionMail = data.email;
             this.extnal = {'userId':localStorage.getItem('userinfo'),
              'extrnalContacts':this.invititionMail
             }
               let body = JSON.stringify(this.extnal);
                this.APIService.sendData(this.addExternalContacts, body)
                //  return this.http.post(this.API_ENDPOINT_URL+this.addExternalContacts, body, options)
                    //  .map(res => res.json())
                     .subscribe((data:any) => {
                    this.componentService.dismissLoader();
                     this.ngOnInit();
                      this.invititionMail = [];
                       if(data.status == 0){
                        this.componentService.presentToast('External contact already exist.', 'danger')
                        
                       }else if(data.status == 1){
                        this.componentService.presentToast('Can\'t invite yourself.', 'danger')
                         
                       }else{
                        this.componentService.presentToast('External contact saved successfully.', 'success')
                       }
                     },
                     err => {
                       this.componentService.dismissLoader();
                         this.showTechnicalError('1');
                     });
             }    
           }
         }
       ]
     })
    await prompt.present(); 
   };
 
   root(){
     this.navCtrl.navigateRoot('dashboard');
   };
 
   contacts(){
     this.navCtrl.navigateRoot('contacts');
   };
 
   async deleteContact(item, index){
 
     let alert = await this.alertCtrl.create({
         header: 'Delete External Contact',
         message: 'Do you want to delete this external contact?',
         buttons: [{
           text: 'Cancel',
           role: 'cancel',
           handler: () => {
               console.log('Cancel clicked');
           }
         },
         {
           text: 'Yes',
           handler: () => {
             this.componentService.showLoader();
             this.APIService.putData(this.addExternalContacts, {'_id': item._id }).subscribe(data => {
             this.componentService.dismissLoader();
             this.componentService.presentToast('External contact deleted successfully.','success')
             this.data.splice(index,1);
             },
             err => {
               this.componentService.dismissLoader();
                 this.showTechnicalError('1');
             });
           }
         }]
       });
    await alert.present();
   };
 }
