import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController,ToastController,LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/api.service';
import { ComponentService } from 'src/services/component.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import * as $ from 'jquery';
import { ExportBidPage } from '../export-bid/export-bid.page';
import { Router } from '@angular/router';
@Component({
  selector: 'app-viewbid',
  templateUrl: './viewbid.page.html',
  styleUrls: ['./viewbid.page.scss'],
})
export class ViewbidPage {
  all_bids:any;
  all_bid_ids:any = [];
  sorted_bids:any;
  jobId:any;
  selected_bids:any;
  APIURL:any;
  filter:any;
  isBrowser = localStorage.getItem('isBrowser');
  baseUrl = localStorage.getItem('baseUrl');
  userId = localStorage.getItem('userinfo');
  user_name = localStorage.getItem('userName');
  timestamp:any;
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  trades:any = [];
  trade_ids:any = [];
  tradeTypes:any = [];
  tradesType_names:any = [];
  filter_trades:any = [];
  filter_trade_names:any = [];
  filter_list:any = [];
  nav_filter:any = 'default';
  order_default:any = 'trade_name';
  order_default_p:any = false;
  order_advanced:any = 'trade_task';
  order_advanced_p:any = false;
  sort_icon:Boolean = true;
  image_types:any;
  stateData:any='';
    constructor(
      private transfer: FileTransfer, 
      private file: File,
      public modalCtrl: ModalController, 
      public APIService: APIService, 
      public navCtrl: NavController, 
      public componentService: ComponentService, 
      public alertCtrl: AlertController, 
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController,
      public router:Router) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
this.jobId =  this.stateData['jobId'];
      this.selected_bids = [];
      this.image_types = ['png','jpg','jpeg','gif'];
      var current_date = new Date();
      this.timestamp = current_date.getTime();
      if(this.jobId == undefined)
    {
      var localJobId = localStorage.getItem('currentJobId');
      if(localJobId != '' && localJobId != undefined && localJobId != null){
        this.jobId = localJobId;
      }
      else{
        this.navCtrl.navigateBack('managejob',{state:{
          is_direct : '0'
        }});
      }
    }
      this.APIURL = localStorage.getItem('APIURL');
      
    }
  
    ionViewDidEnter(){
      this.getBids();
    }
  
    ionViewDidLoad(){
      this.caclHeight();
      if(JSON.parse(localStorage.getItem('saved_filter_list')!) != null && JSON.parse(localStorage.getItem('saved_filter_list')!) != undefined){
        this.filter_list = JSON.parse(localStorage.getItem('saved_filter_list')!);
        this.filter_trades = JSON.parse(localStorage.getItem('saved_filter_trades')!);
        this.filter_trade_names = JSON.parse(localStorage.getItem('saved_filter_trade_names')!);
      }
    }
  
    saveFilters(filter_list,filter_trades,filter_trade_names){
      localStorage.setItem('saved_filter_list',JSON.stringify(filter_list));
      localStorage.setItem('saved_filter_trades',JSON.stringify(filter_trades));
      localStorage.setItem('saved_filter_trade_names',JSON.stringify(filter_trade_names));
    }
  
    showTechnicalError(type:any = null){
      var msg = (type == '1') ? 'try later.' : 'reload the page.'
        this.componentService.presentToast('Technical error, Please '+msg,'danger');
    }
  
    scroll(direction){
      var cond;
      if(direction == 'right'){
        cond = { scrollLeft: "+=200px" };
      }
      else{
        cond = { scrollLeft: "-=200px" };
      }
      $('.drop-scroll').animate(cond, "slow");
    }
  
    caclHeight(){
      var fixed_div = document.getElementById("calc_height_bids"+this.timestamp);
        if(fixed_div != null){
          var fixed_div_height = fixed_div.offsetHeight;
          document.getElementById('fixed_height_bids'+this.timestamp)!.style.marginTop = fixed_div_height+'px';
        }
    }
  
      addFilter(trade,filter){
      if(trade.tradeId == 0){
        if(this.filter_trade_names.indexOf(trade.trade_name) == -1){
          this.filter_trade_names.push(trade.trade_name);
          this.filter_list.push(trade);
        }
        else{
          this.filter_trade_names.splice(this.filter_trade_names.indexOf(trade.trade_name),1);
          this.removeArray(this.filter_list,trade);
        }
      }
      else{
        if(this.filter_trades.indexOf(trade.tradeId) == -1){
          this.filter_trades.push(trade.tradeId);
          this.filter_list.push(trade);
        }
        else{
          this.filter_trades.splice(this.filter_trades.indexOf(trade.tradeId),1);
          this.removeArray(this.filter_list,trade);
        }
      }
      this.filterTrades(filter);
      this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
    }
  
    filterTrades(filter = 'all'){
  
      if(filter == 'all'){
        filter = "['0','1','2','3','4']";
      }
    var self = this;
      this.sorted_bids = [];
    this.all_bids.forEach(function(data){
      if(self.filter_trades.length > 0 || self.filter_trade_names.length > 0){
        if(self.filter_trades.indexOf(data.tradeId) >= 0 && filter.indexOf(data.isAwarded) >= 0)
        {
          self.sorted_bids.push(data);
        }
        else{
          if(self.filter_trade_names.indexOf(data.trade_name) >= 0 && filter.indexOf(data.isAwarded) >= 0){
            self.sorted_bids.push(data);
          }
        }
      }
      else{
        if(filter.indexOf(data.isAwarded) >= 0)
        {
          self.sorted_bids.push(data);
        }
      }
    });
    }
  
    cancelFilter(trade,index,filter){
      if(trade.tradeId == 0){
        this.filter_trade_names.splice(this.filter_trade_names.indexOf(trade.trade_name),1);
      }
      else{
        this.filter_trades.splice(this.filter_trades.indexOf(trade.tradeId),1);
      }
      this.filter_list.splice(index,1);
    this.filterTrades(filter);
    this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
    }
  
    onDropdownShow(){
      $(".shadow").show();
    }
  
    closeDropDown(){
      if($(".ng2-dropdown-menu").hasClass("ng2-dropdown-menu--open") == true){
        $(".ng2-dropdown-button").click();
      }
      $(".shadow").hide();
    }
  
    cancelAllFilters(type,filter){
      if(type == 'd'){
        this.filter_trade_names = [];
        this.removeAllFilters(type);
      }
      else{
        this.filter_trades = [];
        this.removeAllFilters(type);
      }
      this.filterTrades(filter);
      // if(this.filter_trades.length == 0 && this.filter_trade_names.length == 0){
      //   this.sorted_bids = this.all_bids;
      // }
      this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
    }
  
    removeAllFilters(type){
      if(this.filter_list.length > 0){
        var count = 0,all_filters:any = [];
        this.filter_list.forEach(function(trade){
          if(type == 'd'){
            if(trade.tradeId != 0){
              all_filters.push(trade);
            }
          }
          if(type == 'a'){
            if(trade.tradeId == 0){
              all_filters.push(trade);
            }
          }
          count = count + 1;
        }); 
        this.filter_list = all_filters;
      }
    }
  
    sortTrades(type){
      if(type == 'a'){
        this.sort_icon = true;
        this.order_default = 'trade_name';
        this.order_advanced = 'trade_task';
        this.sortOrder();
      }
      if(type == 'n'){
        this.sort_icon = false;
        this.order_default = 'total';
        this.order_advanced = 'total';
        this.sortOrder();
      }
    }
  
    sortOrder(){
      if(this.order_default_p == false){
      this.order_default_p = true;
    }
    else{
      this.order_default_p = false;
    }
    if(this.order_advanced_p == false){
      this.order_advanced_p = true;
    }
    else{
      this.order_advanced_p = false;
    }
    }
  
    getBids(filter = 'all'){
      this.trades = [];
    this.trade_ids = [];
    this.tradeTypes = [];
    this.tradesType_names = [];
    this.all_bid_ids = [];
      var self = this,index;
      this.componentService.showLoader();
      this.APIService.getData('myBids',this.jobId).subscribe((bids)=>{
        this.componentService.dismissLoader();
        this.all_bids = bids;
        if(this.all_bids.length > 0)
          {
            var obj,obj1;
            var returnArr:any = [];
            this.all_bids.forEach(function(data){
              var all_cats :any= [],all_subm_cats :any= [];
              var all_cats_values :any= [];
              if(data.bid_breakdown != undefined){
                if(data.bid_breakdown.submitted_categories_vals.length > 0){
                  data.bid_breakdown.submitted_categories_vals.forEach(function(cats){
                    all_subm_cats.push(cats.cat);
                    if(cats.success == true){
                      all_cats.push(cats.cat);
                      all_cats_values[cats.cat] = cats;
                    }
                  })
                }
              }
              var indicator = true;
              if(data.bid_breakdown != undefined){
  
                if(data.required_uploads.length > 0){
                  data.required_uploads.forEach(function(req_upload){
                    if(all_cats.indexOf(req_upload) == -1 && req_upload != 'Bid breakdown'){
                      indicator = false;
                    }
                  });
                }
  
                if(data.required_uploads.indexOf('Bid breakdown') >= 0 && indicator == true && ((data.bid_breakdown.success == false) || (data.bid_breakdown.bid_breakdown_type == '0' && data.bid_breakdown.bid_breakdown_files.length == 0) || (data.bid_breakdown.bid_breakdown_type == '1' && (data.bid_breakdown.bid_breakdown_manual == '' || data.bid_breakdown.bid_breakdown_manual == null || data.bid_breakdown.bid_breakdown_manual == undefined)))){
                  indicator = false;
                }
                if(data.bid_breakdown.submitted_categories_vals.length > 0 && indicator == true){
                  var counter = 0;
                  data.bid_breakdown.submitted_categories_vals.forEach(function(cat_val){
                    if(cat_val.success == false && data.required_uploads.indexOf(cat_val.cat) >= 0){
                      indicator = false;
                    }
                    counter = counter + 1;
                    if(counter == data.bid_breakdown.submitted_categories_vals.length){
                        do_action();
                    }
                  });
                }
                else{
                  do_action();
                }
              }
              else{
                do_action();
              }
  
              function do_action(){
                obj1 = {
                  bid_comments : data.bid_comments,
                  bid_date : data.bid_date,
                  files : (data.files == null || data.files == '') ? [] : JSON.parse(data.files), 
                  bid_status : data.bid_status,
                  posted_by : data.posted_by,
                  posted_email : data.posted_email,
                  bid : data._id,
                  Iid : data.bidId,
                  userId : data.userId,
                  reply_comment : data.reply_comment,
                  isAwarded : data.isAwarded,
                  bid_breakdown : (data.bid_breakdown != undefined) ? data.bid_breakdown : {},
                  all_cats : all_cats,
                  all_subm_cats : all_subm_cats,
                  all_cats_values : all_cats_values,
                  indicator : indicator,
                  notes : data.notes
                };
                obj = {
                  trade_name : data.trade_name,
                  trade_icon : data.trade_icon,
                  trade_task : data.trade_task,
                  tradeId : data.tradeId,
                  jobId : data.jobId,
                  Iid : data.bidId,
                  isAwarded : data.isAwarded,
                  uploader_categories : data.uploader_categories,
                  required_uploads : data.required_uploads,
                  all_bids : [obj1]
                };
                if(self.all_bid_ids.indexOf(data.tradeId) >= 0){
                  var index = self.all_bid_ids.indexOf(data.tradeId);
                  returnArr[index]['all_bids'].push(obj1);
                }
                else{
                  self.all_bid_ids.push(data.tradeId);
                  returnArr.push(obj);
                }
              }	      		
            });
            this.all_bids = returnArr;
          }
        this.sorted_bids = this.all_bids;
        console.log(this.sorted_bids)
        if(this.all_bids != ''){
          this.all_bids.forEach(function(data){
            if(self.trade_ids.indexOf(data.tradeId) >= 0){
              index = self.trade_ids.indexOf(data.tradeId);
              self.trades[index]['total'] = self.trades[index]['total'] + 1;
            }
            else{
              self.trades.push({
                tradeId : data.tradeId,
                trade_name : data.trade_name,
                trade_icon : data.trade_icon,
                trade_task : data.trade_task,
                total : 1
              });
              self.trade_ids.push(data.tradeId);
            }
  
            if(self.tradesType_names.indexOf(data.trade_name) >= 0){
              index = self.tradesType_names.indexOf(data.trade_name);
              self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
            }
            else{
              self.tradeTypes.push({
                tradeId : 0,
                trade_name : data.trade_name,
                trade_icon : data.trade_icon,
                trade_task : 'All '+data.trade_name,
                total : 1
              });
              self.tradesType_names.push(data.trade_name);
            }
          });
        }
        this.filterTrades(filter);
      },
        err => {
            this.componentService.dismissLoader();;
            this.showTechnicalError();
        });
    }
  
    goToTrade(jobId,tradeId){
      this.navCtrl.navigateForward('EdittradePage', {state:{
        tradeId : tradeId, 
        job_id : jobId, 
        isEdit : '1',
        from_bids : '1'
      }})
    }
  
    async addNote(index,ind,notes,bid){
      let modal = this.modalCtrl.create({
        component:'NotesPage',
        componentProps:{note: notes,bidId:bid}
      });
         (await modal).onDidDismiss().then(res => {
          var data = res.data;
          if(data != undefined && data != '' && data != null)
            {  
           this.componentService.showLoader();
          this.APIService.sendData('addBidNotes',data).subscribe((bids)=>{
            this.componentService.dismissLoader();;
            this.sorted_bids[index]['all_bids'][ind]['notes'] = data.note;
          this.componentService.presentToast( 'Notes added successfully.','success')
        },
          err => {
            this.componentService.dismissLoader();;
              this.showTechnicalError('1');
          });
            }
        });
        (await modal).present();
    }
  
    notifyBidder(bidId,jobId,userId,email,name,bid_comments,bid_breakdown,required_uploads,all_cats){
      var self = this;
      var leftOverCats:any = [];
      if(required_uploads.length > 0){
      required_uploads.forEach(function(req_upload){
        if(all_cats.indexOf(req_upload) == -1 && req_upload != 'Bid breakdown'){
          if(leftOverCats.indexOf(req_upload) == -1){
            leftOverCats.push(req_upload);
          }
        }
      });
    }
    if(required_uploads.indexOf('Bid breakdown') >= 0  && ((bid_breakdown['success'] == false) || (bid_breakdown['bid_breakdown_type'] == '0' && bid_breakdown['bid_breakdown_files'].length == 0) || (bid_breakdown['bid_breakdown_type'] == '1' && (bid_breakdown['bid_breakdown_manual'] == '' || bid_breakdown['bid_breakdown_manual'] == null || bid_breakdown['bid_breakdown_manual'] == undefined)))){
      if(bid_breakdown['success'] != true){
        if(leftOverCats.indexOf('Bid breakdown') == -1){
          leftOverCats.push('Bid breakdown');
        }
      }
    }
    if(bid_breakdown['submitted_categories_vals'].length > 0){
      var counter = 0;
      bid_breakdown['submitted_categories_vals'].forEach(function(cat_val){
        if(cat_val.success == false && required_uploads.indexOf(cat_val.cat) >= 0){
          if(leftOverCats.indexOf(cat_val.cat) == -1){
            leftOverCats.push(cat_val.cat);
          }
        }
        counter = counter + 1;
        if(counter == bid_breakdown['submitted_categories_vals'].length){
          self.finalNotifyBidder(bidId,jobId,userId,email,name,bid_comments,leftOverCats);
        }
      });
    }
    else{
      self.finalNotifyBidder(bidId,jobId,userId,email,name,bid_comments,leftOverCats);
    }
    }
  
    async downloadFiles(file,tradeId,main_file,index,ind,f_ind,direct_href){
    let modal = this.modalCtrl.create({
      component:ExportBidPage,
      componentProps: {
        page_type : '1',
        direct_link : '1',
        direct_href : direct_href
      }
    });
    (await modal).onDidDismiss().then(res => {
      var data = res.data;
        if(data != undefined && data != '' && data != null){  
          this.finalDownload(data,file,tradeId,main_file,index,ind,f_ind);
        }
      });
      (await modal).present();
    }
  
    finalDownload(destination,old_path,tradeId,file,index,ind,f_ind){
    var msg,path;
    var file_type = (this.image_types.indexOf(old_path.split('.').pop(-1)) >= 0) ? '0' : '1';
    if(destination == 'local'){
      msg = 'File is downloading on your local device.';
      //download on local
      if(this.isBrowser == 'false'){
        this.downloadAndroid(this.APIURL +'/salvum/directory/bids_data/'+file,file);
      }
      else{
        // var unique_id = 'down_'+index+ind+f_ind;
        // console.log(unique_id)
        // $('#'+unique_id).trigger("click");
        this.downloadFile(file,tradeId);
      }
    }
    else if(destination == 'job'){
      path = 'directory/jobs_data/';
      msg = 'File has been saved to '+(file_type == '0' ? 'images' : 'docs')+' section of the job dashboard.';
    }
    else{
      path = 'directory/'+this.userId+'/files/level1/';
      msg = 'File has been saved to level1 of your file manager.';
    }
    if(destination != 'local'){	
      this.APIService.sendData('saveBidPdf',{file_type: file_type, only_copy : '1', old_path : old_path, path : path, type : destination,jobId : this.jobId, tradeId : tradeId}).subscribe((result)=>{
        
          this.componentService.presentToast( msg,'success');
      },
        err => {
          this.componentService.presentToast( 'Technical error,Plz try after some time.','danger');
        });
    }
    }
  
    finalNotifyBidder(bidId,jobId,userId,email,name,bid_comments,leftOverCats){
     this.componentService.showLoader();
      this.APIService.sendData('notifyBidder',{bidId: bidId, jobId:jobId, userId: userId,email:email,name:name,bid_comments:bid_comments, from_user: this.user_name,leftOverCats:leftOverCats}).subscribe((result:any)=>{
        this.componentService.dismissLoader();;
        if(result.status == 1){
          this.componentService.presentToast( 'Notification sent successfully.','success');

      }
      else{
        this.componentService.presentToast(  'Error, Please try later.','danger');

      }
    },
      err => {
        this.componentService.dismissLoader();;
          this.showTechnicalError('1');
      });
    }
  
    updateBidBreakdown(bidId,bid_breakdown){
      this.APIService.sendData('updateBidBreakdown',{bidId: bidId, bid_breakdown: JSON.stringify(bid_breakdown)}).subscribe((result)=>{
        //updated
    });
    }
  
    breakdownChecked(event,index,ind,bidId,catname){
      if(event.checked == true){
        this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['success'] = true;
        this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['isAdmin'] = true;
      }
      else{
        this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['success'] = false;
        this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['isAdmin'] = true;
      }
      this.changeIndicator(index,ind);
    }
  
    catChecked(event,index,ind,bidId,catname){
      var cat_ind;
      if(event.checked == true){
        if(this.sorted_bids[index]['all_bids'][ind]['all_cats'].indexOf(catname) >= 0){	
          this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['success'] = true;
          this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['isAdmin'] = true;
        }
        else{
          this.sorted_bids[index]['all_bids'][ind]['all_cats'].push(catname);
          this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname] = {success : true, isAdmin : true};
        }
  
        if(this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].indexOf(catname) >= 0){
          cat_ind = this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].indexOf(catname);
          this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'][cat_ind]['success'] = true;
          this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'][cat_ind]['isAdmin'] = true;
        }
        else{
          this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].push(catname);
          this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'].push({success : true, isAdmin : true, cat: catname});
        }
      }
      else{
        cat_ind = this.sorted_bids[index]['all_bids'][ind]['all_cats'].indexOf(catname);
        if(this.sorted_bids[index]['required_uploads'].indexOf(catname) >= 0){
          this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['success'] = false;
        this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['isAdmin'] = true;
      }
      else{
        this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['isAdmin'] = true;
      }
  
      if(this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].indexOf(catname) >= 0){
          cat_ind = this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].indexOf(catname);
          this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'][cat_ind]['success'] = false;
        this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'][cat_ind]['isAdmin'] = true;
        }
      }
  
      this.changeIndicator(index,ind);
      this.updateBidBreakdown(bidId,this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']);
    }
  
    changeIndicator(index,ind){
      var self = this;
      var indicator = true;
      if(this.sorted_bids[index]['required_uploads'].length > 0){
      this.sorted_bids[index]['required_uploads'].forEach(function(req_upload){
        if(self.sorted_bids[index]['all_bids'][ind]['all_cats'].indexOf(req_upload) == -1 && req_upload != 'Bid breakdown'){
          indicator = false;
        }
      });
    }
    if(this.sorted_bids[index]['required_uploads'].indexOf('Bid breakdown') >= 0 && indicator == true && ((this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['success'] == false) || (this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_type'] == '0' && this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_files'].length == 0) || (this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_type'] == '1' && (this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_manual'] == '' || this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_manual'] == null || this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_manual'] == undefined)))){
      if(this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['success'] != true){
        indicator = false;
      }
    }
    if(this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'].length > 0 && indicator == true){
      var counter = 0;
      this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'].forEach(function(cat_val){
        if(cat_val.success == false && self.sorted_bids[index]['required_uploads'].indexOf(cat_val.cat) >= 0){
          indicator = false;
        }
        counter = counter + 1;
        if(counter == self.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'].length){
            self.sorted_bids[index]['all_bids'][ind]['indicator'] = indicator;
        }
      });
    }
    else{
      this.sorted_bids[index]['all_bids'][ind]['indicator'] = indicator;
    }
    //console.log(this.sorted_bids[index])
    }
  
    downloadAndroid(url,name) {
      this.componentService.presentToast('File downloaded.','success');

      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(url, this.file.externalRootDirectory + name.split('____').pop()).then((entry) => {
      this.componentService.presentToast('File downloaded.','success');
      }, (error) => {
      this.componentService.presentToast('Error','danger');

      });
    }
  
    downloadFile(file_name,tradeId)
    {
      var data = {
        jobId : this.jobId,
        tradeId : tradeId,
        name : file_name
      };
      this.APIService.sendData('addDownloads',data).subscribe((add_download)=>{
      
        this.componentService.presentToast('File saved to your downloads.','success');

      },
        err => {
            this.showTechnicalError('1');
        });
    }
  
    clickTrade()
    {
      var filterTradeId:any = localStorage.getItem('filterTradeId');
      var previousId = localStorage.getItem('previousId');
      if(filterTradeId == '0')
      {
        this.sorted_bids = this.all_bids;
        localStorage.setItem('previousId',filterTradeId);
        return false;
      }
      if(filterTradeId != previousId)
      {
        this.sorted_bids = [];
        var sortedArray:any = [];
        localStorage.setItem('previousId',filterTradeId);
        this.all_bids.forEach(function(bid){
          if(bid.tradeId == filterTradeId)
          {
            sortedArray.push(bid);
          }
        }); 
        this.sorted_bids = sortedArray;
      }
    }
  
    async addManualBids()
    {
      let modal = this.modalCtrl.create({
        component:'AddbidPage',
        componentProps:{jobId: this.jobId}
      }
        );
         (await modal).onDidDismiss().then(res => {
          var data = res.data;
          if(data != undefined && data != '')
            {  
              if(data == '1')
              {
          this.componentService.presentToast('Bid has been added successfully.','success');

          // this.fetchBids();
          this.getBids(this.filter);
              }
              else
              {
          this.componentService.presentToast('Error, plz try later.','danger');

              }
            }
        });
            (await modal).present();
    }
  
  
    insertToArray(event,bidId){
    if(event.target.checked == true)
    {
      this.selected_bids.push(bidId);
    }
    else
    {
      this.removeArray(this.selected_bids, bidId);
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
  
    async deleteBids()
    {
      if(this.selected_bids.length > 0)
      {
        let confirm = this.alertCtrl.create({
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
                  this.APIService.sendData('deleteBids',{'bidIds' : this.selected_bids}).subscribe((deleted:any)=>{
                    if(deleted.status == 1)
                    {
                        this.componentService.dismissLoader();
                     this.componentService.presentToast('Bids deleted.','danger');

                           this.selected_bids = [];
                           // this.fetchBids();
                           this.getBids(this.filter);
                    }
                    else
                    {
                        this.componentService.dismissLoader();
                     this.componentService.presentToast('Error, plz try later.','danger');
     }
                  },
              err => {
                  this.componentService.dismissLoader();;
                  this.showTechnicalError('1');
              });
                }
              }
            ]
          });
          (await confirm).present();
      }
      else
      {
                 this.componentService.presentToast('Please select atleast one checkbox.','danger');

      }
      
    }
  
    async awardJob(InvId,bidId,jobId,tradeId,toUser,to_name,to_email)
    {
      let confirm = this.alertCtrl.create({
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
               var data= {
               'InvId': InvId,
               'bidId':bidId,
               'jobId':jobId,
               'tradeId':tradeId,
                'status':'1',
                'userId':this.userId,
                'toId':toUser,
                'to_email':to_email,
                'to_name':to_name,
                'user_name':this.user_name,
                'baseUrl':this.baseUrl
               }
                this.APIService.sendData('awardJob',data).subscribe((award:any)=>{
                  if(award.status == 1)
                  {
                    this.componentService.dismissLoader();
                      this.componentService.presentToast('Job has been awarded successfully.','success');

                       // this.fetchBids();
                       this.getBids(this.filter);
                  }
                  else if(award.status == 2)
                  {
                    this.componentService.dismissLoader(); 
                      this.componentService.presentToast('You have alreday awarded job under this trade.','danger');

                  }
                  else
                  {
                      this.componentService.dismissLoader();
                      this.componentService.presentToast( 'Error, plz try later.','danger');
                  }
                },
            err => {
                this.componentService.dismissLoader();;
                this.showTechnicalError('1');
            });
              }
            }
          ]
        });
        (await confirm).present();
    }
  
    signContract(Iid,Bid,tradeId)
    {
      this.navCtrl.navigateForward('AddcontractPage',{state: {
        InvId : Iid, 
        BidId : Bid,
        jobId : this.jobId,
        tradeId : tradeId
      }
    });
    }
  
      async downloadPdf(InvId,tradeId){
      let modal = this.modalCtrl.create({
        component: 'PdfPage',
        componentProps:{
          jobId : this.jobId,
          tradeId : tradeId,
          bidId : InvId
        }
      });
        (await modal).present();
    }
  
      async exportPdf(bid,comment,files,breakdown,posted_by,posted_email,tradeId){
        bid.posted_by = posted_by;
        bid.posted_email = posted_email;
      let modal = this.modalCtrl.create({
        component:ExportBidPage, 
        componentProps:{
          jobId : this.jobId,
          tradeId : tradeId,
          bid : bid,
          comment : comment,
          files : files,
          bid_breakdown : breakdown,
        }
      });
        (await modal).present();
    }
  
      async cancelContract(InvId,BidId){
      let confirm = this.alertCtrl.create({
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
              this.APIService.sendData('cancelContract',{'InvId':InvId,'bidId':BidId}).subscribe((canceled:any)=>{
                if(canceled.status == 1)
                {
                  this.componentService.dismissLoader();
                    this.componentService.presentToast('Contract has been canceled.','success');

                     // this.fetchBids();
                     this.getBids(this.filter);
                }
                else
                {
                    this.componentService.dismissLoader();
                    this.componentService.presentToast( 'Error, plz try later.','danger');
                }
              },
          err => {
              this.componentService.dismissLoader();;
              this.showTechnicalError('1');
          });
            }
          }
        ]
      });
      (await confirm).present();
    }
  
    replyBid(userId,tradeId,bidId){ 
      if(userId == undefined || userId == null || userId == ''){
        $(".comment_box").hide();
        $(".comment_"+bidId).show();
      }
      else{
        this.navCtrl.navigateForward('compose',{state:{
          userId : userId,
          tradeId : tradeId,
          jobId : this.jobId,
          bid_reply : '1', 
        }})
      }
    }
  
    sendReply(bidId,reply_comments,index,posted_email,name,Iid){
      if(reply_comments != '' && reply_comments != null && reply_comments != undefined){
        var baseUrl = localStorage.getItem('baseUrl');
        this.sorted_bids[index].reply_comment = reply_comments;
        this.APIService.sendData('replyComment',{
          'bidId':bidId,'bid_comment':reply_comments,'email':posted_email,'name':name,'Iid':Iid,'baseUrl':baseUrl}).subscribe((result)=>{
         
             this.componentService.presentToast('Replied successfully.','success');

        },
        err => {
            this.showTechnicalError('1');
        });
      }
      else{
        
             this.componentService.presentToast('Please enter reply.','danger');
      }
    }
  
    root(){
      this.navCtrl.navigateRoot(['dashboard',"0"]);
    };
      
    goToJobs(){
      this.navCtrl.navigateBack('managejob',{state:{
        is_direct : '0'
    }});
    };
  
    backToPage(){
      this.navCtrl.navigateBack('trade-dashboard',{state:{
      jobId : this.jobId
    }})
    }
  
  }
  