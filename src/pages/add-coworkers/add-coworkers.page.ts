import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
@Component({
  selector: 'app-add-coworkers',
  templateUrl: './add-coworkers.page.html',
  styleUrls: ['./add-coworkers.page.scss'],
})
export class AddCoworkersPage {
  all_employees:any;
  companyId: any = localStorage.getItem('switched_comp');
  userId: any = localStorage.getItem('userinfo');
  selected_contacts:any = [];
  jobId:any;
  already:any;
  alltrades:any;
    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams, 
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController, 
      public APIService: APIService, 
      public modalController: ModalController,
      public componentService:ComponentService) {
      this.jobId = navParams.get('jobId');
      this.already = navParams.get('already');
      console.log(this.already)
    }
  
    ngOnInit() {
       this.getExistingEmployees();
       this.getAllTrades();
    }
  
    getAllTrades(){
    this.APIService.getData('trades',this.jobId).subscribe((alltrades)=>{
        this.alltrades = alltrades;
    },
    err => {
      this.alltrades = [];
        this.showTechnicalError();
    });
    }
  
    getExistingEmployees(){
      var self = this;
      this.componentService.showLoader();
      var all_employees :any= [];
      var loginId = this.userId;
      this.APIService.getData('associateEmployeesList',this.companyId+'/'+this.userId).subscribe((employees)=>{
        this.all_employees=employees;
         if(this.all_employees != ''){
          this.all_employees.forEach(function(emp){
            if(emp.status == 1 && emp.fromId != emp.toId){
              var userId = (loginId == emp.fromId) ? emp.toId : emp.fromId;
                if(self.already.indexOf(userId) == -1){
                  var obj = {
                    name : emp.employee_name,
                    userId : userId,
                    email : emp.employee_email,
                    privilege : 0
                  }
                  all_employees.push(obj);
                }
              }
          });
        }
        this.all_employees = all_employees;
        console.log(this.all_employees)
         this.componentService.dismissLoader();
      },
      err => {
           this.componentService.dismissLoader();
          this.showTechnicalError();
      });
    }
  
      addCoworkers(tradeId){
          this.componentService.showLoader();
          var coArr :any=[];
          this.selected_contacts.forEach(function(contact){
            // tradeId.forEach(function(trade_id){
              coArr.push({
                  userId : contact.userId,
                  privilege : contact.privilege,
                  tradeId : (tradeId == '' || tradeId == undefined || tradeId == null) ? 0 : tradeId,
                  unique_id : Math.floor(Math.random() * 100000)
              }); 
            // });
          });
          console.log(coArr);
  
          this.APIService.sendData('addCoworkers',{coworkers : coArr, jobId : this.jobId}).subscribe((employee:any)=>{
              if(employee.status == '1'){
                 this.componentService.dismissLoader();
                 this.componentService.presentToast('Co-workers added successfully.','success');
                 this.dismiss('1');
              }
              else{
                 this.componentService.dismissLoader();
                 this.componentService.presentToast('Error, plz try later.','danger');
              }
          },
          err => {
               this.componentService.dismissLoader();
              this.showTechnicalError('1');
          }); 
      // }
      }
  
      insertContactToArray(ev,contact){
        var event = ev.target
        if(event.checked == true){
          this.selected_contacts.push(contact);
        }
        else{
          this.removeArray(this.selected_contacts, contact);
        }
    }
  
    removeArray(arr,what) {
       var a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }
  
      showTechnicalError(type:any = null){
        var msg = (type == '1') ? 'try later.' : 'reload the page.'
        this.componentService.presentToast( 'Technical error, Please '+msg,'info');
    }
  
    dismiss(data:any = null){
      this.modalController.dismiss(data);
    }
  
  }
  