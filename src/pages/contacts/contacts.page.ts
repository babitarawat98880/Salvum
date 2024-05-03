import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { EventService } from 'src/services/event.service';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { ComposePage } from '../compose/compose';
import * as CryptoJS from 'crypto-js'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage  {
// @Input('countChanged') countChanged;
countChanged:any;
data: any;
userId : any ='';
isActive: boolean;
shownGroup = null;
buttonClicked:  any[] = [];
showDtata: any[] = [];
isdoneShow: any;
open_levels: any;
isLevelZero: any = '0'; 
force_level_changed: any = '0'; 
done: any[] = [];
hidebutton : any;
forceStatus: string;
top_tab: string = 'contacts';
updatedata: {};
senderSetLevel:any = '';
reciverSetLevel:any;
searchTerm: string = '';
selectLevel: '';
index:any;
isBrowser:any;
prevLevel:any = null;
selectedFirst:any = 0;
selectedSecond:any = 0;
selectedthird:any = 0;
selectedForth:any = 0;
selectedFirst1:any = 0;
selectedSecond1:any = 0;
selectedthird1:any = 0;
selectedForth1:any = 0;
level0 : string;
level1 : string;
level2 : string;
level3 : string;
level4 : string;
alllevel:any;
selectedFolder:any;
count:number;
items:any = [];
all_groups:any = [];
selectedGroups = [];
testCheckboxOpen: any;
selectedContacts:any = [];
selectedConIds:any = [];
directory:any;
timestamp:any;
folders :any= [];
isThumbActive:boolean = false;
allContacts :any= [];
allFilteredContacts = [];
level1Contacts :any= [];
level2Contacts :any = [];
level3Contacts :any = [];
level4Contacts :any= [];
lastOpenedLevel = 0;
searchBoxValue = '';
itemsNew: any = [];
filteredRecords:any = [];
arrayLength: number;
getGroupData = 'getGroupData';
list:any= [];
selected_Ids: any = [];
selected_groups: any = [];
selected_groups_data:any = undefined;
selected_contacts:any = undefined;
isLevelZeroData:any = undefined;
API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public http:HttpClient, 
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, 
    public events: EventService,
    public componentService:ComponentService,
    public APIService:APIService,
    public route:ActivatedRoute) {
    this.http = http;
    this.route.queryParams.subscribe(params => {
      this.selected_groups_data = this.route.snapshot.paramMap.get('selected_groups');
      this.selected_contacts = this.route.snapshot.paramMap.get('selected_contacts');
      this.isLevelZeroData = this.route.snapshot.paramMap.get('isLevelZeroData');
    });

    this.getOpenLevels();

    this.userId = localStorage.getItem('userinfo');
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.APIService.getData('folder', this.userId).subscribe((all_files:any)=>{ 
      if(all_files.data.length == 0 ){
        this.directory = [];
      }else{
        this.directory = all_files.data;
      } 
    },
    err => {
        this.showTechnicalError();
    });

    events.subscribe('openLevel:changed', data => {  
      this.locksClicked();
    });

    // this.ContactserviceProvider.readNotification(localStorage.getItem('userinfo'), localStorage.getItem('notifyLevel'), localStorage.getItem('notifyType')).subscribe((all_files)=>{
    //   console.log(all_files);
    //   this.events.publish('level:changed', all_files);
    //   //this.notifications = all_files.data; 
    // });
  };

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }

  caclHeight(){
    var fixed_div = document.getElementById("calc_height_conts"+this.timestamp);
      if(fixed_div != null){
        var fixed_div_height = fixed_div.offsetHeight;
        var tempValue:any =  document.getElementById('fixed_height_conts'+this.timestamp);
        tempValue.style.marginTop = fixed_div_height+'px';
      }
  }

  getOpenLevels()
  {
    this.open_levels = [];
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId  = localStorage.getItem('userinfo');
    if(this.alllevel){
      this.alllevel.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId || '');
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
        
          this.level1 = 'false';
          this.selectedFirst = 1;
          this.selectedFirst1 = 1;
          this.lastOpenedLevel = 1;
          this.open_levels.push('1');
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          
           this.level2 = 'false';
           this.selectedSecond = 2;
           this.selectedSecond1 = 2;
           this.lastOpenedLevel = 2;
           this.open_levels.push('2');
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
           this.level3 = 'false';
           this.selectedthird = 3;
           this.selectedthird1 = 3;
           this.lastOpenedLevel = 3;
           this.open_levels.push('3');
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
           this.level4 = 'false';
           this.selectedForth = 4;
           this.selectedForth1 = 4;
           this.lastOpenedLevel = 4;
           this.open_levels.push('4');
        }
      });
    }
  }

  locksClicked(){
    this.level1Contacts = [];
    this.level2Contacts = [];
    this.level3Contacts = [];
    this.level4Contacts = [];
    this.open_levels = [];
    this.level2 = 'true'; this.level1 = 'true'; this.level3 = 'true'; this.level4 = 'true'; 

    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId  = localStorage.getItem('userinfo');
    var decrypted;
    if(this.alllevel.length > this.lastOpenedLevel){
      if(this.alllevel.length == 1){
        decrypted = CryptoJS.AES.decrypt(this.alllevel[0], userId || '');
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.level1 = 'false';
          this.selectedFirst = 1;
          this.open_levels.push('1');
        }else{
          this.selectedFirst = 0;
        }
        
      }else if(this.alllevel.length == 2){
        this.level2 = 'false';
        this.selectedSecond = 2;
        this.open_levels.push('2');
      }else if(this.alllevel.length == 3){
        this.level2 = 'false';
        this.selectedthird = 3;
        this.open_levels.push('3');
      }else if(this.alllevel.length == 4){
        this.level4 = 'false';
        this.selectedForth = 4;
        this.open_levels.push('4');
      }
    }else{
      if(this.alllevel.length == 1){
        decrypted = CryptoJS.AES.decrypt(this.alllevel[0], userId || '');
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
          this.selectedFirst = 0;
          this.selectedSecond = 0;
          this.selectedthird = 0;
          this.selectedForth = 0;
        }else{
          this.level1 = 'false';
          this.selectedFirst = 1;
          this.selectedSecond = 0;
          this.selectedthird = 0;
          this.selectedForth = 0;
        }
      }else if(this.alllevel.length == 2){
        
        this.selectedthird = 0;
        this.selectedForth = 0;
      }else if(this.alllevel.length == 3){
        this.selectedForth = 0;
      }else if(this.alllevel.length == 0){
        this.selectedFirst = 0;
      }
    }
    this.lastOpenedLevel = this.alllevel.length;
    
    if(this.alllevel){
      this.alllevel.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId || '');
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.level1 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
           this.level2 = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
           this.level3 = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
           this.level4 = 'false';
        }
      });
    }

    this.userId = localStorage.getItem('userinfo');

    this.APIService.getData('folder',this.userId).subscribe((all_files:any)=>{ 
      if(all_files.data.length == 0 ){
        this.directory = [];
      }else{
        this.directory = all_files.data;
      }
    },
    err => {
        this.showTechnicalError();
    });

    this.APIService.getData('getContactList',this.userId).subscribe((data)=>{
      this.data = data;
      var i;
      if(this.selectedFirst != 1){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 1){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 1){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedSecond != 2){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 2){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 2){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedthird != 3){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 3){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 3){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedForth != 4){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 4){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 4){
              this.data.splice(i, 1);
            }
          }
        }
      }
    },
    err => {
        this.showTechnicalError();
    });
    this.groupsList();

   this.getOpenLevels();  
  } 

  ngOnInit() {
    this.caclHeight();
    this.isBrowser = localStorage.getItem('isBrowser');
    this.isActive = false;
    //this.showDtata = false;
    this.hidebutton = false;
    this.forceStatus = '0';
    this.isdoneShow = false;
    this.userId = localStorage.getItem('userinfo');
    this.componentService.showLoader();
      this.APIService.getData('getContactList',this.userId).subscribe((data :any)=>{
     this.componentService.dismissLoader();
        this.allContacts = data;
        var newArray:any = [];
        var  count = 0
         data.forEach(newItem => {
            if(newItem.senderSetLevel == '0' && newItem.senderId == this.userId){
             // if(this.level1 == 'false'){
                  
                  newArray.push(newItem)
                  count = count + 1;
              //}
            }else if(newItem.reciverSetLevel == '0' && newItem.reciverId == this.userId){
             // if(this.level1 == 'false'){
                  
                  newArray.push(newItem)
                  count = count + 1;
              //}
            }else if(newItem.reciverId == this.userId){
              if(newItem.reciverSetLevel == '1'){
                this.level1Contacts.push(newItem);
              }else if(newItem.reciverSetLevel == '2'){
                this.level2Contacts.push(newItem);
              }else if(newItem.reciverSetLevel == '3'){
                this.level3Contacts.push(newItem);
              }else if(newItem.reciverSetLevel == '4'){
                this.level4Contacts.push(newItem);
              }
            }else{
              if(newItem.senderSetLevel == '1'){
                this.level1Contacts.push(newItem);
              }else if(newItem.senderSetLevel == '2'){
                this.level2Contacts.push(newItem);
              }else if(newItem.senderSetLevel == '3'){
                this.level3Contacts.push(newItem);
              }else if(newItem.senderSetLevel == '4'){
                this.level4Contacts.push(newItem);
              }
            }
      })
        this.items = newArray;
        this.data = data;
        localStorage.setItem('crecords', JSON.stringify(this.data));
        this.allFilteredContacts = data;
        var i;
        if(this.isLevelZeroData == '0')
        {
          this.selectedFirst = 0;
          this.selectedSecond = 0;
          this.selectedthird = 0;
          this.selectedForth = 0;
          if(this.selectedFirst != 1){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 1){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 1){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedSecond != 2){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 2){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 2){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedthird != 3){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 3){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 3){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedForth != 4){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 4){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 4){
                  this.data.splice(i, 1);
                }
              }
            }
          }
        }else{
          if(this.selectedFirst != 1){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 1){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 1){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedSecond != 2){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 2){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 2){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedthird != 3){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 3){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 3){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedForth != 4){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 4){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 4){
                  this.data.splice(i, 1);
                }
              }
            }
          }
        }

        if(this.selected_contacts != undefined){
          if(this.selected_contacts.length > 0){
            this.selectedContacts = this.selected_contacts;
            var self = this;
            this.selectedContacts.forEach(function(cont){
              self.selectedConIds.push(cont.member_id);
            });
          }
        }

      
    },
    err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
    });
    this.groupsList();
  };

  groupsList(){
    return this.APIService.getData(this.getGroupData , this.userId)
        .subscribe((data:any) => {
            this.itemsNew = data;
            var all_groups :any= [], self = this;
            data.forEach(newItem => {
                if(self.open_levels.indexOf(newItem.userLevel) >= 0){
                  newItem.display = newItem.name;
                  newItem.value = newItem.name;
                  all_groups.push(newItem);
                }
            })
            this.list = all_groups;
            this.all_groups = all_groups;
            this.filteredRecords = all_groups;
            this.arrayLength = this.all_groups.length;
            localStorage.setItem('records', JSON.stringify(this.list));
            if(this.selected_groups_data != undefined){
              if(this.selected_groups_data.length > 0){
                this.selected_groups = this.selected_groups_data;
                this.selected_groups.forEach(function(gro){
                  self.selected_Ids.push(gro._id);
                });
              }
            }
        },
        err => {
            this.showTechnicalError();
        });
  }

  insertToArray(event,group){
    if(event.target.checked == true)
      {
        this.selected_Ids.push(group._id);
        this.selected_groups.push(group);
      }
      else
      {
        this.removeArray(this.selected_Ids, group._id);
        this.removeArray(this.selected_groups, group);
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

  updateCbValue(value, e:any){
    this.count = 0;
    var i;

    if(e.checked == true){
      this.count = 1;
       if(value == '1'){
        this.selectedFirst = 1;
        //return;
      }else if(value == '2'){
        this.selectedSecond = 2;
        //return;
      }
      else if(value == '3'){
        this.selectedthird = 3;
        //return;
      }else{
        this.selectedForth = 4;
       // return;
      }

      var list = JSON.parse(localStorage.getItem('crecords') || '');
      for(i=0; i < list.length; i++){
        if(list[i].senderId == this.userId){
          if(list[i].senderSetLevel == value){
            this.data.push(list[i]);
          } 
        }else{
          if(list[i].reciverSetLevel == value){
            this.data.push(list[i]);
          }
        }
      }

      // for groups
      this.list = JSON.parse(localStorage.getItem('records') || '');
        for(i=0; i < this.list.length; i++){
          if(this.list[i].userLevel == value){
            this.all_groups.push(this.list[i]);
          }
        }

        // if the value is an empty string don't filter the items
        if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
          this.all_groups = this.all_groups.filter((item) => {
            return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
          })
        }

      // if the value is an empty string don't filter the items
      // if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
      //   this.items = this.items.filter((item) => {
      //     console.log(item.name);
      //     return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
      //   })
      // }
    }else{
      if(this.count == 0){
        if(value == '1'){
          this.selectedFirst = 0;
          //return;
        }else if(value == '2'){
          this.selectedSecond = 0;
          //return;
        }
        else if(value == '3'){
          this.selectedthird = 0;
          //return;
        }else{
          this.selectedForth = 0;
          //return;
        }
      } 

      for(i = Number(this.data.length - 1); i >= 0; i--){
        if(this.data[i].senderId == this.userId){
          if(this.data[i].senderSetLevel == value){
            this.data.splice(i, 1);
          }
        }else{
          if(this.data[i].reciverSetLevel == value){
            this.data.splice(i, 1);
          }
        }
      }
      this.allFilteredContacts = JSON.parse(localStorage.getItem('crecords') || '');
      // for groups
      for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == value){
            this.all_groups.splice(i, 1);
          }
        }

        // if the value is an empty string don't filter the items
        if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
          this.all_groups = this.all_groups.filter((item) => {
            return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
          })
        }

      //console.log(this.allFilteredContacts);
      // if the value is an empty string don't filter the items
      // if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
      //   this.items = this.items.filter((item) => {
      //     console.log(item.name);
      //     return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
      //   })
      // }
    }

    if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
      this.data = this.data.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
      })
    }
  }

  async showConfirmGroup(item, index) {
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
                    return this.APIService.deleteData(this.getGroupData,  item._id) .subscribe(data => {                               
                      for(var i=0; i < this.list.length; i++){
                        if(this.list[i]._id == item._id){
                          this.list.splice(i, 1);
                        }
                      }
                      this.componentService.presentToast('Group has been deleted successfully.','success')
                      this.all_groups.splice(index, 1);
                      
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
  
 async showConfirm(item, index) {
    let confirm = await this.alertCtrl.create({ 
      message: 'Are you sure you want to delete this ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            var data = {
              memberId : item.member_id,
              memberstatus : 0,
              requsetType: 'delete',
              fromId: this.userId,
              toId: this.userId == item.senderId ? item.reciverId : item.senderId
            };
           
           this.componentService.showLoader();
            return this.APIService.putData('accptinvitation',data).subscribe(data => {
             this.componentService.dismissLoader();
             this.componentService.presentToast('Contact has been removed.','success'); 
              if(item.senderSetLevel != '0' && item.reciverSetLevel != '0'){
                this.getContact();
              }
              else{
                this.getContact('0');
              }  
              this.events.publish('countChanged:changed', '');
              this.countChanged = '1';
            },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
   await confirm.present();
  };

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };

  getContact(type:any = null){
    this.level1Contacts = [];
    this.level2Contacts = [];
    this.level3Contacts = [];
    this.level4Contacts = [];
    this.selectedthird = 0; this.selectedFirst = 0; this.selectedSecond = 0; this.selectedForth = 0;
    this.level2 = 'true'; this.level1 = 'true'; this.level3 = 'true'; this.level4 = 'true';  
    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
    var userId  = localStorage.getItem('userinfo');
    if(this.alllevel && type == null){
      this.alllevel.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId || '');
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
        
          this.level1 = 'false';
          this.selectedFirst = 1;

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          
           this.level2 = 'false';
           this.selectedSecond = 2;

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
           this.level3 = 'false';
           this.selectedthird = 3;

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
           this.level4 = 'false';
           this.selectedForth = 4;
        }
      });
    }

    this.userId = localStorage.getItem('userinfo');

    this.APIService.getData('folder',this.userId).subscribe((all_files:any)=>{ 
      if(all_files.data.length == 0 ){
        this.directory = [];
      }else{
        this.directory = all_files.data;
      }
    },
    err => {
        this.showTechnicalError();
    });

    this.APIService.getData('getContactList',this.userId).subscribe((data)=>{
       localStorage.setItem('crecords',(JSON.stringify(data)));
        this.data = data;
        var i;

        if(this.selectedFirst != 1){
          for(i = Number(this.data.length - 1); i >= 0; i--){
            if(this.data[i].senderId == this.userId){
              if(this.data[i].senderSetLevel == 1){
                this.data.splice(i, 1);
              }
            }else{
              if(this.data[i].reciverSetLevel == 1){
                this.data.splice(i, 1);
              }
            }
          }
        }

        if(this.selectedSecond != 2){
          for(i = Number(this.data.length - 1); i >= 0; i--){
            if(this.data[i].senderId == this.userId){
              if(this.data[i].senderSetLevel == 2){
                this.data.splice(i, 1);
              }
            }else{
              if(this.data[i].reciverSetLevel == 2){
                this.data.splice(i, 1);
              }
            }
          }
        }

        if(this.selectedthird != 3){
          for(i = Number(this.data.length - 1); i >= 0; i--){
            if(this.data[i].senderId == this.userId){
              if(this.data[i].senderSetLevel == 3){
                this.data.splice(i, 1);
              }
            }else{
              if(this.data[i].reciverSetLevel == 3){
                this.data.splice(i, 1);
              }
            }
          } 
        }

        if(this.selectedForth != 4){
          for(i = Number(this.data.length - 1); i >= 0; i--){
            if(this.data[i].senderId == this.userId){
              if(this.data[i].senderSetLevel == 4){
                this.data.splice(i, 1);
              }
            }else{
              if(this.data[i].reciverSetLevel == 4){
                this.data.splice(i, 1);
              }
            }
          }
        }
        //this.items = newArray;
    },
    err => {
        this.showTechnicalError();
    });
  };

  onClick(isActive, level){

    if(isActive == true){
     this.componentService.showLoader();
      this.APIService.getData('folder',this.userId).subscribe((all_files:any)=>{ 
        if(all_files.data.length == 0 ){
          this.folders = [];
          this.isActive = true;
          this.forceStatus = '1';
         this.componentService.dismissLoader();
        } else {
          this.folders = [];
          var myArray = all_files.data, allowed_levels:any = [];
          allowed_levels.push('level'+level);
          var i;
          for (i = myArray.length - 1; i >= 0; --i) {
            if (allowed_levels.indexOf(myArray[i].name) == -1) {
                 myArray.splice(i,1);
             }
          }
          for(i=0;i < myArray.length; i++){
            for(var j=0; j < myArray[i].children.length; j++){
              this.folders.push(myArray[i].children[j])
            }
          }

          this.isActive = true;
          this.forceStatus = '1';
         this.componentService.dismissLoader();
        }
      },
      err => {
          this.componentService.dismissLoader();
          this.showTechnicalError();
      });

      //this.folders = myArray;
    }else{
      this.isActive = false; 
      this.forceStatus = '0';
    }
  };

 async levelChanged(level,isForce,prevLevel,type){
    this.prevLevel = prevLevel;
    if(isForce == true && prevLevel != level){
      let confirm = await this.alertCtrl.create({ 
        message: 'All forced messages for this contact will be moved to the new level selected do you wish to proceed?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.force_level_changed = '1';
            }
          },
          {
            text: 'No',
            handler: () => { 
              if(type == 'rec'){
                this.reciverSetLevel = prevLevel;
              }
              else{
                this.senderSetLevel = prevLevel;
              }
              this.force_level_changed = '0';
            }
          }
        ]
      });
     await confirm.present();
    }
    
    // this.isActive = false;
  }

  getExternalContacts(){
    this.navCtrl.navigateForward('ExtcontPage');
  };

  goToManageGroup(){
    if(this.level1 != 'false'){
      this.componentService.presentToast( 'Please open level first.','danger');
    }else{
      this.navCtrl.navigateForward('EditgroupPage');
    }
  };

  editgroup(item) {
      if(this.level1 == 'true'){
        this.componentService.presentToast('Please open level first.' , '');
      }else{
        this.navCtrl.navigateForward('EditgrpPage',{state:{data: item} } );
      }
    }

  goToeditGroup(){
    if(this.level1 != 'false'){
      this.componentService.presentToast('Please open level first.','danger')
  
    }else{
      this.navCtrl.navigateForward('ManagegroupPage');
    }
  };

  showdata(id: number){
    if(this.showDtata[id] == true){
      this.showDtata[id] = false;
    }else{
      this.showDtata[id] = true;
    }

  };
  
  onButtonClick(id : number, item) {
    this.showDtata[id] = false;
    this.done[id] = true; 
    this.buttonClicked[id] = true;
    this.selectedFolder = item.folder;
    if(item.senderId == this.userId){
      this.senderSetLevel = item.senderSetLevel;
      if(item.senderThumb == 'Show'){
        this.isThumbActive = true;
      }else{
        this.isThumbActive = false;
      }
    }else{
      this.reciverSetLevel = item.reciverSetLevel;
      if(item.receiverThumb == 'Show'){
        this.isThumbActive = true;
      }else{
        this.isThumbActive = false;
      }
    }

    this.folders = [];
    if(item.force == true){
      // this.forceStatus = '1';
      this.isActive = true;
      var myArray = this.directory, allowed_levels :any= [];
      allowed_levels.push('level'+item.senderSetLevel);
      var i;
        for (i = myArray.length - 1; i >= 0; --i) {
        if (allowed_levels.indexOf(myArray[i].name) == -1) {
             myArray.splice(i,1);
         }
      }
      for(i=0;i < myArray.length; i++){
        for(var j=0; j < myArray[i].children.length; j++){
          this.folders.push(myArray[i].children[j])
        }
      }
      this.selectedFolder = item.folder;
      //this.folders = myArray;
    }else{
      this.isActive = false;
      //this.forceStatus = '0';
    }
  };

 

  update(data, level, index){
    data.folder = this.folders.length > 0 ? data.folder : null;
    
    if(level == 0)
    {
      this.componentService.presentToast( 'Please set level first.','danger');
    }
    else
    {
      if(this.isActive == false){
        data.folder  = null;
      } 
      var forceBtnClicked = false;
      if(this.isActive == true){
        forceBtnClicked = true;
      }

      var thumb = 'Hide';
      if(this.isThumbActive == true){
        thumb = 'Show';
      }

      if(data.senderId == localStorage.getItem('userinfo')){
        this.updatedata  = {
         'senderSetLevelStatus':'1',
         'senderSetLevel': level,
         'memberId':data.member_id,
         'level' :level,
         'info': level,
         'send':level,
         'index': level,
         'share': level,
         'force': forceBtnClicked,
         'folder': data.folder,
         'thumb': thumb,
         'loginId': localStorage.getItem('userinfo'),
         'force_level_changed': this.force_level_changed,
         'old_level': data.senderSetLevel
        };

       this.componentService.showLoader();
        return this.APIService.putData('sendersetleveldata',this.updatedata)
            .subscribe(data => {
           this.componentService.dismissLoader();
          
              this.data[index].senderSetLevel = level;
              this.done[this.data[index]._id] = false;
              this.buttonClicked[this.data[index]._id] = false;
        
              this.componentService.presentToast('Contact has been updated successfully.','success')
              this.getContact();
              this.events.publish('countChanged:changed', '');
              this.countChanged = '1';
              this.force_level_changed = '0';
            },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
      }else{
        this.updatedata  = {
          'recevierSetLevelStatus':'1',
          'reciverSetLevel':level,
          'memberId':data.member_id,
          'level' : level,
          'info':level,
          'send': level,
          'index': level,
          'share': level,
          'force': forceBtnClicked,
          'folder':data.folder,
          'thumb': thumb,
          'loginId': localStorage.getItem('userinfo'),
          'force_level_changed': this.force_level_changed,
          'old_level': data.reciverSetLevel
        }
       this.componentService.showLoader();
        //let body = JSON.stringify(this.updatedata);
       this.APIService.putData('reciviersetleveldata',this.updatedata)
              .subscribe(data => {
              this.componentService.dismissLoader();
                this.data[index].reciverSetLevel = level;
                this.done[this.data[index]._id] = false;
                this.buttonClicked[this.data[index]._id] = false;
                this.componentService.presentToast('Contact has been updated successfully.','success');
                this.getContact();
                this.events.publish('countChanged:changed', '');
                this.countChanged = '1';
                this.force_level_changed = '0';
            },
            err => {
               this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
      }
    }

  };

  getItemsGroup(ev){
    let val = ev.target.value;
    this.searchBoxValue = val;
    var i;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.all_groups = this.filteredRecords.filter((item) => {
        console.log(item.name);
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.all_groups = this.filteredRecords;
      if(this.selectedFirst != 1){
        for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == 1){
            this.all_groups.splice(i, 1);
          }
        }
      }

      if(this.selectedSecond != 2){
        for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == 2){
            this.all_groups.splice(i, 1);
          }
        }
      }

      if(this.selectedthird != 3){
        for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == 3){
            this.all_groups.splice(i, 1);
          }
        }
      }

      if(this.selectedForth != 4){
        for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == 4){
            this.all_groups.splice(i, 1);
          }
        }
      }  
    }
  }

  getItems(ev) {
    let val = ev.target.value;
    this.searchBoxValue = val;
    var i;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.data = this.allFilteredContacts.filter((item:any) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })


      if(this.selectedFirst != 1){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 1){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 1){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedSecond != 2){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 2){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 2){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedthird != 3){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 3){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 3){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedForth != 4){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 4){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 4){
              this.data.splice(i, 1);
            }
          }
        }
      }
    }else{
      this.data = this.allFilteredContacts;
      if(this.selectedFirst != 1){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 1){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 1){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedSecond != 2){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 2){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 2){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedthird != 3){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 3){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 3){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedForth != 4){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 4){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 4){
              this.data.splice(i, 1);
            }
          }
        }
      }
    }
    this.allFilteredContacts = JSON.parse(localStorage.getItem('crecords') || '')
  };

  goToSmail(){
    this.navCtrl.navigateForward('ComposePage', { state :{ data: {'selectedGroups':this.selected_groups, 'selectedContacts': this.selectedContacts}}});
    // if(this.selected_groups.length > 0 || this.selectedContacts.length > 0){
    //   this.navCtrl.push('ComposePage', {data: {'selectedGroups':this.selected_groups, 'selectedContacts': this.selectedContacts}});
    // }
    // else{
    //   let toast = this.toastCtrl.create({
    //       message: 'Please select atleast one contact or group.',
    //       duration: 3000,
    //       cssClass: 'danger',
    //       position: 'top'
    //   });
    //   toast.present(); 
    // }
  };

  // groupListing(){
  //  this.componentService.showLoader();
  //   this.groupservice.getGroupData(this.userId).subscribe(response => {
  //  this.componentService.dismissLoader();
  //     let alert = this.alertCtrl.create();
  //     if(response.length == 0){
  //       alert.setTitle('No Group Created Yet!');
  //     }else if(this.level1 != 'false'){
  //       alert.setTitle('Please open level first.');
  //     }else{
  //       alert.setTitle('Select Group');
  //     }
      

  //     for(var i=0; i < response.length; i++){
  //       if(this.level1 == 'false' && response[i].userLevel == 1 || this.level2 == 'false' && response[i].userLevel == 2 || this.level3 == 'false' && response[i].userLevel == 3 || this.level4 == 'false' && response[i].userLevel == 4){
  //           alert.addInput({
  //             type: 'checkbox',
  //             label: response[i].name,
  //             value: response[i],
  //             checked: false
  //           });
  //       }
        
  //     }

  //     alert.addButton('Cancel');

  //     alert.addButton({
  //       text: 'Okay',
  //       handler: data => {
  //         this.testCheckboxOpen = false;
  //         this.selectedGroups = data;

  //         for(var j=0; j < data.length; j++){
  //           for(var i=0; i < this.data.length; i++){
  //             if(this.data[i]._id == data[j]){
  //               this.data.splice(i, 1);
  //             }
  //           }
  //         }
  //       }
  //     });

  //     alert.present().then(() => {
  //       this.testCheckboxOpen = true;
  //     });

  //   },
  //   err => {
  //      this.componentService.dismissLoader();
  //       this.showTechnicalError('1');
  //   });
  // };

  checkBoxClicked(event, contact){
    if(event.checked == true){
      console.log(contact)
      this.selectedContacts.push(contact);
      this.selectedConIds.push(contact.member_id);
    }else{
      for(var i=0; i < this.selectedContacts.length; i++){
        if(this.selectedContacts[i]._id == contact._id){
          this.selectedContacts.splice(i, 1);
          this.selectedConIds.splice(i, 1);
        }
      }
    }
  };

  root(){
    this.navCtrl.navigateRoot('DashboardPage');
  };

  myComposePage(){
    this.navCtrl.navigateRoot('ComposePage');
  }

  showTechnicalError(type:any = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please '+msg,'info');

  }


}
