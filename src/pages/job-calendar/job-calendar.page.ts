import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { Router } from '@angular/router';
import { AddeventPage } from '../addevent/addevent.page';
@Component({
  selector: 'app-job-calendar',
  templateUrl: './job-calendar.page.html',
  styleUrls: ['./job-calendar.page.scss'],
})
export class JobCalendarPage {
  job_id: string;
  eventSource: any = [];
  viewTitle;
  my_events: any;
  currentDate: any;
  all_events: any;
  curr_year: any;
  allYears: any;
  trades: any;
  showTradeB: any;
  isToday: boolean;
  add_disabled: boolean;
  isBrowser = localStorage.getItem('isBrowser');
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  stateData:any='';
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public APIService: APIService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private componentService: ComponentService,
    public router:Router) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    var job_id = this.stateData['job_id'];
    if (this.stateData['from'] == 'trade') {
      this.showTradeB = '1';
    }
    else {
      this.showTradeB = '0';
    }
    this.job_id = job_id;
    var todatDt = new Date();
    var eventMsg = '0';
    this.initializeCalendar(todatDt, eventMsg);
    this.getAllYears();
    this.APIService.getData('trades', this.job_id).subscribe((data) => {
      this.trades = data;
    },
      err => {
        this.showTechnicalError();
      });
  }
  initializeCalendar(pickDate, eventMsg) {
    this.APIService.getData('getCalendarEvents', this.job_id + '/jobs').subscribe((all_events) => {
      this.all_events = all_events;
      var myDate = pickDate;
      var mnth = myDate.getMonth() + 1;
      var dte = myDate.getDate();
      mnth = (mnth + "").length > 1 ? mnth : "0" + mnth;
      dte = (dte + "").length > 1 ? dte : "0" + dte;
      var selectedDate = (myDate.getFullYear() + '-' + mnth) + '-' + dte;
      this.currentDate = selectedDate;
      var my_events: any = [];
      var eventSource: any = [];
      this.all_events.forEach(function (event) {

        if (selectedDate == event.start_date) {
          my_events.push(event);
        }
        eventSource.push({
          title: event.event_title,
          startTime: new Date(event.start_date.split('-')[0], (Number(event.start_date.split('-')[1]) - 1), (Number(event.start_date.split('-')[2]))),
          endTime: new Date(event.start_date.split('-')[0], (Number(event.start_date.split('-')[1]) - 1), (Number(event.start_date.split('-')[2]))),
          allDay: true,
          color: 'primary',
          message: event.event_description
        });

      });
      this.my_events = my_events;
      this.eventSource = eventSource;
      console.log(this.eventSource)
      if (eventMsg == '1') {
        this.componentService.presentToast('Event Added.', 'success');
      }
      if (eventMsg == '2') {
        this.componentService.presentToast('Event Deleted.', 'success');
      }
      if (eventMsg == '3') {
        this.componentService.presentToast('Event Updated.', 'success');
      }
    },
      err => {
        this.showTechnicalError('1');
      });
  }

  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  getAllYears() {
    var cur_year = new Date().getFullYear();
    this.curr_year = cur_year;
    var last_year = new Date().getFullYear() + 50;
    var i;
    var allYears: any = [];
    for (i = cur_year; i <= last_year; i++) {
      allYears.push(i);
    }
    this.allYears = allYears;
  }

  async add_new_event(myEvent14) {
    let modal = await this.modalCtrl.create({
      component: 'AddeventPage',
      componentProps: {
        current_date: this.currentDate, isAdd: '1', isTrade: '1', trades: this.trades, all_events: this.all_events
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if (data != undefined) {
        this.componentService.showLoader();
        var selectedDate = data.start_date;
        this.calendar.currentDate = new Date(selectedDate);
        this.APIService.sendData('addSingleCalendarEvent' + this.job_id + '0', data).subscribe((formdata) => {
          var eventMsg = '1';
          this.componentService.dismissLoader();
          this.initializeCalendar(this.calendar.currentDate, eventMsg);
        },
          err => {
            this.componentService.dismissLoader();
            this.showTechnicalError('1');
          });
      }
    });
    modal.present();

  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  goPreviousMonth() {
    this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() - 1));
    this.curr_year = this.calendar.currentDate.getFullYear();
  }

  goNextMonth() {
    this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() + 1));
    this.curr_year = this.calendar.currentDate.getFullYear();
  }

  goYear(choosed_year) {
    this.calendar.currentDate = new Date(this.calendar.currentDate.setFullYear(choosed_year));
  }

  onTimeSelected(ev) {
    var myDate = ev.selectedTime;
    var mnth = myDate.getMonth() + 1;
    var dte = myDate.getDate();
    mnth = (mnth + "").length > 1 ? mnth : "0" + mnth;
    dte = (dte + "").length > 1 ? dte : "0" + dte;
    var selectedDate = (myDate.getFullYear() + '-' + mnth) + '-' + dte;
    this.currentDate = selectedDate;
    var my_events: any = [];
    if (this.all_events != '' && this.all_events != undefined) {
      this.all_events.forEach(function (event) {
        if (selectedDate == event.start_date) {
          my_events.push(event);
        }
      });
    }
    this.my_events = my_events;

  }

  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
    if (event.getTime() < today.getTime()) {
      this.add_disabled = true;
      this.componentService.presentToast('Please select future date to add event.', 'danger');

    }
    else {
      this.add_disabled = false;
    }
  }
  async deleteEvent(event_id) {
    let confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {

            this.componentService.showLoader();
            this.APIService.getData('deleteCalendarEvent', event_id).subscribe((deleted: any) => {
              if (deleted.status == 1) {
                this.componentService.dismissLoader();
                var eventMsg = '2';
                this.initializeCalendar(this.calendar.currentDate, eventMsg);
              }
              else {
                this.componentService.dismissLoader();
                this.componentService.presentToast('Error, plz try later.', 'danger');
              }
            },
              err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
              });
          }
        }
      ]
    });
    confirm.present();
  }
  async editEvent(event, event_id) {
    let modal = await this.modalCtrl.create({
      component: AddeventPage,
      componentProps: {
        event_id: event_id, isEdit: '1', eve: event, isTrade: '1', trades: this.trades, all_events: this.all_events
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if (data != undefined) {
        this.componentService.showLoader();
        var selectedDate = data.start_date;
        this.calendar.currentDate = new Date(selectedDate);
        this.APIService.sendData('editCalendarEvent' + event_id, data).subscribe((formdata) => {
          var eventMsg = '3';
          this.componentService.dismissLoader();
          this.initializeCalendar(this.calendar.currentDate, eventMsg);
        },
          err => {
            this.componentService.dismissLoader();
            this.showTechnicalError('1');
          });
      }
    });
    modal.present();
  }
  root() {
    this.navCtrl.navigateRoot(['dashboard', 0]);
  };

  goToJobs() {
    this.navCtrl.navigateForward('managejob', {
      state: {
        is_direct: '0'
      }
    });
  };

  backToPage() {
    this.modalCtrl.dismiss();
  }

  backToTradeDash() {
    this.navCtrl.navigateForward('trade-dashboard', {
      state: {
        back: '1'
      }
    });
  }
  onEventSelected(evn){

  }
}
