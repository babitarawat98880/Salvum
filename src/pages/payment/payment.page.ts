import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage  {
  cardNumber : string; 
  cvv: string; 
  zip: string;
  expiryDate: string;
  paynow : {};
  adddata:{};
  package: string;
  license: string;
  interval: string;
  curr_year: number;
  future_year: number;
  is_recurring_billing: any;
  packId:string
  isBrowser = localStorage.getItem('isBrowser');
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
   PayAuth = 'PayAuth';
   PayAuthRecurring = 'PayAuthRecurring';
   PayAuthRecurringSignup = 'PayAuthRecurringSignup';
   addPayment = 'addPayment';
   addLicense = 'addLicense';
   addUserSpacePackage = 'addUserSpacePackage';
   addExtraUserLicense= 'addExtraUserLicense';
   prePage = localStorage.getItem('preState');
   create_new:any;
   companyId:any;
   company_name:any;
   data:any = '';
   constructor(
     public navCtrl: NavController,
     public http:HttpClient,
     public componentService:ComponentService,
     public APIService:APIService
    ) {
      this.http = http;
      this.curr_year = new Date().getFullYear();
      this.future_year = this.curr_year + 25;
   }
 
   ngOnInit() {
    this.data = history.state;
    console.log(history.state);
       if(this.data.totalprice){
           this.package = this.data.totalprice;
           this.license = this.data.license;
           this.interval = this.data.interval;
           this.packId = this.data.packId;
           this.is_recurring_billing = this.data.is_recurring_billing;
       } else if(this.data.extra.type == 'extra'){
         var pricesplit = this.data.newprice;
         var finalprice = pricesplit.split('/');
           this.package = finalprice[1];
           this.license = finalprice[0];
           this.interval = '30';
           this.packId = finalprice[2];
           this.create_new = this.data.create_new;
           this.companyId = this.data.companyId;
           this.company_name = this.data.company_name;
 
         // console.log(this.data);
       }else{
         // console.log(this.data);
       }
   }
 
   showTechnicalError(type:any = null){
     var msg = (type == '1') ? 'try later.' : 'reload the page.'
     this.componentService.presentToast('Technical error, Please '+msg,'danger')
   }
 
   payment(){
    if(this.cardNumber == undefined || this.cardNumber == ''){
     this.componentService.presentToast('Please enter valid card number.','danger')
   }else if(this.cvv == undefined || this.cvv == ''){
     this.componentService.presentToast('Please enter valid cvv.','danger')
       }else if(this.zip == undefined || this.zip == ''){
     this.componentService.presentToast('Please enter valid zip.','danger')
       }else if(this.expiryDate == undefined){
     this.componentService.presentToast('Please select expiry date.','danger')
       }else if(this.cvv.length <  3 || this.cvv.length >  4){
     this.componentService.presentToast( 'Please add atleast 3 digit cvv.','danger')
       }else if(this.zip.length <  5 || this.zip.length >  6){
     this.componentService.presentToast('Please add atleast 5 digit zip.','danger')
       }else if(this.cardNumber.length <  12 || this.cardNumber.length >  16){
     this.componentService.presentToast('Please enter valid card number.','danger')
       }
       else{
         var date;
         if(this.data.totalprice){
         date = this.expiryDate.split('-');
         this.paynow = {
           card_number :  this.cardNumber,
           cvv : this.cvv,
           zip: this.zip,
           expiry_month: date[1],
           expiry_year:date[0],
           name:localStorage.getItem('userName'),
           package_price:this.package,
           license_count:this.license,
           package_interval:this.interval,
           userId:localStorage.getItem('userinfo'),
           package_id:this.packId,
           is_recurring_billing:this.is_recurring_billing,
           license_amount: this.data.license_amount,
           amount: this.data.license_amount,
           is_company: '1',
           companyArr: this.data.companyArr
         }
 
          this.componentService.showLoader();
          let body = JSON.stringify(this.paynow);
           let headers = new Headers({ 'Content-Type': 'application/json' });
           var pay_api = this.is_recurring_billing == '1' ? this.PayAuthRecurringSignup : this.PayAuth; 
           return this.http.post(this.API_ENDPOINT_URL+pay_api, body)
             .subscribe((data:any) => {
               if(data.status == 0){
                   this.componentService.dismissLoader()
                   this.componentService.presentToast(data.error.errorMessage,'danger')
                     }else{
                 if(this.is_recurring_billing == '1'){
                   this.paynow['transactionId'] = data.data.SubscriptionId;
                 }
                 else{
                   this.paynow['transactionId'] = data.data.transactionId;
                 }
                 let body = JSON.stringify(this.paynow);
                   return this.http.post(this.API_ENDPOINT_URL+this.addPayment +'/' +localStorage.getItem('userinfo')+'/0', body).subscribe((data:any) => {
                       // console.log(data);
                       if(data.status == 1){
                         return this.http.post(this.API_ENDPOINT_URL+this.addLicense +'/' +localStorage.getItem('userinfo'), body).subscribe((data:any) => {
                            // console.log(data);
                            if(data.status == 1){
                               this.componentService.dismissLoader()
                   this.componentService.presentToast('Your package has been upgraded successfully.','success')
                             localStorage.setItem('job_alert_popup','1');
                             this.navCtrl.navigateRoot(['dashboard',0]);
                            }else{
                               this.componentService.dismissLoader()
                               this.componentService.presentToast('Error while upgrading your Subscription. Plz try later.','danger');
                            } 
                         },
                         err => {
                               this.componentService.dismissLoader();
                             this.showTechnicalError('1');
                         });
                       }else{
                           this.componentService.dismissLoader();
                           this.componentService.presentToast('Error while adding payment details.Plz try later','success');
                          
                       }
                 },
                 err => {
                       this.componentService.dismissLoader();
                     this.showTechnicalError('1');
                 });
               }
             },
             err => {
                   this.componentService.dismissLoader();
                 this.showTechnicalError('1');
             });
         }else if (this.data.type == 'extra'){
 ///////////////////////////////////////////////////////////////////////////////
               date = this.expiryDate.split('-');
               this.paynow = {
                 card_number :  this.cardNumber,
                 cvv : this.cvv,
                 zip: this.zip,
                 expiry_month: date[1],
                 expiry_year:date[0],
                 name:localStorage.getItem('userName'),
                 package_price:this.package,
                 license_count:this.license,
                 package_interval:this.interval,
                 userId:localStorage.getItem('userinfo'),
                 package_id:this.packId
               }
              this.componentService.showLoader();
               
            let body = JSON.stringify(this.paynow);
                 return this.http.post(this.API_ENDPOINT_URL+this.PayAuthRecurring, body)
                 .subscribe((data:any) => {
                   if(data.status == 0){
                      this.componentService.dismissLoader();
                      this.componentService.presentToast(data.error.description,'danger');
                     
                   }
                   else if(data.status == 1){
                      this.paynow = {
                         card_number :  this.cardNumber,
                         cvv : this.cvv,
                         zip: this.zip,
                         expiry_month: date[1],
                         expiry_year:date[0],
                         name:localStorage.getItem('userName'),
                         amount:this.package,
                         license_count:this.license,
                         package_interval:this.interval,
                         userId:localStorage.getItem('userinfo'),
                         package_id:this.packId,
                         transactionId:data.data.SubscriptionId,
                         create_new: this.create_new,
                         companyId: this.companyId,
                         company_name: this.company_name        
                       }
                      let body = JSON.stringify(this.paynow);
                      let headers = new Headers({ 'Content-Type': 'application/json' });
                       return this.http.post(this.API_ENDPOINT_URL+this.addExtraUserLicense +'/' +localStorage.getItem('userinfo'), body).subscribe((data:any) => {
                            var responsedata = data
                            if(data.status == 1){
                                 this.componentService.dismissLoader()
                                 this.componentService.presentToast('Licenses has been added succesfully','success')
                                 this.navCtrl.navigateForward('license', responsedata);
 
                               }
                          },
                           err => {
                                 this.componentService.dismissLoader();
                               this.showTechnicalError('1');
                           });
                   }
                 },
                 err => {
                       this.componentService.dismissLoader();
                     this.showTechnicalError('1');
                 });
 ///////////////////////////////////////////////////////////////////////////////
         }else{
             // console.log('extraspace');
         date = this.expiryDate.split('-');
         this.paynow = {
           card_number :this.cardNumber,
           cvv : this.cvv,
           zip: this.zip,
           expiry_month: date[1],
           expiry_year:date[0],
           name:localStorage.getItem('userName'),
           package_price:this.data.final_price == '' ? this.data.price : this.data.final_price,
           userId:localStorage.getItem('userinfo'),
           package_id:this.data._id
         }
        // console.log(this.paynow);
         this.componentService.showLoader();
           
        let body = JSON.stringify(this.paynow);
           let headers = new Headers({ 'Content-Type': 'application/json' });
             return this.http.post(this.API_ENDPOINT_URL+this.PayAuth, body)
             .subscribe((data:any) => {
                   this.componentService.dismissLoader()
               // console.log(data);
               if(data.status == 0){
                this.componentService.presentToast(data.error.errorMessage,'danger')
                 }else if(data.status == 1){
                   this.adddata = {
                     amount:this.data.final_price == '' ? this.data.price : this.data.final_price,
                     userId:localStorage.getItem('userinfo'),
                     packId:this.data._id,
                     type:this.data.type,
                     data:this.data.data,
                     transactionId:data.data.transactionId
                   }
 
                 // console.log(this.adddata);
                 let body = JSON.stringify(this.adddata);
                 let headers = new Headers({ 'Content-Type': 'application/json' });
                 return this.http.post(this.API_ENDPOINT_URL+this.addUserSpacePackage, body)
                    .subscribe((data:any) => {
                     // console.log(data);
                     if(data.status == 1){
                         this.componentService.dismissLoader();
                         this.componentService.presentToast('Space package has been upgraded succesfully.','success')
                       
                          this.navCtrl.navigateRoot(['dashboard', 0]);
 
                     }
                   },
                   err => {
                         this.componentService.dismissLoader();
                       this.showTechnicalError('1');
                   });
               }
             },
             err => {
                   this.componentService.dismissLoader();
                 this.showTechnicalError('1');
             });
         }
       }
   }
 
 
   root(){
     this.navCtrl.navigateRoot('dashboard');
   };
 
   licenseTo(){
     this.navCtrl.navigateRoot('license');
   };
 
   addlicense(){
     this.navCtrl.navigateRoot('AddmorelicensePage');
   }
 
   upgradePayment(){
     this.navCtrl.navigateRoot('pricing');
   };
 
   extraSpace(){
     this.navCtrl.navigateRoot('extraspace');
   };
 
   
 }