import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
// import { AddmorelicenseserviceProvider } from '../../providers/addmorelicenseservice/addmorelicenseservice';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss'],
})
export class PricingPage {
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  upgradePackage = 'packages'; 
  packageArr: Array<{}>;
  lincesArr: Array<{}>;
  index: number;
  licenses: string;
  license_amount: any = 0;
  data: number;
  newprice: number;
  finalprice: number;
  licen: any;
  companies: any;
  spliceData: any;
  isBrowser:any;
  package_interval: number;
  subscription_amount: any;
  check_value:any = '0';
  companyId:any;
  isVisible:Boolean = true;
  companyArr:any = {};
  company_name:any;
  userId: any = localStorage.getItem('userinfo');
    constructor(
      public navCtrl: NavController,
      public http:HttpClient,
      // public AddmorelicenseserviceProvider: AddmorelicenseserviceProvider,
      public APIService: APIService,
      public componentService: ComponentService) {
       var userId = localStorage.getItem('userinfo');
       this.APIService.getData('getUserCurrentSubscription',userId).subscribe((subscription:any)=>{  
        this.subscription_amount = subscription.amount;
      },
      err => {
          this.showTechnicalError();
      });
        this.getUserCompanies();
    }
  
    ngOnInit() {
    this.isBrowser = localStorage.getItem('isBrowser');
      this.index = 0;
      this.newprice = 0;
      this.package_interval = 30;
    this.componentService.showLoader();
    console.log(this.API_ENDPOINT_URL+this.upgradePackage)
          return this.http.get(this.API_ENDPOINT_URL+this.upgradePackage )
              .subscribe((data:any) => {
                this.componentService.dismissLoader();
                 this.packageArr = data;
                 var newprices:any= []
                 for (var i = 0; i < this.packageArr.length; i++) {
                      newprices.push(this.packageArr[1]);
                      this.finalprice = newprices[0].price
                  }
                  this.APIService.get('licenses').subscribe((data:any)=>{
                   this.lincesArr = data;
                         this.componentService.dismissLoader();
                    },
                    err => {
                        this.componentService.dismissLoader();;
                        this.showTechnicalError();
                    });
              },
              err => {
                  this.componentService.dismissLoader();;
                  this.showTechnicalError();
              });
  
    };
  
    showTechnicalError(type = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');
     
    }
  
    getUserCompanies(){
      this.APIService.getData('userCompaniesList',this.userId).subscribe((companies)=>{
        this.companies=companies;
        if(companies == ''){
          this.check_value = '1';
          this.isVisible = false;
        }
      },
      err => {
          this.showTechnicalError();
      });
    }
  
  
    changePrice(index, interval){
      this.package_interval = interval;
      var newprices :any= []
      this.index = index;
      for (var i = 0; i < this.packageArr.length; i++) {
        newprices.push(this.packageArr[1]);
        if(this.index == 0){
           this.finalprice = Number(newprices[0].price) + this.newprice
          }else if(this.index == 1){
           this.finalprice = Number(newprices[0].price1)+ this.newprice
          }else if(this.index == 2){
           this.finalprice = Number(newprices[0].price2)+ this.newprice
          }else if(this.index == 3){
           this.finalprice = Number(newprices[0].price3)+ this.newprice
          }else{
  
          }
      }
    }
  
    addPrice(itemprice){
     var newprices:any = []
     var price = itemprice.split('/')
     this.newprice = Number(price[1]);
      for (var i = 0; i < this.packageArr.length; i++) {
        newprices.push(this.packageArr[1]);
        if(this.index == 0){
           this.finalprice = Number(newprices[0].price) + this.newprice 
          }else if(this.index == 1){
           this.finalprice = Number(newprices[0].price1) + this.newprice 
          }else if(this.index == 2){
           this.finalprice = Number(newprices[0].price2) +this.newprice
          }else if(this.index == 3){
           this.finalprice = Number(newprices[0].price3) + this.newprice
          }else{
          }
      }
    };
  
    Purchase(data,is_recurring_billing){
  
      if(this.check_value == '0'){
        if(this.companyId == '' || this.companyId == undefined){
          this.componentService.presentToast('Please select company.','danger');
           return false;
        }
      }
      else{
        this.companyArr.company_name = this.company_name;
        this.companyArr.create_new = '1';
        this.companyArr.companyId = null;
      }
      if(this.check_value == '1'){
        if(this.company_name == '' || this.company_name == undefined){
          this.componentService.presentToast('Please enter company name.', 'danger');
            return false;
        }
      }
      else{
        this.companyArr.companyId = this.companyId;
        this.companyArr.create_new = '0';
      }
  
      this.companyArr.isAlreadyCompany = this.isVisible;
  
      is_recurring_billing = is_recurring_billing == true ? '1' : '0';
      var price:any = []
      for (var i = 0; i < this.packageArr.length; i++) {
          price.push(this.packageArr[1]);
          if(this.index == 0){
             this.data = price[0].price
            }else if(this.index == 1){
             this.data = price[0].price1
            }else if(this.index == 2){
             this.data = price[0].price2
            }else if(this.index == 3){
             this.data = price[0].price3
            }else{
  
            }
      }
      if(this.licenses){
         this.licen = this.licenses.split('/');
         this.spliceData = this.licen[0];
         this.license_amount = this.licen[1];
      }
  
      var totalPrice = {
        license:this.spliceData,
        license_amount:this.license_amount,
        totalprice:this.finalprice,
        interval:this.package_interval,
        packId :data._id,
        is_recurring_billing:is_recurring_billing,
        companyArr: this.companyArr
      };
      localStorage.setItem('preState', 'pricing')
     this.navCtrl.navigateForward('PaymentPage', {state:{ totalPrice }});
    };
  
    openExtraspacePage(){
     this.navCtrl.navigateForward('extraspace');
    };
  
    root(){
      this.navCtrl.navigateRoot(['dashboard',0]);
    };
  }