import { Component, OnInit } from '@angular/core';
import { NavController, NavParams , ModalController, AlertController,ToastController,LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.page.html',
  styleUrls: ['./addevent.page.scss'],
})
export class AddeventPage {
  form: FormGroup;
  start_date: any;
  event_tagline: any;
  event_time: any;
  tradeId: any;
  event_title: any;
  event_description: any;
  main_page_title: any;
  min_date: any;
  max_date: any;
  all_events_name: any;
  trades: any;
  isTrade: any;
  all_events: any;
  stateData:any='';
    constructor(
      public navCtrl: NavController, 
      public modalController: ModalController, 
      public APIService: APIService, 
      public alertCtrl: AlertController, 
      public toastCtrl: ToastController,
      public componentService: ComponentService,
      public router:Router,
      private formBuilder:FormBuilder) {
      var token;
      this.stateData = this.router.getCurrentNavigation()?.extras.state;
      this.all_events_name = this.stateData['all_events_name'];
      if(this.stateData.isTrade == '1'){
        this.isTrade = '1';
        this.trades = this.stateData['trades'];
        this.all_events = this.stateData['all_events'];
        
      }
      if(this.all_events_name == '' || this.all_events_name == null || this.all_events_name == undefined){
        this.all_events_name = [];
      }
        if(this.stateData['event_id'] != undefined)
        { 
          this.main_page_title = 'Edit Event';
          var event_id = this.stateData['event_id'];
         this.componentService.showLoader();
          this.APIService.getData('CalendarDetails',event_id).subscribe((eventdetail:any)=>{
            this.componentService.dismissLoader();
            this.start_date = eventdetail.data.start_date;
            this.event_tagline = eventdetail.data.event_tagline;
            this.event_time = eventdetail.data.event_time;
            this.tradeId = eventdetail.data.tradeId;
            this.event_title = eventdetail.data.event_title;
            this.event_description = eventdetail.data.event_description;
            // token = eve.random;
            this.all_events_name.splice( this.all_events_name.indexOf(this.event_tagline), 1 );
            if(this.stateData['isTrade'] == '1'){
              this.get_events_names();
            }
          },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError();
            });
        }
        else
        {
          this.main_page_title = 'Add Event';
          this.start_date = this.stateData['current_date'];
          if(this.stateData['isEdit'] == '1'){
            this.main_page_title = 'Add Event';
            var eve = this.stateData['eve'];
            this.start_date = eve.start_date;
            this.tradeId = eve.tradeId;
            this.event_tagline = eve.event_tagline;
            this.event_time = eve.event_time;
            this.event_title = eve.event_title;
            this.event_description = eve.event_description;
            token = eve.random; 
          }
        }
  
        if(this.stateData['isAdd'] == '1'){
          token = Math.floor(Math.random() * 100000);
        }
  
        this.min_date = this.getToday();
        this.max_date = this.getFullYear() + 30;
        
        if(this.isTrade == '1'){
          this.form = this.formBuilder.group({
            _id: [null, []],
            start_date: ['', [Validators.required]],
            event_tagline: ['', [Validators.required]],
            event_time: ['', [Validators.required]],
            event_title: ['', [Validators.required]],
            event_description: ['', [Validators.required]],
            tradeId: ['', [Validators.required]],
            random: [token, []]
          });
        }
        else{
          this.form = this.formBuilder.group({
            _id: [null, []],
            start_date: ['', [Validators.required]],
            event_tagline: ['', [Validators.required]],
            event_time: ['', [Validators.required]],
            event_title: ['', [Validators.required]],
            event_description: ['', [Validators.required]],
            random: [token, []]
          });
        }
        
    }
    get f()
    {
        return this.form.controls;
    }
    get_events_names(){
      var tradeId = this.tradeId;
      if(this.all_events != ''){
        var all_events_name:any = [];
        this.all_events.forEach(function(eve){
          if(eve.tradeId == tradeId){
            all_events_name.push(eve.event_tagline);
          }
        });
        this.all_events_name = all_events_name;
        if(this.stateData['event_id'] != undefined){
          this.all_events_name.splice(this.all_events_name.indexOf(this.event_tagline), 1 );
        }
        console.log(this.all_events_name)
      } 
    }
  
    getToday(){
     var today,dd,mm = '';
     today = new Date();
     dd = today.getDate();
     mm = today.getMonth()+1; //January is 0!
  
    var yyyy = today.getFullYear();
    if(dd < '10'){
        dd='0'+dd;
    } 
    if(mm < '10'){
        mm='0'+mm;
    } 
    return today = yyyy+'-'+mm+'-'+dd;
    }
  
    getFullYear(){
      var today,year = '';
      today = new Date();
      year = today.getFullYear();
      return year; 
    }
  
    showTechnicalError(type = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast('Technical error, Please '+msg,'info');
    }
  
    dismiss()
    {
      this.modalController.dismiss();
    }
    addCalendarEvent(){ 
      for (let i in this.form.controls) {
        this.form.controls[i].markAsTouched();
      }
      if(this.form.valid){
        console.log(this.all_events_name)
        if(this.form.value.event_tagline == 'Bid Deadline') {
          if(this.all_events_name.indexOf(this.form.value.event_tagline) >= 0){
            this.componentService.presentToast('You can add only one bid deadline for this trade.','danger');
          }
          else{
            this.modalController.dismiss(this.form.value);
          }
        }
        else{
          this.modalController.dismiss(this.form.value);
        }
      }
    }
  }
  