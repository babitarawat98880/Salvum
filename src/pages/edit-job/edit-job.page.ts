import { Component, OnInit } from '@angular/core';
import { NavController, NavParams , AlertController,ToastController,ModalController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.page.html',
  styleUrls: ['./edit-job.page.scss'],
})
export class EditJobPage  {
  ob_id : any='';
  job_id:any='';
  job_number : any='';
  job_title : string;
  companyId : string;
  status : string;
  companies : any;
  privileges : any;
  sharedUsers : any;
  form: FormGroup;
  ses_companyId: any = localStorage.getItem('switched_comp');
    constructor(public navCtrl: NavController, 
      public navParams: NavParams , 
      public APIService: APIService, 
      public componentService: ComponentService, 
      public alertCtrl: AlertController, 
      public toastCtrl: ToastController,
      public modalController: ModalController, 
      private formBuilder:FormBuilder) {
        this.form = this.formBuilder.group({
          job_number: ['', [Validators.required]],
          job_title: ['', [Validators.required]],
          companyId: ['', [Validators.required]],
          status: ['', [Validators.required]]
        });
      var userId = localStorage.getItem('userinfo');
      this.componentService.showLoader();
      this.APIService.getData('userCompanyDetails', userId+'/'+this.ses_companyId).subscribe((companies)=>{
        this.companies=companies;
      },
      err => {
          this.componentService.dismissLoader();
          this.showTechnicalError();
      });
  
      var job_id = navParams.get('job_id'); 
      this.job_id = job_id;
  
      this.APIService.getData('jobDetails',this.job_id).subscribe((jobdetails:any)=>{
        jobdetails = jobdetails[0];
        this.job_number = jobdetails.job_number;
        this.job_title = jobdetails.job_title;
        this.companyId = jobdetails.companyId;
        this.status = jobdetails.status;
        this.privileges = jobdetails.privileges;
        this.sharedUsers = jobdetails.sharedArr;
        this.componentService.dismissLoader();
      },
      err => {
          this.componentService.dismissLoader();
          this.showTechnicalError();
      });
  
     
  
    }
  
    ionViewDidLoad() {
      // console.log('ionViewDidLoad EditjobPage');
    }
   dismiss() {
      this.modalController.dismiss();
    }
    editJob(){
      for (let i in this.form.controls) {
        this.form.controls[i].markAsTouched();
      }
      if(this.form.valid){
        this.componentService.showLoader();
          this.APIService.sendData('editJob/'+this.job_id, this.form.value).subscribe((formdata:any)=>{
          if(formdata.status == '1'){
            this.componentService.dismissLoader();
            this.componentService.presentToast('Job updated successfully.','success');
            this.form.reset();
            this.modalController.dismiss('1');
          }
          else if(formdata.status == '2')
          {
            this.componentService.dismissLoader();
            this.componentService.presentToast('Job/PO number already exists.','danger');
          }
          else
          {
            this.componentService.dismissLoader();
            this.componentService.presentToast( 'Error, plz try later.','danger');
          }
        
        },
        err => {
            this.componentService.dismissLoader();
            this.showTechnicalError('1');
        });
      }
    }
  
    changeSharedPrivileges(userId,priv)
    {
      this.componentService.showLoader();
        var d = {
          jobId: this.job_id,
          userId:userId,
          priv:priv
        }
          this.APIService.sendData('changeSharedPrivileges',d).subscribe((formdata:any)=>{
          if(formdata.status == '1')
          {
            this.componentService.dismissLoader();
            this.componentService.presentToast(  'Information updated successfully.','success');
           }
          else
          {
            this.componentService.dismissLoader();
            this.componentService.presentToast('Error, plz try later.','danger');
          }
        
        },
        err => {
            this.componentService.dismissLoader();
            this.showTechnicalError('1');
        });
    }
  
    showTechnicalError(type:any= null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast( 'Technical error, Please '+msg,'info');
    }
    get f()
{
    return this.form.controls;
}
  }
  