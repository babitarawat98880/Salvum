import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { EventService } from 'src/services/event.service';
import * as CryptoJS from 'crypto-js';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.page.html',
  styleUrls: ['./edit-group.page.scss'],
})
export class EditGroupPage {
  data: any;
  items: any;
  groupArray:any = [];
  newdata: any;
  selectedFirst:any = 0;
  selectedSecond:any = 0;
  selectedthird:any = 0; 
  selectedForth:any = 0;
  selectedFirst1 = 0;
  selectedSecond1 = 0;
  selectedthird1 = 0;
  selectedForth1 = 0;
  userId : any = '';
  level0 : any='';
  level1 : any='';
  level2 : any='';
  level3 : any='';
  level1Contacts = 0;
  level2Contacts = 0;
  level3Contacts = 0;
  level4Contacts = 0;
  count:number;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  editGroupData = 'editGroupData';
  getContactList = 'getContactList';
  selectedGroup:any;
  alllevel:any;
  selected:Boolean = true;
  selected1: Boolean = true;
  selected3: Boolean = true;
  selected2: Boolean = true;
  mselected:Boolean = true;
  mselected1: Boolean = true;
  mselected3: Boolean = true;
  mselected2: Boolean = true;
  addedContacts:any = [];
  isBrowser:any;
    constructor(
      public navCtrl: NavController,
      public http:HttpClient, 
      public componentService: ComponentService, 
      public APIService: APIService, 
      public events:EventService,
      public route:ActivatedRoute) {
        this.http = http;
          if(history.state.data != null){
            localStorage.setItem('groupInfo', JSON.stringify(history.state.data));
            this.selectedGroup = JSON.parse(localStorage.getItem('groupInfo') || '');  
          }
       events.subscribe('openLevel:changed', data => {  
          this.locksClicked();
        });
    };
  
    ionViewWillUnload() {
        this.events.unsubscribe('openLevel:changed');
      }
   
    ngOnInit() {
      this.isBrowser = localStorage.getItem('isBrowser');
        this.alllevel = JSON.parse(localStorage.getItem('alllevel') ||'');
        var userId  = localStorage.getItem('userinfo');
        if(this.alllevel){
          this.alllevel.forEach((value) => {
              var decrypted = CryptoJS.AES.decrypt(value, userId ||'');
              // console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
            if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
              this.level0 = 'false';
             this.selectedFirst = 1;
             this.selectedFirst1 = 1;
            }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
               this.level1 = 'false';
               this.selectedSecond = 2;
               this.selectedSecond1 = 2;
            }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
               this.level2 = 'false';
              this.selectedthird = 3;
              this.selectedthird1 = 3;
            }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
               this.level3 = 'false';
               this.selectedForth = 4;
               this.selectedForth1 = 4;
            }
          });
        }
        this.userId = localStorage.getItem('userinfo');
        // this.componentService.showLoader();
      
          console.log(this.selectedGroup, "Sd")
        return this.APIService.getData(this.editGroupData,this.selectedGroup._id + '/' + this.userId).subscribe(data => {
              this.componentService.dismissLoader();
              //this.data = data;
              this.newdata = data;
              if(this.newdata.length > 0){
                this.newdata[0].name.forEach((eachObj:any) => {
                  this.groupArray.push(eachObj._id);
                  //console.log(this.groupArray);
                })
              }
              
              return this.APIService.getData(this.getContactList,this.userId).subscribe((data:any) => {
                    //console.log(data);
                  this.componentService.dismissLoader();
                    var finalArray:any= [];
                    var values:any = [];
                    var value;
                    var cunt = 0;
                    // Remove Duplicate Value
                    for(var i = 0; i < data.length; i++) {
                        value = data[i];
                        //console.log(value);
                        if(value.reciverSetLevel != 0 && value.senderSetLevel != 0){
                       if(values.length > 0){
                          if(values[cunt]._id.indexOf(value._id) === -1) {
                          finalArray.push(data[i]);
                          values.push(value);
                          //console.log(finalArray);
                          //console.log(values);
                          cunt = cunt + 1;
                          }
                        }else{
                          values.push(value);
                          finalArray.push(data[i]);
                        }
                      }
                    }
                    if(this.newdata.length > 0){
                      this.newdata[0].name.forEach(eachObj => {
                        //console.log(eachObj._id);
                        var count = 0;
                        data.forEach(newObj => {
                         // console.log(newObj);
                          if(data[count].email == eachObj.email && data[count].senderSetLevel != 0 && data[count].reciverSetLevel != 0){
                            if(data[count].senderId == this.userId && data[count].senderSetLevel != 0 && data[count].reciverSetLevel != 0){
                              if(data[count].senderSetLevel == '1'){
                                this.level1Contacts = this.level1Contacts + 1;
                              }else if(data[count].senderSetLevel == '2'){
                                this.level2Contacts = this.level2Contacts + 1;
                              }else if(data[count].senderSetLevel == '3'){
                                this.level3Contacts = this.level3Contacts + 1;
                              }else if(data[count].senderSetLevel == '4'){
                                this.level4Contacts = this.level4Contacts + 1;
                              }
                            }else{
                              if(data[count].reciverSetLevel == '1' && data[count].senderSetLevel != 0 ){
                                this.level1Contacts = this.level1Contacts + 1;
                              }else if(data[count].reciverSetLevel == '2'){
                                this.level2Contacts = this.level2Contacts + 1;
                              }else if(data[count].reciverSetLevel == '3'){
                                this.level3Contacts = this.level3Contacts + 1;
                              }else if(data[count].reciverSetLevel == '4'){
                                this.level4Contacts = this.level4Contacts + 1;
                              }
                            }
                            
                            this.addedContacts.push(data[count]);
                            count = count + 1;
                          }else{
                            //console.log(count);
                            count = count + 1;
                          }
                          //this.sele
                        })
                        //console.log('group');
                        //console.log(this.addedContacts)
                      });
                    }
                    
                    this.items = finalArray;
                    if(this.newdata.length > 0){
                      this.newdata[0].name.forEach(eachObj => {
                         //console.log(eachObj._id);
                          var count = 0;
                         this.items.forEach(newObj => {
                          //console.log(newObj);
                            if(this.items[count].email == eachObj.email){
                              //this.addedContacts.push(this.items[count]);
                               this.items.splice(count, 1);
                               //console.log(this.items);
                            }else{
                              //console.log(count);
                             count = count + 1;
                            }
                            //this.sele
                        })
                      });
                    }
                },
                err => {
                   this.componentService.dismissLoader();
                    this.showTechnicalError();
                });
             },
            err => {
               this.componentService.dismissLoader();
                this.showTechnicalError();
        });
    
    };
  
    showTechnicalError(type:any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.';
      this.componentService.presentToast('Technical error, Please '+msg,'info');
    }
  
    locksClicked(){
      this.selectedthird = 0; this.selectedFirst = 0; this.selectedSecond = 0; this.selectedForth = 0;
      this.selectedthird1 = 0; this.selectedFirst1 = 0; this.selectedSecond1 = 0; this.selectedForth1 = 0;
      this.level1 = true; this.level2 = true; this.level3 = true; this.level0 = true;
      this.alllevel = JSON.parse(localStorage.getItem('alllevel') ||'');
        var userId  = localStorage.getItem('userinfo');
        if(this.alllevel){
          this.alllevel.forEach((value) => {
              //console.log(value);
              var decrypted = CryptoJS.AES.decrypt(value, userId || '');
              //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
            if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
            
              this.level0 = 'false';
             this.selectedFirst = 1;
             this.selectedFirst1 = 1;
            }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
              
               this.level1 = 'false';
               this.selectedSecond = 2;
               this.selectedSecond1 = 2;
            }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
               this.level2 = 'false';
              this.selectedthird = 3;
              this.selectedthird1 = 3;
            }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
               this.level3 = 'false';
               this.selectedForth = 4;
               this.selectedForth1 = 4;
            }
          });
        }
    }
  
    updateCbValue(value, e:any){
  
      console.log(value)
      if(e.checked == true){
         if(value == '1'){
          this.selectedFirst = 1;
          return;
        }else if(value == '2'){
          this.selectedSecond = 2;
          return;
        }
        else if(value == '3'){
          this.selectedthird = 3;
          return;
        }else{
          this.selectedForth = 4;
          return;
        }
      }else{
        if(value == '1'){
          this.selectedFirst = 10;
          return;
        }else if(value == '2'){
          this.selectedSecond = 10;
          return;
        }
        else if(value == '3'){
          this.selectedthird = 10;
          return;
        }else{
          this.selectedForth = 10;
          return;
        }
      }
    }
  
    updateCb1Value(value, e:any){
  
      console.log(value)
      if(e.checked == true){
         if(value == '1'){
          this.selectedFirst1 = 1;
          return;
        }else if(value == '2'){
          this.selectedSecond1 = 2;
          return;
        }
        else if(value == '3'){
          this.selectedthird1 = 3;
          return;
        }else{
          this.selectedForth1 = 4;
          return;
        }
      }else{
        if(value == '1'){
          this.selectedFirst1 = 10;
          return;
        }else if(value == '2'){
          this.selectedSecond1 = 10;
          return;
        }
        else if(value == '3'){
          this.selectedthird1 = 10;
          return;
        }else{
          this.selectedForth1 = 10;
          return;
        }
      }
    }
    updateCbValue2(value, e:any){
      this.count = 0;
      console.log(value)
      if(e.checked == true){
        this.count = 1;
        if(value == '2'){
          this.selectedSecond = 2;
          return;
        }
      }else{
        if(this.count == 0){
          if(value == '2'){
            this.selectedSecond = 0;
            return;
          }
        } 
      }
    }
  
  
  
    contactChange(item:any, index){
      this.groupArray.push(item._id);
      this.addedContacts.push(item);
      this.items.splice(index, 1);
      if(item.senderId == this.userId){
        if(item.senderSetLevel == 1){
          this.level1Contacts = this.level1Contacts + 1;
        }else if(item.senderSetLevel == 2){
          this.level2Contacts = this.level2Contacts + 1;
        }else if(item.senderSetLevel == 3){
          this.level3Contacts = this.level3Contacts + 1;
        }else if(item.senderSetLevel == 4){
          this.level4Contacts = this.level4Contacts + 1;
        }
      }else{
        if(item.reciverSetLevel == 1){
          this.level1Contacts = this.level1Contacts + 1;
        }else if(item.reciverSetLevel == 2){
          this.level2Contacts = this.level2Contacts + 1;
        }else if(item.reciverSetLevel == 3){
          this.level3Contacts = this.level3Contacts + 1;
        }else if(item.reciverSetLevel == 4){
          this.level4Contacts = this.level4Contacts + 1;
        }
      }
      
    };
  
    memberChange(item, index){
      this.items.push(item);
      this.groupArray.splice(index, 1);
      this.addedContacts.splice(index, 1);
      if(item.senderId == this.userId){
        if(item.senderSetLevel == 1){
          this.level1Contacts = this.level1Contacts + 1;
        }else if(item.senderSetLevel == 2){
          this.level2Contacts = this.level2Contacts + 1;
        }else if(item.senderSetLevel == 3){
          this.level3Contacts = this.level3Contacts + 1;
        }else if(item.senderSetLevel == 4){
          this.level4Contacts = this.level4Contacts + 1;
        }
      }else{
        if(item.reciverSetLevel == 1){
          this.level1Contacts = this.level1Contacts + 1;
        }else if(item.reciverSetLevel == 2){
          this.level2Contacts = this.level2Contacts + 1;
        }else if(item.reciverSetLevel == 3){
          this.level3Contacts = this.level3Contacts + 1;
        }else if(item.reciverSetLevel == 4){
          this.level4Contacts = this.level4Contacts + 1;
        }
      }
    };
  
  
    updateGroupDate(group){
      console.log(group, "group")
      // var group = this.newdata;
      if(this.selectedFirst == 1){
         if(group[0].groupName == ''){
          this.componentService.presentToast('Please add group name.','danger');
     
         }else if(this.groupArray.length == 0){
          this.componentService.presentToast('Please add atleast one member.','danger');
           
         }else if(this.groupArray.length == 0){
          this.componentService.presentToast('Please add atleast one member.','danger');

         }else{
           this.componentService.showLoader();
            var groupObject ={
              'name': group[0].groupName,
              'groupdata':this.groupArray,
              'level':group[0].level,
              '_id':group[0]._id,
              'userId': this.userId
            };
            this.APIService.sendData('editgroup',groupObject).subscribe((data:any)=>{
             this.componentService.dismissLoader();
                let groupData = data;
                if(data.status == 0){
                  this.componentService.presentToast('Group name already exist','danger');
                
                }else{
                  this.componentService.presentToast('Group updated successfully','success')
                
                  this.navCtrl.navigateForward('managegroup',groupData);
                  
                }
            },
            err => {
             this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
                
         }
      }else{
        this.componentService.presentToast('Please open level first.','danger');
       
      }
    };
  
    root(){
      this.navCtrl.navigateRoot('dashboard');
    };
  
    contact(){
      this.navCtrl.navigateRoot('contacts');
    };
  
    toGroup(){
      this.navCtrl.navigateRoot('managegroup');
    }
  }