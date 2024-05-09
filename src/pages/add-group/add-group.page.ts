import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { EventService } from 'src/services/event.service';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.page.html',
  styleUrls: ['./add-group.page.scss'],
})
export class AddGroupPage  {
  userId : any;
  data: any;
  Newdata: any;
  one: any;
  selectedFirst:any = 0;
  selectedSecond:any = 0;
  selectedthird:any = 0;
  selectedForth:any = 0;
  selectedFirst1:any = 0;
  selectedSecond1:any = 0;
  selectedthird1:any = 0;
  selectedForth1:any = 0;
  mselected:Boolean = true;
  mselected1: Boolean = true;
  mselected3: Boolean = true;
  mselected2: Boolean = true;
  groupMembers:any = [];
  count: number;
  name : string;
  level : string;
  saveData : {};
  groupArray :any= [];
  level0 : string;
  level1 : string;
  level2 : string;
  level3 : string;
  alllevel:any;
  isBrowser:any;
    constructor(
      public navCtrl: NavController,
      public http:HttpClient,
       public loadingCtrl: LoadingController,
        public componentService: ComponentService,
        public APIService: APIService,
        public events: EventService) {
     this.http = http;
  
     events.subscribe('openLevel:changed', data => {  
        this.unlock();
      });
  
    }
  
    ionViewWillUnload() {
        this.events.unsubscribe('openLevel:changed');
      }
  
   
    ngOnInit() {
  
       this.isBrowser = localStorage.getItem('isBrowser');
        this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
        var userId  = localStorage.getItem('userinfo');
        if(this.alllevel){
          this.alllevel.forEach((value) => {
              console.log(value);
              var decrypted = CryptoJS.AES.decrypt(value, userId || '');
              console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
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
  
       // const loading = this.loadingCtrl.create({});
          this.componentService.showLoader()
          this.userId = localStorage.getItem('userinfo');
          return this.APIService.getData('getContactList',this.userId).subscribe((data:any) => {
                    this.componentService.dismissLoader()
                    console.log(data);
                    var newArr:any = [];
                    this.Newdata = data;
                    var count = 0;
                    if(data.length >0){
                      this.Newdata.forEach(eachObj => {
                        if(this.level0 == 'false'){
                    
                          if(eachObj.reciverSetLevel != 0 && eachObj.senderSetLevel != 0){
                            newArr.push(eachObj);
                            count = count + 1;
                          }
                        }else if (this.level1 == 'false'){
                          if(eachObj.reciverSetLevel != 0 &&  eachObj.senderSetLevel != 0){
                            newArr.push(eachObj);
                            count = count + 1;
                          }
                        }else if(this.level2 == 'false'){
                          if(eachObj.reciverSetLevel != 0  && eachObj.senderSetLevel != 0){
                            newArr.push(eachObj);
                            count = count + 1;
                          }
                        }else if(this.level3 == 'false'){
                          if(eachObj.reciverSetLevel != 0 && eachObj.senderSetLevel != 0){
                            newArr.push(eachObj);
                            count = count + 1;
                          }
                        }
                      })
                      this.data = newArr;
                    }
                    
                },
              err => {
                  this.componentService.dismissLoader()
                  this.showTechnicalError();
              });
    };
  
    
    contactChange(item, index){
      console.log(item)
       this.groupMembers.push(item);
       this.groupArray.push(item._id);
       this.data.splice(index, 1);
       
    };
  
    memberChange(item, index){
      
        this.data.push(item);
        this.groupArray.splice(index, 1);
        this.groupMembers.splice(index, 1);
    };
  
  
    updateCbValue(value, e:any){
      this.count = 0;
      console.log(value)
      if(e.checked == true){
        this.count = 1;
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
        if(this.count == 0){
          if(value == '1'){
            this.selectedFirst = 0;
            return;
          }else if(value == '2'){
            this.selectedSecond = 0;
            return;
          }
          else if(value == '3'){
            this.selectedthird = 0;
            return;
          }else{
            this.selectedForth = 0;
            return;
          }
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
          this.selectedFirst1 = 0;
          return;
        }else if(value == '2'){
          this.selectedSecond1 = 0;
          return;
        }
        else if(value == '3'){
          this.selectedthird1 = 0;
          return;
        }else{
          this.selectedForth1 = 0;
          return;
        }
      }
    }
  
    saveGroup(){
      if(this.selectedFirst == 1){
        if(this.name == undefined || this.name == ''){
          this.componentService.presentToast('Please add group name','danger');
          
        }else if(this.level == undefined || this.level == ''){
          
          this.componentService.presentToast('Please select level','danger');
        }else if(this.groupMembers.length == 0){
          this.componentService.presentToast('Please select atleast one contact','danger');

        }else{
          this.saveData = {
            name : this.name,
            userLevel :  this.level,
            groupdata : this.groupArray,
            userId : localStorage.getItem('userinfo')
          }
          // const loading = this.loadingCtrl.create({});
          this.componentService.showLoader()
          return this.APIService.sendData('addGroup',this.saveData).subscribe((data:any) => {
            let groupData = data;
            this.componentService.dismissLoader()
            if(data.status == 0){
          this.componentService.presentToast('Group name already exist.','danger');

            }else{
        
              this.navCtrl.navigateForward('managegroup',groupData);
            }
            
          },
            err => {
                this.componentService.dismissLoader()
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
  
    unlock(){
      this.selectedFirst = 0;
      this.selectedFirst1 = 0;
      this.selectedthird = 0;
      this.selectedthird1 = 0;
      this.selectedSecond = 0;
      this.selectedSecond1 = 0;
      this.selectedForth = 0;
      this.selectedForth1 = 0;
      this.level0 = 'true';
      this.level1 = 'true';
      this.level2 = 'true';
      this.level3 = 'true';
       this.alllevel = JSON.parse(localStorage.getItem('alllevel')|| '');
        var userId  = localStorage.getItem('userinfo');
        if(this.alllevel){
          this.alllevel.forEach((value) => {
              var decrypted = CryptoJS.AES.decrypt(value, userId || '');
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
  
    showTechnicalError(type :any= null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
      this.componentService.presentToast( 'Technical error, Please '+msg,'info');
     
    }
  }