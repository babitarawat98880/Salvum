import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { ContactslistPage } from 'src/pages/contactslist/contactslist.page';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.page.html',
  styleUrls: ['./add-job.page.scss'],
})
export class AddJobPage implements OnInit {
  timestamp: any;
  job_number: any;
  job_title: any;
  fixed_div_height: any;
  companies: any;
  all_employees: any;
  already: any = [];
  // form: FormGroup;
  step: any = '1';
  isSkip: Boolean = false;
  isLast: Boolean = false;
  companyId: any = localStorage.getItem('switched_comp');
  new_jobId: any;
  userId: any;
  cowerkers: any = [];
  roles: any = [];
  enable_level1: any;
  enable_level2: any;
  enable_level3: any;
  enable_level4: any;
  allowed_levels: any;
  all_emps: any;
  validators: any;
  errorMessages: any;
  all_contacts: any = [];
  all_roles:any = [];
  all_coworkers:any=[];
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public componentService: ComponentService,
    public APIService: APIService,
    public modalCtrl: ModalController) {
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.userId = localStorage.getItem('userinfo');
    this.validators = [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')];
    this.errorMessages = {
      pattern: 'Please enter valid email address.'
    }
  }
  ngOnInit() {
    this.getExistingEmployees();
  }

  ionViewDidLoad() {
    var fixed_div = document.getElementById("calc_height" + this.timestamp);
    if (fixed_div != null) {
      this.fixed_div_height = fixed_div.offsetHeight;
      var f: any = document.getElementById('custom_height' + this.timestamp);
      f.style.marginTop = this.fixed_div_height + 'px';
    }
  }

  ionViewCanLeave() {
    $(".ng2-dropdown-menu").css('display', 'none');
    $(".ng2-dropdown-backdrop").remove();
  }

  dismiss(status = null) {
    this.modalCtrl.dismiss(status);
    // this.viewCtrl.dismiss(status);
  }

  next(type) {
    if (this.step == 1) {
      if (this.job_number == undefined || this.job_number == null || this.job_number == '') {
        this.componentService.presentToast('Job/PO is required.', 'danger');
        return false;
      }
      else {
        this.step = Number(this.step) + 1;
        this.action(type);
      }
    }
    else if (this.step == 2) {
      if (this.job_title == undefined || this.job_title == null || this.job_title == '') {
        this.componentService.presentToast('Job title is required.', 'danger');
        return false;
      }
      else {
        this.addJob(type);
        // this.step = Number(this.step) + 1;
        // this.action(type);
      }
    }
    else if (this.step == 3) {
      if (type == '0') {
        this.step = Number(this.step) + 1;
        this.action(type);
      }
      else {
        if (this.cowerkers.length == 0) {
          this.componentService.presentToast('Please select atleast one co-worker.', 'danger');
          return false;
        }
        else {
          this.addCoworkers(type);
        }
      }
    }
    else if (this.step == 4) {
      if (this.roles.length == 0) {
        this.step = Number(this.step) + 1;
        this.action(type);
      }
      else {
        this.addRoleContacts(type);
      }
    }
    else {
      this.step = Number(this.step) + 1;
      this.action(type);
    }

  }

  finish() {
    this.next('1');
  }

  action(type) {
    $(".job_steps").fadeOut("slow");
    var self = this;
    setTimeout(function () {
      $(".step" + self.step).fadeIn("slow");
      if (self.step == 3) {
        self.isSkip = true;
      }
      if (self.step == 4) {
        self.isLast = true;
      }
    }, 1000);
  }

  onCoworkerAdd(contact) {
    this.cowerkers.push(contact);
  }

  removeCoworker(contact) {
    this.removeArray(this.cowerkers, contact);
  }

  onRolesAdd(contact) {
    contact.privilege = 0;
    this.roles.push(contact);
  }

  removeRoles(contact) {
    this.removeArray(this.roles, contact);
  }

  removeArray(arr, what) {
    var a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  getEmployees() {
    var All_contacts: any = [];
    this.allowed_levels = [];
    var levels_array: any = JSON.parse(localStorage.getItem('alllevel') || '');
    if (levels_array) {
      levels_array.forEach((value) => {
        var decrypted = CryptoJS.AES.decrypt(value, this.userId);
        if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
          this.enable_level1 = 'false';
        } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
          this.enable_level2 = 'false';
        } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
          this.enable_level3 = 'false';
        } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
          this.enable_level4 = 'false';
        } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
          this.enable_level1 = 'true';
          this.enable_level2 = 'true';
          this.enable_level3 = 'true';
          this.enable_level4 = 'true';
        }
      });
    }

    if (this.enable_level1 == 'false') {
      this.allowed_levels.push('1');
    }
    if (this.enable_level2 == 'false') {
      this.allowed_levels.push('2');
    }
    if (this.enable_level3 == 'false') {
      this.allowed_levels.push('3');
    }
    if (this.enable_level4 == 'false') {
      this.allowed_levels.push('4');
    }
    var self = this;
    var allowed_levels = this.allowed_levels;
    this.APIService.getData('getContactList', this.userId).subscribe((allContacts: any) => {
      allContacts.forEach(function (data) {
        if (data.memberstatus == '2' && data.senderSetLevelStatus == '1' && data.recevierSetLevelStatus == '1') //data.amount > 0
        {
          var allow_level = '';
          if (data.senderId != self.userId) {
            allow_level = data.reciverSetLevel;
          }
          else {
            allow_level = data.senderSetLevel;
          }
          if (allowed_levels.indexOf(allow_level) >= 0) {
            data.privilege = '0';
            All_contacts.push(data);
          }
        }
      });
      // this.all_contacts = All_contacts;
      this.all_emps = All_contacts;
    },
      err => {
        this.showTechnicalError();
      });
  }

  addJob(type) {
    this.componentService.showLoader();
    var userId = localStorage.getItem('userinfo');
    var data = {
      job_number: this.job_number,
      job_title: this.job_title,
      company_id: localStorage.getItem('switched_comp')
    }
    this.APIService.sendData('jobs/' + userId, data).subscribe((formdata: any) => {
      if (formdata.status == '1') {
        this.componentService.dismissLoader();
        this.componentService.presentToast('Job added successfully.', 'success')
        this.new_jobId = formdata.data._id;
        this.step = Number(this.step) + 1;
        this.action(type);
      }
      else if (formdata.status == '2') {
        this.componentService.dismissLoader();
        this.componentService.presentToast('Job/PO number already exists.', 'danger');
        this.step = Number(this.step) - 1;
        this.action(type);
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

  addCoworkers(type) {
    this.componentService.showLoader();
    var coArr: any = [];
    this.cowerkers.forEach(function (contact) {
      coArr.push({
        userId: contact.userId,
        privilege: contact.privilege,
        tradeId: [],
        unique_id: Math.floor(Math.random() * 100000)
      });
    });
    this.APIService.sendData('addCoworkers', { coworkers: coArr, jobId: this.new_jobId }).subscribe((employee: any) => {
      if (employee.status == '1') {
        this.componentService.dismissLoader();
        this.componentService.presentToast('Co-workers added successfully.', 'success');
        this.step = Number(this.step) + 1;
        this.action(type);
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

  async addExternalContacts() {
    var userId = localStorage.getItem('userinfo');
    var already_arr: any = [];
    if (this.roles.length > 0) {
      this.roles.forEach(function (data) {
        already_arr.push(data.email);
      });
    }
    let modal = await this.modalCtrl.create({
      component: ContactslistPage,
      componentProps: {
        already: already_arr, is_external: '1'
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if (data.length != undefined && data.length != 0) {
        var returnedArr: any = [];
        data.forEach(function (contact) {
          var new_obj = {
            userId: userId,
            email: contact.email,
            value: contact.email,
            status: '0',
            isExternal: 1,
            privilege: 0
          }
          returnedArr.push(new_obj);
        });
        this.roles = this.roles.concat(returnedArr);
      }
    });
    await modal.present();
  }

  addRoleContacts(type) {
    this.componentService.showLoader();
    var self = this;
    var returnedArr: any = [];
    this.roles.forEach(function (contact) {
      var new_obj;
      if (contact.isExternal == 1) {
        new_obj = {
          isMember: '0',
          userId: self.userId,
          inviteId: '0',
          invite_email: contact.value,
          status: '0',
          privilege: contact.privilege,
          invite_name: '',
          invite_company: '',
          invite_phone: '',
          invite_title: '',
        }
      }
      else {
        new_obj = {
          isMember: contact.userId == undefined ? '0' : '1',
          userId: self.userId,
          inviteId: contact.userId == undefined ? '0' : contact.userId,
          invite_email: contact.value,
          status: '0',
          privilege: contact.privilege == undefined ? '0' : contact.privilege,
          invite_name: '',
          invite_company: '',
          invite_phone: '',
          invite_title: ''
        }
      }
      returnedArr.push(new_obj);
    });

    this.APIService.sendData('addInviteBidders/' + this.new_jobId + '/' + null, returnedArr).subscribe((contacts) => {
      this.componentService.dismissLoader();
      this.componentService.presentToast('Job contacts added.', 'success');
      this.step = Number(this.step) + 1;
      this.action(type);
    },
      err => {
        this.showTechnicalError('1');
      });
  }

  getExistingEmployees() {
    this.componentService.showLoader();
    var all_employees: any = [];
    var loginId = this.userId;
    this.APIService.getData('associateEmployeesList', this.companyId + '/' + this.userId).subscribe((employees) => {
      this.all_employees = employees;
      if (this.all_employees != '') {
        this.all_employees.forEach(function (emp) {
          if (emp.status == 1 && emp.fromId != emp.toId) {
            var obj = {
              display: emp.employee_name,
              value: emp.employee_email,
              userId: (loginId == emp.fromId) ? emp.toId : emp.fromId,
              email: emp.employee_email,
              privilege: 0
            }
            all_employees.push(obj);
          }
        });
      }
      this.all_employees = all_employees;
      this.componentService.dismissLoader();
      this.getEmployees();
    },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
      });
  }

  goToTrade() {
    localStorage.setItem('is_wizard', '1');
    localStorage.setItem('active_job_breadcrumb', this.job_title);
    localStorage.setItem('currentJobId', this.new_jobId);
    this.navCtrl.navigateForward('AddtradePage', { state: { job_id: this.new_jobId } });
  }
  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  jobPage() {
    this.navCtrl.navigateForward('managejob');
  }
  root(){
    this.navCtrl.navigateRoot(['dashboard', 0])
  }
}
