import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { EventService } from 'src/services/event.service';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
@Component({
  selector: 'app-managegroup',
  templateUrl: './managegroup.page.html',
  styleUrls: ['./managegroup.page.scss'],
})
export class ManagegroupPage  {
  userId: any;
  items: any = [] ;
  new: Array < {} > ;
  itemsNew: any = [];
  selectedFirst: any;
  selectedSecond: any;
  selectedthird: any;
  selectedForth: any;
  value: any;
  newArr = [];
  timestamp: any;
  level0: any;
  level1: any;
  level2: any;
  level3: any;
  count: number;
  level4: string;
  alllevel: any;
  filteredRecords:any = [];
  arrayLength: number;
  isBrowser:any;
  selectedGroups:any = [];
  selectedContacts :any= [];
  testCheckboxOpen:any;
  data:any =[];
  array1:any= [];
  array2:any= [];
  array3:any = [];
  array4:any = [];
  list :any= [];
  searchBoxValue = '';
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  getGroupData = 'getGroupData';
  constructor(
    public events: EventService, 
    public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public http: HttpClient, 
    public APIService: APIService,
    public componentService: ComponentService) {
      this.http = http;
      this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
      var userId = localStorage.getItem('userinfo');
      this.userId = localStorage.getItem('userinfo');
      var current_date = new Date();
      this.timestamp = current_date.getTime();
      if (this.alllevel) {
          this.alllevel.forEach((value) => {
              var decrypted = CryptoJS.AES.decrypt(value, userId ||'');
              if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                  this.level1 = 'false';
                  this.selectedFirst = 1;
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                  this.level2 = 'false';
                  this.selectedSecond = 2;
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                  this.level3 = 'false';
                  this.selectedthird = 3;
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                  this.level4 = 'false';
                  this.selectedForth = 4;
              }
          })
      }

      events.subscribe('openLevel:changed', data => {  
        this.locksClicked();
      });
  }

ionViewWillUnload() {
    this.events.unsubscribe('openLevel:changed');
}

showTechnicalError(type :any= null){
  var msg = (type == '1') ? 'try later.' : 'reload the page.'
  this.componentService.presentToast('Technical error, Please '+msg,'info');
}

caclHeight(){
  var fixed_div = document.getElementById("calc_height_mnggrp"+this.timestamp);
    if(fixed_div != null){
      var fixed_div_height = fixed_div.offsetHeight;
      var fixed_height_mnggrp :any= document.getElementById('fixed_height_mnggrp'+this.timestamp)
      fixed_height_mnggrp.style.marginTop = fixed_div_height+'px';
    }
}
  ngOnInit() {
    this.caclHeight();
      // this.selectedSecond = true;
      // this.level0 = localStorage.getItem('level0');
      // if(this.level0 == 'false'){
      //   this.selectedFirst = 1;
      // }
      // this.level1 = localStorage.getItem('level1');
      //  if(this.level1 == 'false'){
      //   this.selectedSecond = 2;
      // }
      // this.level2 = localStorage.getItem('level2');
      //  if(this.level2 == 'false'){
      //   this.selectedthird = 3;
      // }
      // this.level3 = localStorage.getItem('level3');
      //  if(this.level3 == 'false'){
      //   this.selectedForth = 4;
      // }
      this.isBrowser = localStorage.getItem('isBrowser');
      this.componentService.showLoader();
      this.userId = localStorage.getItem('userinfo')
      return this.APIService.getData(this.getGroupData, this.userId).subscribe((data:any) => {
             this.componentService.dismissLoader();
              this.itemsNew = data;
              var count = 0
              data.forEach(newItem => {
                  console.log(newItem);
                  if (newItem.userLevel == '1') {
                     
                          this.array1.push(newItem)
                          count = count + 1;
                      
                  } else if (newItem.userLevel == '2') {
                      
                          this.array2.push(newItem)
                          count = count + 1;
                      
                  } else if (newItem.userLevel == '3') {
                     
                          this.array3.push(newItem)
                          count = count + 1;
                      
                  } else if (newItem.userLevel == '4') {
                     
                          this.array4.push(newItem)
                          count = count + 1;
                      
                  }
              })
              this.list = data;
              this.items = data;
              this.filteredRecords = data;
              this.arrayLength = this.items.length;
              localStorage.setItem('records', JSON.stringify(this.list));
          },
          err => {
              this.componentService.dismissLoader();
              this.showTechnicalError();
          });
  }


  locksClicked(){
    this.level1 = 'true';
    this.level2 = 'true';
    this.level3 = 'true';
    this.level4 = 'true';
      this.selectedFirst = 0;
      this.selectedSecond = 0;
      this.selectedthird = 0;
      this.selectedForth = 0;
      this.alllevel = JSON.parse(localStorage.getItem('alllevel') ||'');
      var userId = localStorage.getItem('userinfo');
      this.userId = localStorage.getItem('userinfo');
      if (this.alllevel) {
          this.alllevel.forEach((value) => {
              var decrypted = CryptoJS.AES.decrypt(value, userId || '');
              console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
              if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                  this.level1 = 'false';
                  this.selectedFirst = 1;
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                  this.level2 = 'false';
                  this.selectedSecond = 2;
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                  this.level3 = 'false';
                  this.selectedthird = 3;
              } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                  this.level4 = 'false';
                  this.selectedForth = 4;
              }
          })
      }
  };


  async showConfirm(item, index) {
      let confirm = await this.alertCtrl.create({
          message: 'Are you sure you want to delete this ?',
          buttons: [{
                  text: 'No',
                  handler: () => {
                      console.log('Disagree clicked');
                  }
              },
              {
                  text: 'Yes',
                  handler: () => {
                      return this.http.delete(this.API_ENDPOINT_URL+this.getGroupData + "/" + item._id)
                          .subscribe(data => {                               
                              for(var i=0; i < this.list.length; i++){
                                if(this.list[i]._id == item._id){
                                  this.list.splice(i, 1);
                                }
                              }
                              this.items.splice(index, 1);
                              this.componentService.presentToast('Group has been deleted successfully.', 'success');
                          },
                          err => {
                              this.showTechnicalError('1');
                          });
                  }
              }
          ]
      });
     await confirm.present();
  };

  updateCbValue(value, e: any) {
    this.count = 0;
    var i;
    if(e.checked == true) {
      if(value == 1){
        this.selectedFirst = 1;
      }else if(value == 2){
        this.selectedSecond = 2;
      }else if(value == 3){
        this.selectedthird = 3;
      }else if(value == 4){
        this.selectedForth = 4;
      }

      this.list = JSON.parse(localStorage.getItem('records') || '');
      for(i=0; i < this.list.length; i++){
        if(this.list[i].userLevel == value){
          this.items.push(this.list[i]);
        }
      }

      // if the value is an empty string don't filter the items
      if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
        this.items = this.items.filter((item) => {
          return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
        })
      }
    }else{
      if(value == 1){
        this.selectedFirst = 0;
      }else if(value == 2){
        this.selectedSecond = 0;
      }else if(value == 3){
        this.selectedthird = 0;
      }else if(value == 4){
        this.selectedForth = 0;
      }

      
      for(i = Number(this.items.length - 1); i >= 0; i--){
        if(this.items[i].userLevel == value){
          this.items.splice(i, 1);
        }
      }

      // if the value is an empty string don't filter the items
      if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
        this.items = this.items.filter((item) => {
          return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
        })
      }
    }

  };

  editgroup(item) {
    if(this.level1 == true){
      this.componentService.presentToast('Please open level first.','info')
    
    }else{
      this.navCtrl.navigateForward('edit-group', { state: { data: item}});
    }
  }

  goToManageGroup(){
    if(this.selectedFirst == 0){
      this.componentService.presentToast('Please open level first.', '');
     
    }else{
      this.navCtrl.navigateForward('add-group');
    }
  };

  goToeditGroup(){
      this.navCtrl.navigateForward('managegroup');
  };

  goToSmail(){
      if(this.selectedGroups.length > 0 || this.selectedContacts.length > 0){
        console.log(this.selectedGroups);
        this.navCtrl.navigateForward('ComposePage', {state: {'selectedGroups':this.selectedGroups, 'selectedContacts': this.selectedContacts}});
      }else{
        this.componentService.presentToast('Please select atleast one contact or group.', '')
        
      }
  };

  groupListing(){
   this.componentService.showLoader();
      this.APIService.getData('getGroupData',this.userId).subscribe((response:any) => {
        // this.data = response;
       this.componentService.dismissLoader();
         this.selectedFirst = 0;
        this.selectedSecond = 0;
        this.selectedthird = 0;
        this.selectedForth = 0;
        this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
        var userId = localStorage.getItem('userinfo');
        this.userId = localStorage.getItem('userinfo');
        if (this.alllevel) {
            this.alllevel.forEach((value) => {
                var decrypted = CryptoJS.AES.decrypt(value, userId || '');
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                    this.level1 = 'false';
                    this.selectedFirst = 1;
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                    this.level2 = 'false';
                    this.selectedSecond = 2;
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                    this.level3 = 'false';
                    this.selectedthird = 3;
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    this.level4 = 'false';
                    this.selectedForth = 4;
                }
            })
        }
        let alert: HTMLIonAlertElement;

        this.alertCtrl.create().then(alertInstance => {
            alert = alertInstance;
        
            if (response.length == 0) {
                alert.header = 'No Group Created Yet!';
            } else if (this.selectedFirst == 0) {
                alert.header = 'Please open level first.';
            } else {
                alert.header = 'Select Group';
            }
        
            // Adding inputs to the alert
            let inputs:any = [];
            for (var i = 0; i < response.length; i++) {
                if (this.selectedFirst == 1 && response[i].userLevel == this.selectedFirst || this.selectedSecond == 2 && response[i].userLevel == this.selectedSecond || this.selectedthird == 3 && response[i].userLevel == this.selectedthird || this.selectedForth == 4 && response[i].userLevel == this.selectedForth) {
                    inputs.push({
                        type: 'checkbox',
                        label: response[i].name,
                        value: response[i]._id, // Assuming _id is the value you want to retrieve
                        checked: false
                    });
                }
            }
            alert.inputs = inputs;
        
            // Adding buttons to the alert
            alert.buttons = [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Okay',
                    handler: data => {
                        console.log('Checkbox data:', data);
                        console.log(this.data, "data")
                        this.testCheckboxOpen = false;
                        this.selectedGroups = data;
                        for (var j = 0; j < data.length; j++) {
                            for (var i = 0; i < this.data.length; i++) {
                                if (this.data[i]._id == data[j]) {
                                    this.data.splice(i, 1);
                                }
                            }
                        }
                    }
                }
            ];
        
            alert.present().then(() => {
                this.testCheckboxOpen = true;
            });
        });
        
       

      },
      err => {
        this.componentService.dismissLoader();
          this.showTechnicalError();
      });
  };

  checkBoxClicked(isChecked, contact){
      console.log(isChecked);
      if(isChecked == true){
        this.selectedContacts.push(contact);
      }else{
        for(var i=0; i < this.selectedContacts.length; i++){
          if(this.selectedContacts[i]._id == contact._id){
            this.selectedContacts.splice(i, 1);
          }
        }
      }
  };

  root(){
      this.navCtrl.navigateRoot('dashboard');
  };

  contact(){
      this.navCtrl.navigateRoot('contacts');
  };

  getItems(ev) {
      let val = ev.target.value;
      this.searchBoxValue = val;
      var i;
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.items = this.filteredRecords.filter((item) => {
          console.log(item.name);
          return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }else{
        this.items = this.filteredRecords;
        if(this.selectedFirst != 1){
          for(i = Number(this.items.length - 1); i >= 0; i--){
            if(this.items[i].userLevel == 1){
              this.items.splice(i, 1);
            }
          }
        }

        if(this.selectedSecond != 2){
          for(i = Number(this.items.length - 1); i >= 0; i--){
            if(this.items[i].userLevel == 2){
              this.items.splice(i, 1);
            }
          }
        }

        if(this.selectedthird != 3){
          for(i = Number(this.items.length - 1); i >= 0; i--){
            if(this.items[i].userLevel == 3){
              this.items.splice(i, 1);
            }
          }
        }

        if(this.selectedForth != 4){
          for(i = Number(this.items.length - 1); i >= 0; i--){
            if(this.items[i].userLevel == 4){
              this.items.splice(i, 1);
            }
          }
        }
        
        
      }
  };
}
