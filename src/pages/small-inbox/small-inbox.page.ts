import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController, ToastController, IonContent } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
// import { DragulaService } from 'ng2-dragula';
import * as $ from 'jquery';
// import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
// import { File } from '@ionic-native/file';
import { EventService } from 'src/services/event.service';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
let _uniqueId = 0;
@Component({
    selector: 'app-small-inbox',
    templateUrl: './small-inbox.page.html',
    styleUrls: ['./small-inbox.page.scss'],
})
export class SmallInboxPage {
    @ViewChild(IonContent) content: IonContent;
    @ViewChild('scroll') scroll: any;
    userId: any = '';
    items: any;
    pages: any;
    date: any;
    notis_data: any;
    public displayText: any;
    selectedAll:boolean;
    baseUrl: any = '';
    editor_tab: string = 'format';
    baseUrl_main: any = localStorage.getItem('baseUrl');
    openedLevel: any = [];
    User: any;
    levelArray: any;
    directory: any;
    filterValues: any;
    all_directory: any;
    selectedGroups: any = [];
    file_path: any;
    filterStorages: any;
    all_levels: any;
    timestamp: any;
    details: any = '';
    reply: String = '';
    data: any = [];
    subject: String;
    to: any = [];
    mails: any = [];
    toId: any = [];
    bccId: any = [];
    ccId: any = [];
    replyMail: any = [];
    smailData: any = [];
    frd_mailData: any = [];
    preState: any;
    which_level: any;
    testCheckboxOpen: boolean;
    testCheckboxResult: any = [];
    ccCheckboxResult: any = [];
    allowed_levels: any = [];
    isBrowser: any;
    selectedLevel: any = '';
    selectedFolder: any = '';
    has_loaded: any = '0';
    is_folder_sel: any = '0';
    is_main: any;
    shownGroup: any = [];
    showNodeChild: any;
    showNodeStatic: any;
    selected_trade_icon: any = null;
    selectedNode: any;
    enable_level1: any;
    enable_level2: any;
    enable_level3: any;
    enable_level4: any;
    opened_levels: any;
    shown_levels: any;
    bread_level: any = '';
    bread_folder: any = '';
    bread_level_node: any = [];
    bread_folder_node: any = [];
    bread_static: any = '';
    groups: any = [];
    Node: any = {};
    prevId: any = null;
    drag_mailId: any = null;
    folderId: any;
    foldername: String;
    thread: boolean = false;
    reverse: boolean = true;
    action: String = '';
    f1: boolean = true;
    f2: boolean = true;
    f3: boolean = true;
    f4: boolean = true;
    attacments: any = [];
    deleteSmails: any = [];
    q1: any = [];
    q2: any = [];
    oldValue: any;
    level: any;
    bccCheckboxResult: any = [];
    override: Boolean = false;
    isGroupCreated: Boolean = false;
    alllevel: any = '';
    allemails: any = [];
    term: string;
    readFilterData: any = [];
    jobFilterData: any = [];
    searchFilterData: any = [];
    isSearchFilterActive: boolean = false;
    isReadFilterActive: boolean = false;
    isJobFilterActive: boolean = false;
    jobListingResult: any = [];
    jobIndexResult: any = [];
    showSmailThumb: Boolean = false;
    trades: any = [];
    selectedTrade = '';
    selectedType = '';
    selectedFolderId = '';
    selecetedFolderNode: any;
    selectedFirst: any = 0;
    selectedSecond: any = 0;
    selectedthird: any = 0;
    selectedForth: any = 0;
    fn_counter: any = 0;
    selectedJob: any;
    print_array: any;
    gaming: any;
    desc: any;
    dragObj: any;
    searchTerm: any = '';
    uniqueBagId: string = 'dragula-bag-' + _uniqueId++;
    messages = [
        { title: 'Level2 Contact Update', time: '6:16 AM 14 May' },
        { title: 'Unconnected User', time: '3:17 AM 14 May' },
        { title: 'Level2 Contact Update', time: '10:36 AM 11 May' },
        // Add more messages as needed
      ];
    constructor(
        // private transfer: FileTransfer,
        // private file: File,
        public events: EventService,
        public navCtrl: NavController,
        public componentService: ComponentService,
        public APIService: APIService,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        public datepipe: DatePipe,
        private alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public route: ActivatedRoute,
        // private dragulaService: DragulaService
        ) {
        this.timestamp = new Date().getTime();

        if (history.state.from_compose == '1') {
            this.reverse = false;
        }
        localStorage.removeItem('smail_path');
        this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
        var userId = localStorage.getItem('userinfo');
        var isLevelOpened = false;
        if (this.alllevel) {
            this.alllevel.forEach((value) => {
                // console.log(value);
                var decrypted = CryptoJS.AES.decrypt(value, userId || '');
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    isLevelOpened = true;
                }
            });
        }


        this.baseUrl = localStorage.getItem('APIURL');
        this.userId = localStorage.getItem('userinfo');
        this.all_levels = JSON.parse(localStorage.getItem('alllevel') || '');
        this.openedLevel = [];
        this.allowed_levels = [];
        this.levelArray = [];
        var i;
        if (this.all_levels && this.all_levels.length > 0) {
            this.all_levels.forEach((value) => {
                // console.log(value);
                this.allowed_levels = [];
                var decrypted = CryptoJS.AES.decrypt(value, userId || '');

                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                    this.openedLevel = [{
                        'level': 1,
                        'checked': true
                    }];
                    this.levelArray = [{
                        'level': 1,
                        'checked': true
                    }];
                    this.allowed_levels = [];
                    for (i = 1; i <= 1; i++) {
                        this.allowed_levels.push('level' + i);
                    }
                    this.selectedFirst = 1;
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                    this.openedLevel = [{
                        'level': 1,
                        'checked': true,
                        'model': 'f1'
                    },
                    {
                        'level': 2,
                        'checked': true,
                        'model': 'f2'
                    }
                    ];

                    this.levelArray = [{
                        'level': 1,
                        'checked': true,
                        'model': 'f1'
                    },
                    {
                        'level': 2,
                        'checked': true,
                        'model': 'f2'
                    }
                    ];
                    this.allowed_levels = [];
                    for (i = 1; i <= 2; i++) {
                        this.allowed_levels.push('level' + i);
                    }
                    this.selectedSecond = 2;
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                    this.openedLevel = [{
                        'level': 1,
                        'checked': true,
                        'model': 'f1'
                    },
                    {
                        'level': 2,
                        'checked': true,
                        'model': 'f2'
                    },
                    {
                        'level': 3,
                        'checked': true,
                        'model': 'f3'
                    }
                    ];
                    this.levelArray = [{
                        'level': 1,
                        'checked': true,
                        'model': 'f1'
                    },
                    {
                        'level': 2,
                        'checked': true,
                        'model': 'f2'
                    },
                    {
                        'level': 3,
                        'checked': true,
                        'model': 'f3'
                    }
                    ];
                    this.selectedthird = 3;
                    this.allowed_levels = [];
                    for (i = 1; i <= 3; i++) {
                        this.allowed_levels.push('level' + i);
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    this.openedLevel = [{
                        'level': 1,
                        'checked': true,
                        'model': 'f1'
                    },
                    {
                        'level': 2,
                        'checked': true,
                        'model': 'f2'
                    },
                    {
                        'level': 3,
                        'checked': true,
                        'model': 'f3'
                    },
                    {
                        'level': 4,
                        'checked': true,
                        'model': 'f4'
                    }
                    ];
                    this.levelArray = [{
                        'level': 1,
                        'checked': true,
                        'model': 'f1'
                    },
                    {
                        'level': 2,
                        'checked': true,
                        'model': 'f2'
                    },
                    {
                        'level': 3,
                        'checked': true,
                        'model': 'f3'
                    },
                    {
                        'level': 4,
                        'checked': true,
                        'model': 'f4'
                    }
                    ];
                    this.selectedForth = 4;
                    this.allowed_levels = [];
                    for (i = 1; i <= 4; i++) {
                        this.allowed_levels.push('level' + i);
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
                    this.openedLevel = [];
                    this.allowed_levels = [];
                    this.levelArray = [];
                }
            });
            this.allowed_levels.push('level' + 0);
        } else {
            this.levelArray = [];
        }

        this.getDirectory();
        // drag drop code start here
        // this.dragulaService.setOptions(this.uniqueBagId, {
        //     revertOnSpill: true,
        // });

        // this.dragulaService.drag.subscribe((value) => {
        //     this.fn_counter = '1';
        //     var node = value[2].id.split('##');
        //     this.dragObj = {
        //         name: node[1],
        //         userId: node[2],
        //         _id: node[3]
        //     }
        // });

        // this.dragulaService.drop.subscribe((value) => {
        //     this.fn_counter = '0';
        //     var drop_node = value[2].id.split('##');
        //     this.dragObj.level = drop_node[0];
        //     this.fireDragDrop();
        // });

        events.subscribe('openLevel:changed', data => {
            this.locksClicked();
        });
    };

    ionViewWillUnload() {
        this.events.unsubscribe('openLevel:changed');
    }

    mouseOverDrop(event, name) {
        if (this.fn_counter == '1') {
            this.dragObj.level = name
            this.fireDragDrop();
        }
    }

    editoToolbar() {
        if (this.editor_tab == 'format') {
            $('.cke_toolbar:nth-child(2)').show()
            $('.cke_toolbar:nth-child(7)').show()

            $('.cke_toolbar:nth-child(4)').hide()
            $('.cke_toolbar:nth-child(9)').hide()
            $('.cke_toolbar:nth-child(8)').hide()
            $('.cke_toolbar:nth-child(6)').hide()
            $('.cke_toolbar:nth-child(11)').hide()
            $('.cke_toolbar:nth-child(12)').hide()
        }
        if (this.editor_tab == 'insert') {
            $('.cke_toolbar:nth-child(4)').show()
            $('.cke_toolbar:nth-child(8)').show()
            $('.cke_toolbar:nth-child(9)').show()

            $('.cke_toolbar:nth-child(2)').hide()
            $('.cke_toolbar:nth-child(7)').hide()
            $('.cke_toolbar:nth-child(6)').hide()
            $('.cke_toolbar:nth-child(11)').hide()
            $('.cke_toolbar:nth-child(12)').hide()
        }
        if (this.editor_tab == 'styles') {
            $('.cke_toolbar:nth-child(6)').show()
            $('.cke_toolbar:nth-child(11)').show()
            $('.cke_toolbar:nth-child(12)').show()

            $('.cke_toolbar:nth-child(4)').hide()
            $('.cke_toolbar:nth-child(9)').hide()
            $('.cke_toolbar:nth-child(8)').hide()
            $('.cke_toolbar:nth-child(2)').hide()
            $('.cke_toolbar:nth-child(7)').hide()
        }
    }

    editorReady() {
        var self = this;
        setTimeout(function () {
            self.editoToolbar();
        }, 200);

    }

    async tradesFilter() {
        let modal = await this.modalCtrl.create({
            component: 'TradeslistPage',
            componentProps: {
                jobId: this.selectedJob, selected_trade: this.selectedTrade
            },
            cssClass: 'trade_list_smail'
        });
        modal.onDidDismiss().then((tradeId: any) => {
            if (tradeId != undefined && tradeId != null && tradeId != '') {
                this.selectedTrade = tradeId;
                this.selected_trade_icon = this.trades[tradeId].trade_icon;
                this.searchFn(this.searchTerm, this.selectedJob, this.gaming, tradeId, false, this.selectedType);
            }
        });
        await modal.present();
        modal.present();
    }

    printAll(smail) {
        if (smail.child.length == 0) {
            this.printOne(smail.thread, 'all');
        }
        else {
            var newArr = smail.thread.concat(smail.child)
            this.printOne(newArr, 'all');
        }
    }

    printOne(smail, type: any = null) {
        this.print_array = [];
        if (type == 'all') {
            this.print_array = smail;
        }
        else {
            this.print_array.push(smail);
        }
        var printContent = '<img class="logo-desktop" height="50px" text-center src="' + this.baseUrl_main + '/assets/images/logo-black.png">';
        var count = 0;
        var self = this;
        this.print_array.forEach(function (print) {
            var toList = '';
            print.toArray.forEach(function (to) {
                toList += to.name + '<' + to.email + '>, ';
            });
            printContent += '<p>From: ' + print.name + ' <' + print.email + '></p><p>To: ' + toList + '</p><p>Subject:' + print.subject + '</p><p>' + print.message + '</p><hr>';
            count = count + 1;
            if (count == self.print_array.length) {
                self.printFinal(printContent);
            }
        });
    }

    printFinal(printContent) {
        const WindowPrt: any = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        setTimeout(function () {
            WindowPrt.print();
            WindowPrt.close();
        }, 250);
    }

    fireDragDrop() {
        if (this.isBrowser == 'true') {
            this.fn_counter = '0';
            this.componentService.showLoader();
            this.APIService.sendData('updateFolder', this.dragObj).subscribe((result: any) => {
                this.componentService.dismissLoader();
                if (result.status == '1') {
                    this.componentService.presentToast('Folder drag & droped successfully.', 'success');
                    this.getDirectory();
                }
                else if (result.status == '2') {
                    this.componentService.presentToast('Folder already exists.', 'danger');
                    this.getDirectory();
                    this.reverse = true;
                }
                else {
                    this.componentService.presentToast('Error, plz try later.', 'danger');
                    this.getDirectory();
                }
            },
                err => {
                    this.componentService.dismissLoader();
                    this.showTechnicalError('1');
                });
        }
    }

    ngOnInit() {
        var i;
        this.isBrowser = localStorage.getItem('isBrowser');
        this.pages = [{
            title: 'Compose',
            component: 'compose',
            icon: "md-create"
        },
        {
            title: 'Inbox',
            component: 'small-inbox',
            icon: "mail-outline"
        },
        {
            title: 'Sent',
            component: 'small-inbox',
            icon: "md-mail-open"
        }
        ];

        this.preState = localStorage.getItem('view');
        if (this.preState == '' || this.preState == undefined || this.preState == null) {
            this.preState = 'Inbox';
            localStorage.setItem('view', 'Inbox');

        }
        console.log(this.preState, "preState");
        if (this.preState == 'Inbox') {
            this.inboxData('ee');
            this.filterJobSmails();
        } else if (this.preState == 'folder') {
            this.APIService.getData('folder', this.userId).subscribe((all_files: any) => {
                if (all_files.data == null) {
                    this.directory = [];
                    this.filterJobSmails();
                } else {
                    var myArray = all_files.data;
                    for (i = myArray.length - 1; i >= 0; --i) {
                        if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
                            myArray.splice(i, 1);
                        }
                    }
                    this.directory = myArray;
                    var node = localStorage.getItem('node');
                    for (i = 0; i < this.directory.length; i++) {
                        if (this.directory[i].name == node) {
                            this.preState = null;
                            this.showNodeStatic = null;
                            this.showNodeChild = null;
                            localStorage.removeItem('current_smail_path');
                            // console.log(this.directory[i])
                            //NODE IS A FOLDER --> expand childs
                            //this.shownGroup = this.directory[i];
                            localStorage.setItem('smail_path', this.directory[i].name);

                            this.selectedFolder = 'folder';
                            this.selectedLevel = this.directory[i].name;
                            this.inboxData('ee');

                        }
                    }
                    this.filterJobSmails();
                }
            },
                err => {
                    this.showTechnicalError();
                });
        } else {
            this.sentMailsData('ee');
            this.filterJobSmails();
        }
        this.has_loaded = '1';
        this.getOpenLevels();
    };

    downloadAndroid(url, name) {
        this.componentService.presentToast('Start downloading....', 'success');
        let toast = this.toastCtrl.create({
            message: 'Start downloading....',
            duration: 3000,
            position: 'top',
            cssClass: 'success'
        });
        // const fileTransfer: FileTransferObject = this.transfer.create();
        // fileTransfer.download(url, this.file.externalRootDirectory + name.split('____').pop()).then((entry) => {
        //     this.componentService.presentToast('File downloaded.', 'success');
        // }, (error) => {
        //     this.componentService.presentToast('Error', 'danger');
        // });
    }

    showTechnicalError(type: any = null) {
        var msg = (type == '1') ? 'try later.' : 'reload the page.'
        this.componentService.presentToast('Technical error, Please ' + msg, 'info');
    }

    filterJobSmails() {
        if (history.state.job_smail == '1') {
            this.selectedJob = history.state.jobId;
            this.preState = 'Sent';
            this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType);
        }
    }

    resetFilters() {
        this.searchTerm = '';
        this.selectedJob = '';
        this.gaming = '';
        this.selectedTrade = '';
        this.selectedType = '';
        this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType, true);
    }

    goToJobs() {
        this.navCtrl.navigateForward('TradeDashboardPage', {
            state: {
                jobId: this.selectedJob,
                from_smail: '1',
                job_title: this.jobIndexResult[this.selectedJob]
            }
        });
    }

    goToJob() {
        if (this.filterValues.jobId != '' && this.filterValues.tradeId != '') {
            if (this.filterValues.jobType != '') {
                if (this.filterValues.jobType == 'rfi') {
                    this.navCtrl.navigateForward('RfisPage', {
                        state: {
                            jobId: this.filterValues.jobId,
                            from_smail: '1'
                        }
                    });
                }
                else if (this.filterValues.jobType == 'addendum') {
                    this.navCtrl.navigateForward('AdendumPage', {
                        state: {
                            jobId: this.filterValues.jobId,
                            from_smail: '1'
                        }
                    });
                }
                else {
                    this.navCtrl.navigateForward('TradeDashboardPage', {
                        state: {
                            jobId: this.filterValues.jobId,
                            from_smail: '1',
                            job_title: this.jobIndexResult[this.selectedJob]
                        }
                    });
                }
            }
            else {

            }
        }
        else if (this.filterValues.jobId != '' && this.filterValues.tradeId == '') {
            this.navCtrl.navigateForward('TradeDashboardPage', {
                state: {
                    jobId: this.filterValues.jobId,
                    from_smail: '1'
                }
            });
        }
    }

    getDirectory() {
        this.has_loaded = '0';
        var i, ntype;
        this.APIService.getData('folder', this.userId).subscribe((all_files: any) => {
            // console.log(all_files)
            this.directory = [];
            if (all_files.data == null) {
                this.directory = [];
                if (localStorage.getItem('openedLevel') != 'null') {
                    if (localStorage.getItem('openedLevel') == '0') {
                        this.allowed_levels = [];
                        this.allowed_levels.push('level' + 0);
                        for (i = 0; i < this.openedLevel.length; i++) {
                            this.openedLevel[i].checked = false;
                        }
                    } else if (localStorage.getItem('openedLevel') == 'all') {

                    } else {
                        for (i = 0; i < this.openedLevel.length; i++) {
                            if (this.openedLevel[i].level == localStorage.getItem('openedLevel')) {
                                this.allowed_levels = [];
                                this.allowed_levels.push('level' + this.openedLevel[i].level);
                                this.openedLevel[i].checked = true;
                            } else {
                                this.openedLevel[i].checked = false;
                            }
                        }
                    }
                    if (localStorage.getItem('openedLevel') == '0') {
                        ntype = 'notify';
                    } else {
                        ntype = 'smail';
                    }

                }
            } else {
                this.directory = [];
                var myArray = all_files.data;
                for (i = myArray.length - 1; i >= 0; --i) {
                    this.alllevel = JSON.parse(localStorage.getItem('alllevel') || '');
                    var userId = localStorage.getItem('userinfo');
                    // var isLevelOpened = false;
                    if (this.alllevel) {
                        this.alllevel.forEach((value) => {
                            // console.log(value);
                            var decrypted = CryptoJS.AES.decrypt(value, userId || '');
                            if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == myArray[i].name) {
                                this.directory.push(myArray[i])
                            }
                        });
                    }

                }

                if (localStorage.getItem('openedLevel') != 'null') {
                    if (localStorage.getItem('openedLevel') == '0') {
                        this.allowed_levels = [];
                        this.allowed_levels.push('level' + 0);
                        for (i = 0; i < this.openedLevel.length; i++) {
                            this.openedLevel[i].checked = false;
                        }
                        // console.log(this.directory)
                    } else if (localStorage.getItem('openedLevel') == 'all') {

                    } else {
                        for (i = 0; i < this.openedLevel.length; i++) {
                            if (this.openedLevel[i].level == localStorage.getItem('openedLevel')) {
                                this.allowed_levels = [];
                                this.allowed_levels.push('level' + this.openedLevel[i].level);
                                this.openedLevel[i].checked = true;
                            } else {
                                this.openedLevel[i].checked = false;
                            }
                        }
                    }

                    if (localStorage.getItem('openedLevel') == '0') {
                        ntype = 'notify';
                    } else {
                        ntype = 'smail';
                    }

                }
            }
            this.all_directory = this.directory;

            this.preState = localStorage.getItem('view');


            this.APIService.getData('jobs',this.userId).subscribe((data:any) => {
                // console.log(data)
                this.jobListingResult = data;
                if (data != '') {
                    var jobIndexResult: any = [];
                    data.forEach(function (job) {
                        jobIndexResult[job._id] = job.job_title;
                    });
                    this.jobIndexResult = jobIndexResult;
                }
                // this.companyProvider.allTrades(this.jobListingResult[0]._id).subscribe((data)=>{
                //     console.log(data)
                //     this.trades = data;
                // });
            },
                err => {
                    this.showTechnicalError();
                });
        },
            err => {
                this.showTechnicalError();
            });
        this.has_loaded = '1';
    }

    getOpenLevels() {
        this.opened_levels = [];
        var levels_array = JSON.parse(localStorage.getItem('alllevel') || '');
        if (levels_array) {
            levels_array.forEach((value) => {
                var decrypted = CryptoJS.AES.decrypt(value, this.userId);
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
                    this.enable_level1 = 'true';
                    this.enable_level2 = 'true';
                    this.enable_level3 = 'true';
                    this.enable_level4 = 'true';
                }
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                    this.enable_level1 = 'false';
                    this.enable_level2 = 'true';
                    this.enable_level3 = 'true';
                    this.enable_level4 = 'true';
                } if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                    this.enable_level1 = 'false';
                    this.enable_level2 = 'false';
                    this.enable_level3 = 'true';
                    this.enable_level4 = 'true';
                } if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                    this.enable_level1 = 'false';
                    this.enable_level2 = 'false';
                    this.enable_level3 = 'false';
                    this.enable_level4 = 'true';
                } if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    this.enable_level1 = 'false';
                    this.enable_level2 = 'false';
                    this.enable_level3 = 'false';
                    this.enable_level4 = 'false';
                }
            });
        }

        if (this.enable_level1 == 'false') {
            this.opened_levels.push('level1');
        }
        if (this.enable_level2 == 'false') {
            this.opened_levels.push('level2');
        }
        if (this.enable_level3 == 'false') {
            this.opened_levels.push('level3');
        }
        if (this.enable_level4 == 'false') {
            this.opened_levels.push('level4');
        }
        this.shown_levels = this.opened_levels;

    }

    inboxData(value, type:any = null) {
        this.preState = 'Inbox';
        var i, myArray, level_array;
        if (type == null) {
            this.bread_level = '';
            this.bread_folder = '';
            this.bread_static = '';
            this.is_main = '1';
            this.is_folder_sel = '0';
        }
        if (type == '1') {
            this.is_main = '0';
            this.is_folder_sel = '1';
        }
        this.has_loaded = '0';
        // this.selectedJob = '';
        // this.selectedTrade = '';
        // this.searchTerm = '';
        // this.gaming = '';
        this.filterStorages = {
            jobId: this.selectedJob,
            tradeId: this.selectedTrade,
            searchTerm: this.searchTerm,
            status: this.gaming,
            jobType: this.selectedType
        }
        this.details = '';
        this.items = [];
        this.componentService.showLoader();
        this.userId = localStorage.getItem('userinfo');
        this.APIService.putData('sendMailListData/'+this.userId,'').subscribe((data:any) => {
            this.has_loaded = '1';
            if (data.length > 0) {
                if (this.selectedFolder == '') {
                    myArray = data;
                    for (i = myArray.length - 1; i >= 0; --i) {

                        if (myArray[i].isGroupMsg == true) {
                            if (this.allowed_levels.indexOf('level' + myArray[i].level) == -1) {
                                myArray.splice(i, 1);
                            }
                        } else if (myArray[i].isForce == true) {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].senderLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }

                        } else if (myArray[i].isOverride == true) {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].level) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }
                        } else {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].senderLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }

                            }
                        }

                    }

                    for (i = myArray.length - 1; i >= 0; i--) {
                        if (myArray[i].mailId == null && myArray[i].isReply == true && myArray[i].mails.length == 0) {
                            myArray.splice(i, 1);
                        }
                    }
                    this.componentService.dismissLoader();
                    this.items = myArray;
                    this.allemails = myArray;

                    this.getFilterStorages();

                    if (history.state.from_job == '1') {
                        this.selectedJob = history.state.jobId;
                        this.APIService.getData('trades',this.selectedJob).subscribe((data) => {
                            this.trades = data;
                            this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType, true);
                        },
                            err => {
                                this.showTechnicalError();
                            });
                    }

                    if (history.state.notis == '32') {
                        this.notis_data = {
                            _id: history.state._id,
                            read: false
                        }
                        this.openInvitationMail(this.notis_data);
                    }

                } else {
                    //here updatign conditions based on level n folder selection
                    if (this.selectedLevel == 'level1' || this.selectedLevel == 'level2' || this.selectedLevel == 'level3' || this.selectedLevel == 'level4') {
                        myArray = data;
                        level_array = [];
                        if (value != 'filter') {

                            level_array.push(this.selectedLevel);
                        }
                        // level_array.push(this.selectedLevel);

                        for (i = myArray.length - 1; i >= 0; --i) {
                            // console.log(myArray[i].mails.length)
                            if (myArray[i].isGroupMsg == true) {
                                if (level_array.indexOf(this.selectedLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else if (myArray[i].isForce == true) {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].senderLevel) == -1 && this.selectedLevel == myArray[i].senderLevel) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }

                            } else if (myArray[i].isOverride == true) {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].level) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }
                            } else {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].senderLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }
                            }
                        }

                        for (i = myArray.length - 1; i >= 0; i--) {
                            if (myArray[i].mailId == null && myArray[i].isReply == true && myArray[i].mails.length == 0) {
                                myArray.splice(i, 1);
                            }
                        }
                        this.items = myArray;
                        this.allemails = myArray;
                        this.getFilterStorages();
                        this.componentService.dismissLoader();
                    } else {
                        if (value != 'filter') {
                            if (this.selectedFolderId != '') {
                                myArray = data;
                                level_array = [];
                                // var folderId = this.selecetedFolderNode;
                                if (value != 'filter') {

                                    level_array.push(this.selectedLevel);
                                }
                                this.items = myArray;
                                this.allemails = myArray;
                                var folder_mails: any = [];
                                var self = this;
                                // console.log(myArray)
                                if (myArray.length > 0) {
                                    myArray.forEach(function (data) {
                                        if (self.selecetedFolderNode._id == data.folderId) {

                                            if (data.mailId != null && data.isGroupMsg == false) {
                                                folder_mails.push(data);
                                            }
                                        }
                                    });
                                    this.componentService.dismissLoader();
                                    this.items = folder_mails;
                                    this.allemails = folder_mails;
                                    this.getFilterStorages();
                                }


                            }
                        } else {
                            this.componentService.dismissLoader();
                            this.details = '';
                            this.items = [];
                        }
                    }

                    this.details = '';
                    this.thread = false;

                    if (this.term && this.term.trim() != '' && this.term.trim() != undefined) {
                        this.items = this.items.filter((item) => {
                            var temp = item.toArray.filter((contact) => {
                                return (contact.email.toLowerCase().indexOf(this.term.toLowerCase()) > -1)
                            });

                            if (item.subject.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
                                return item;
                            } else {
                                if (item.name.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
                                    return item;
                                } else {
                                    if (temp.length > 0) {
                                        return temp;
                                    }
                                }
                            }
                        });
                    }
                    if (this.gaming != undefined && this.gaming != '') {

                        this.items = this.items.filter((item) => {
                            if (this.gaming == 1) {
                                return (item.read == true);
                            } else {
                                return (item.read == false);
                            }
                        });
                    }

                    if (this.selectedJob != '') {
                        this.items = this.items.filter((item) => {
                            return (item.jobId == this.selectedJob);
                        });
                    }
                    // console.log(this.items)
                    if (this.selectedTrade != '') {
                        this.items = this.items.filter((item) => {
                            return (item.tradeId == this.selectedTrade);
                        });
                    }

                }
            } else {
                this.componentService.dismissLoader();
                this.details = '';
                this.items = [];
            }
        },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError();
            });
    };

    sentMailsData(value, type:any= null) {
        var i, myArray, level_array;
        this.preState = 'Sent';
        if (type == null) {
            this.bread_level = '';
            this.bread_folder = '';
            this.bread_static = '';
            this.is_main = '1';
            this.is_folder_sel = '0';
        }
        if (type == '1') {
            this.is_main = '0';
            this.is_folder_sel = '1';
        }
        this.has_loaded = '0';
        // this.selectedJob = '';
        //this.selectedTrade = '';
        // this.searchTerm = '';
        // this.gaming = '';
        this.filterStorages = {
            jobId: this.selectedJob,
            tradeId: this.selectedTrade,
            searchTerm: this.searchTerm,
            status: this.gaming,
            jobType: this.selectedType
        }
        this.details = '';
        this.items = [];
        this.componentService.showLoader();
        this.userId = localStorage.getItem('userinfo');
        this.APIService.getData('sendMailListData',this.userId).subscribe((data:any) => {
            this.has_loaded = '1';
            if (data.length > 0) {
                if (this.selectedFolder == '') {
                    myArray = data;
                    for (i = myArray.length - 1; i >= 0; --i) {
                        // console.log(myArray[i].fromId[0].userId)
                        // console.log(this.userId)
                        if (myArray[i].isGroupMsg == true) {
                            if (this.allowed_levels.indexOf('level' + myArray[i].level) == -1) {
                                myArray.splice(i, 1);
                            }
                        } else if (myArray[i].isForce == true) {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].senderLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }

                        } else if (myArray[i].isOverride == true) {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].level) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }
                        } else {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].senderLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }
                        }

                    }
                    for (i = myArray.length - 1; i >= 0; i--) {
                        if (myArray[i].mailId != null && myArray[i].isReply == false && myArray[i].mails.length == 0 && myArray[i].subject != 'Friend Request') {
                            myArray.splice(i, 1);
                        }
                    }
                    this.componentService.dismissLoader();
                    this.items = myArray;
                    this.allemails = myArray;
                    this.getFilterStorages();
                    if (history.state.after_job_smail == '1') {
                        this.selectedJob = history.state.jobId;
                        this.APIService.getData('trades',this.selectedJob).subscribe((data) => {
                            this.trades = data;
                            this.selectedTrade = history.state.tradeId;
                            this.selectedType = history.state.jobType;
                            this.filterValues = {
                                jobId: this.selectedJob,
                                tradeId: this.selectedTrade,
                                jobType: this.selectedType
                            }
                            this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType, true);
                        },
                            err => {
                                this.showTechnicalError();
                            });
                        // $("#go_to_reset").show();
                        var reset: any = document.getElementById('go_to_reset' + this.timestamp);
                        reset.style.display = 'inline-block';
                    }
                    if (history.state.from_job == '1') {
                        this.selectedJob = history.state.jobId;
                        this.APIService.getData('trades',this.selectedJob).subscribe((data) => {
                            this.trades = data;
                            this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType, true);
                        },
                            err => {
                                this.showTechnicalError();
                            });
                    }
                    this.details = '';

                } else {
                    if (this.selectedLevel == 'level1' || this.selectedLevel == 'level2' || this.selectedLevel == 'level3' || this.selectedLevel == 'level4') {
                        myArray = data;
                        level_array = [];
                        if (value != 'filter') {

                            level_array.push(this.selectedLevel);
                        }

                        for (i = myArray.length - 1; i >= 0; --i) {
                            // console.log(myArray[i].mails.length)
                            if (myArray[i].isGroupMsg == true) {
                                if (level_array.indexOf(this.selectedLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else if (myArray[i].isForce == true) {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].senderLevel) == -1 && this.selectedLevel == myArray[i].senderLevel) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }

                            } else if (myArray[i].isOverride == true) {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].level) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }
                            } else {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].senderLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }
                            }
                        }

                        for (i = myArray.length - 1; i >= 0; i--) {
                            if (myArray[i].mailId == null && myArray[i].isReply == true && myArray[i].mails.length == 0 && myArray[i].subject != 'Friend Request') {
                                myArray.splice(i, 1);
                            }
                        }
                        this.componentService.dismissLoader();
                        this.items = myArray;
                        this.allemails = myArray;
                        this.getFilterStorages();

                    } else {
                        if (value != 'filter') {
                            if (this.selectedFolderId != '') {
                                myArray = data;
                                level_array = [];
                                var folderId = this.selecetedFolderNode;

                                level_array.push(folderId.level);

                                this.items = myArray;
                                this.allemails = myArray;
                                var folder_mails:any= [];
                                var self = this;
                                if (myArray.length > 0) {
                                    myArray.forEach(function (data:any) {
                                        if (self.selecetedFolderNode._id == data.folderId) {
                                            if (data.mailId == null && data.isGroupMsg == false) {
                                                folder_mails.push(data);
                                            }
                                        }
                                    });
                                    this.items = folder_mails;
                                    this.allemails = folder_mails;
                                    this.componentService.dismissLoader();
                                }
                                this.getFilterStorages();

                            }
                        } else {
                            this.componentService.dismissLoader();
                            this.details = '';
                            this.items = [];
                        }

                    }

                    this.details = '';
                    this.thread = false;
                    if (this.term && this.term.trim() != '' && this.term.trim() != undefined) {
                        this.items = this.items.filter((item) => {
                            var temp = item.toArray.filter((contact) => {
                                return (contact.email.toLowerCase().indexOf(this.term.toLowerCase()) > -1)
                            });

                            if (item.subject.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
                                return item;
                            } else {
                                if (item.name.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
                                    return item;
                                } else {
                                    if (temp.length > 0) {
                                        return temp;
                                    }
                                }
                            }
                        });
                    }
                    if (this.gaming != undefined && this.gaming != '') {

                        this.items = this.items.filter((item) => {
                            if (this.gaming == 1) {
                                return (item.read == true);
                            } else {
                                return (item.read == false);
                            }
                        });
                    }

                    if (this.selectedJob != '') {
                        this.items = this.items.filter((item) => {
                            return (item.jobId == this.selectedJob);
                        });
                    }
                    // console.log(this.items)
                    if (this.selectedTrade != '') {
                        this.items = this.items.filter((item) => {
                            return (item.tradeId == this.selectedTrade);
                        });
                    }

                    // if(this.selectedJob != ''){
                    //     this.selectedTrade = '';
                    //     this.companyProvider.allTrades(this.selectedJob).subscribe((data)=>{
                    //         console.log(data)
                    //         this.trades = data;
                    //     });
                    // }


                    if (this.items.length > 0) {
                        // this.openSmaildetailPage(this.items[0], 0);
                    } else {
                        this.details = '';
                    }
                }
            } else {
                this.componentService.dismissLoader();
                this.details = '';
                this.items = [];
            }

        },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError();
            });
    };

    getFilterStorages() {
        if (this.filterStorages.jobId != '' && this.filterStorages.jobId != undefined) {
            this.selectedJob = this.filterStorages.jobId;
            this.APIService.getData('trades',this.selectedJob).subscribe((data) => {
                this.trades = data;
                this.selectedTrade = this.filterStorages.tradeId;
                this.gaming = this.filterStorages.status;
                this.selectedType = this.filterStorages.jobType;
                this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType, true);
            },
                err => {
                    this.showTechnicalError();
                });
        }
    }

    filterList(isChecked, value) {
        this.details = '';
        this.thread = false;
        localStorage.setItem('openedLevel', null || '');
        // console.log(isChecked)
        if (isChecked == true) {
            this.allowed_levels.push('level' + value);
            if (localStorage.getItem('view') == "Inbox") {
                this.inboxData('ee');
            } else {
                this.sentMailsData('ee');
            }
        } else {
            for (var i = this.allowed_levels.length; i > 0; i--) {
                if (this.allowed_levels[i - 1] == 'level' + value) {
                    this.allowed_levels.splice(i - 1, 1);
                }
            }

            var testValue = 'level' + value;
            if (localStorage.getItem('view') == "Inbox") {
                if (this.selectedFolder != '' && this.selectedLevel == testValue || this.selectedFolder != '' && this.selecetedFolderNode.level == testValue) {
                    this.items = [];
                } else if (this.selectedFolder == '') {
                    this.inboxData('ee');
                }

            } else {
                if (this.selectedFolder != '' && this.selectedLevel == testValue || this.selectedFolder != '' && this.selecetedFolderNode.level == testValue) {
                    this.items = [];
                } else if (this.selectedFolder == '') {
                    this.sentMailsData('ee');
                }

            }
        }
    };

    reload() {
        if (localStorage.getItem('view') == "Inbox") {
            this.preState = 'Inbox';
            this.selectedFolder = '';
            this.inboxData('ee');
        } else {
            this.preState = 'Sent';
            this.selectedFolder = '';
            this.sentMailsData('ee');
        }
    };

   async openSmaildetailPage(data, index) {
        if (data.unconnected == '1' && data.fromId[0].userId != this.userId) {
            let confirm = await this.alertCtrl.create({
                header: '',
                message: 'There is an unconnected person on this message thread. Do you wish to continue?',
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            this.componentService.showLoader();
                            this.APIService.sendData('updateUnconnect',{ id: data._id }).subscribe((updated) => {
                                this.componentService.dismissLoader();
                                this.allemails[index].unconnected = '0';
                                this.callDetailsFn(data, index);
                            },
                                err => {
                                    this.componentService.dismissLoader();
                                    this.showTechnicalError('1');
                                });
                        }
                    },
                    {
                        text: 'No',
                        handler: () => {
                            var loginId = this.userId;
                            var new_toId: any = [];
                            var unc_ids: any = [];
                            var latest_toId: any = [];
                            data.toArray.forEach(function (single) {
                                if (single.userId == loginId || single.on_level != 'level5') {
                                    new_toId.push({ level: single.level, userId: single.userId });
                                }
                                else {
                                    unc_ids.push(single.userId);
                                }
                                if (single.userId != loginId) {
                                    latest_toId.push({ level: single.level, userId: single.userId });
                                }
                            });
                            this.componentService.showLoader();
                            this.APIService.sendData('removeUnconnect',{ id: data._id, mailId: data.mailId, new_toId: new_toId, latest_toId: latest_toId, loginId: loginId, unc_ids: unc_ids, isReply: data.isReply, fromId: data.fromId[0].userId }).subscribe((updated:any) => {
                                this.componentService.dismissLoader();
                                if (updated.user_name != null) {
                                    if (this.opened_levels.indexOf(updated.snd_level) >= 0 || updated.snd_level == 'level5') {
                                        this.allemails[index].name = updated.user_name;
                                        this.allemails[index].snd_level = updated.snd_level;
                                    }
                                    else {
                                        this.allemails[index].name = updated.snd_level + " contact update";
                                    }

                                }
                                $('.unc' + index).hide();
                                this.allemails[index].unconnected = '0';
                                this.callDetailsFn(data, index);
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
        }
        else {
            this.callDetailsFn(data, index);
        }
    };

    openInvitationMail(data) {
        this.thread = false;
        this.action = '';
        var details = data;
        this.attacments = [];
        this.showSmailThumb = true;
        this.baseUrl = localStorage.getItem('APIURL');
        this.preState = localStorage.getItem('view');
        if (details.read == false && this.preState == 'Inbox') {
            var senddata= {
                'mailId' :  details.mailId,
                'loginId': details.userId
            }
            this.APIService.sendData('sendMailListData/'+ details._id,senddata).subscribe((data) => {
                this.events.publish('read_mail:changed', 0);
            },
                err => {
                    this.showTechnicalError('1');
                });
        }
        this.APIService.putData('sMailApi',{userId: this.userId, smailId: details._id}).subscribe((mailsData:any) => {
            localStorage.setItem('mailData', JSON.stringify(mailsData));

            this.replyMail = JSON.parse(localStorage.getItem('mailData') || '');
            this.details = mailsData;
        },
            err => {
                this.showTechnicalError();
            });
    }

    callDetailsFn(data, index) {
        this.thread = false;
        this.action = '';
        var details = data;
        this.attacments = [];
        if (data.toArray.length == 1) {
            if (data.toArray[0].senderId == data.anotherUserId && data.toArray[0].senderThumb == 'Show') {
                this.showSmailThumb = true;
            } else if (data.toArray[0].senderId != data.anotherUserId && data.toArray[0].receiverThumb == 'Show') {
                this.showSmailThumb = true;
            }
        }
        this.testCheckboxResult = [];
        this.baseUrl = localStorage.getItem('APIURL');
        this.preState = localStorage.getItem('view');
        this.componentService.showLoader();
        this.userId = localStorage.getItem('userinfo');

        if (details.read == false && this.preState == 'Inbox') {
            var level_num = details.isGroupMsg == true ? details.level : details.receiverLevel;
            this.items[index].read = true;
            this.APIService.sendData('sendMailListData/'+ details._id, {mailId : details.mailId,loginId:details.userId}).subscribe((data) => {
                this.events.publish('read_mail:changed', level_num);
            },
                err => {
                    this.showTechnicalError();
                });
        }

        var id = null;
        if (details.mailId == null) {
            id = details._id;
        } else {
            id = details.mailId;
        }

        this.APIService.putData('sMailApi',{userId: this.userId, smailId: id} ).subscribe((mailsData) => {
            localStorage.setItem('mailData', JSON.stringify(mailsData));

            this.replyMail = JSON.parse(localStorage.getItem('mailData') || '');
            this.details = mailsData;

            this.APIService.getData('getContactList',this.userId).subscribe((data:any) => {
                this.componentService.dismissLoader();
                var finalArray:any = [];
                var value;
                var cunt = 0;
                var i;
                // Remove Duplicate Value
                for (i = 0; i < data.length; i++) {
                    value = data[i];
                    // console.log(value);
                    if (finalArray.length > 0) {
                        if (finalArray[cunt]._id.indexOf(value._id) === -1) {
                            finalArray.push(value);
                            // console.log(finalArray);
                            cunt = cunt + 1;
                        }
                    } else {
                        finalArray.push(value);
                    }
                }
                //allowed_levels
                this.data = finalArray;

                if (this.selectedFirst != 1) {
                    for (i = Number(this.data.length - 1); i >= 0; i--) {
                        if (this.data[i].senderId == this.userId) {
                            if (this.data[i].senderSetLevel == 1) {
                                this.data.splice(i, 1);
                            }
                        } else {
                            if (this.data[i].reciverSetLevel == 1) {
                                this.data.splice(i, 1);
                            }
                        }
                    }
                }

                if (this.selectedSecond != 2) {
                    for (i = Number(this.data.length - 1); i >= 0; i--) {
                        if (this.data[i].senderId == this.userId) {
                            if (this.data[i].senderSetLevel == 2) {
                                this.data.splice(i, 1);
                            }
                        } else {
                            if (this.data[i].reciverSetLevel == 2) {
                                this.data.splice(i, 1);
                            }
                        }
                    }
                }

                if (this.selectedthird != 3) {
                    for (i = Number(this.data.length - 1); i >= 0; i--) {
                        if (this.data[i].senderId == this.userId) {
                            if (this.data[i].senderSetLevel == 3) {
                                this.data.splice(i, 1);
                            }
                        } else {
                            if (this.data[i].reciverSetLevel == 3) {
                                this.data.splice(i, 1);
                            }
                        }
                    }
                }

                if (this.selectedForth != 4) {
                    for (i = Number(this.data.length - 1); i >= 0; i--) {
                        if (this.data[i].senderId == this.userId) {
                            if (this.data[i].senderSetLevel == 4) {
                                this.data.splice(i, 1);
                            }
                        } else {
                            if (this.data[i].reciverSetLevel == 4) {
                                this.data.splice(i, 1);
                            }
                        }
                    }
                }

            },
                err => {
                    this.componentService.dismissLoader();
                    this.showTechnicalError();
                });
        },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
        this.userId = localStorage.getItem('userinfo');
    }

    createThread(action) {
        if (action == 'fwd') {
            this.subject = 'fwd:' + this.details.thread[0].subject;
            // console.log(document.getElementsByTagName('rich-text'))
            // document.getElementsByTagName('rich-text')[0].textContent =  this.details.thread[0].message;
            this.testCheckboxResult = [];
            this.selectedGroups = [];
            var all_threads = this.details.thread[0].mails;
            this.desc = all_threads.slice(-1).pop().message;
        }
        else {
            var i;
            this.selectedGroups = [];
            this.replyMail = JSON.parse(localStorage.getItem('mailData') || '');
            var mailsData = JSON.parse(localStorage.getItem('mailData') || ''),
                receipts;
            this.desc = '';
            //if email have child emails
            if (mailsData.child.length > 0) {
                receipts = mailsData.child[mailsData.child.length - 1].toArray;
                for (i = 0; i < receipts.length; i++) {
                    if (receipts[i].userId == this.userId) {
                        receipts.splice(i, 1);
                    }
                }
                if (mailsData.child[mailsData.child.length - 1].fromId[0].userId != this.userId) {
                    receipts.push(mailsData.child[mailsData.child.length - 1].fromId[0]);
                }
            } else {
                //if single email
                receipts = mailsData.thread[0].toArray;
                for (i = 0; i < receipts.length; i++) {
                    if (receipts[i].userId == this.userId) {
                        receipts.splice(i, 1);
                    }
                }
                // console.log(mailsData.thread[0].fromId)
                if (mailsData.thread[0].fromId[0].userId != this.userId) {
                    receipts.push(mailsData.thread[0].fromId[0]);
                }

                //localStorage.setItem('receipts', receipts);
            }

            var data = receipts;
            var dict;
            //console.log(data)
            for (i = 0; i < data.length; i++) {
                // console.log(data[i].userId)
                for (var j = 0; j < this.data.length; j++) {
                    // console.log(this.data[j].userId)
                    if (data[i].userId == this.data[j].userId && data[i].userId != this.userId) {
                        dict = {
                            level: data[i].level,
                            userId: data[i].userId,
                            name: this.data[j].name
                        };
                        data[i] = this.data[j];
                    } else if (data[i].userId == this.userId) {
                        var username = localStorage.getItem('userName');
                        dict = {
                            level: data[i].level,
                            userId: data[i].userId,
                            name: this.data[j].name
                        };
                        data[i] = dict;
                        data[i].name = username;
                    }
                }
            }
            this.testCheckboxResult = data;

            if (this.testCheckboxResult.length == 1) {
                if (this.userId == this.testCheckboxResult[0].senderId) {
                    this.level = this.testCheckboxResult[0].senderSetLevel;
                } else {
                    this.level = this.testCheckboxResult[0].reciverSetLevel;
                }
            }
        }
        this.action = action;
        this.thread = true;
        // setTimeout(function(){ 
        //     var scrollElement = document.getElementById('scroll_down');
        //     scrollElement.scrollIntoView();
        // }, 500);
    };

    openLevel(value) {
        this.componentService.showLoader();
        this.userId = localStorage.getItem('userinfo');
        this.APIService.getData('smail', this.userId+'/'+value).subscribe((data) => {
            this.componentService.dismissLoader();
            // console.log(data);
            this.items = data;
        });
    };

    openPage(page) {
        // console.log(page);
        this.thread = false;
        this.deleteSmails = [];
        //this.shownGroup = [];
        this.showNodeStatic = null;
        this.showNodeChild = null;
        this.selectedNode = '';
        localStorage.setItem('openedLevel', null || '');
        localStorage.removeItem('smail_path');
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (page.title == "Compose") {
            this.filterStorages = {
                jobId: this.selectedJob,
                tradeId: this.selectedTrade,
                searchTerm: this.searchTerm,
                status: this.gaming,
                jobType: this.selectedType
            }
            this.navCtrl.navigateRoot(page.component,{ state:{
                filters: this.filterStorages
            }});
        } else if (page.title == "Inbox") {
            localStorage.setItem('view', 'Inbox');
            this.preState = 'Inbox';
            this.selectedFolder = '';
            this.inboxData('ee');
        } else {
            localStorage.setItem('view', 'Sent');
            this.preState = 'Sent';
            this.selectedFolder = '';
            this.sentMailsData('ee');
        }

    };

   async  presentPrompt() {
        this.file_path = localStorage.getItem('smail_path');
        // console.log(this.file_path)
        // var folder_path = this.file_path.split('smail/')[1];     
        if (!this.file_path) {
            this.componentService.presentToast('Please select level to add folder.','info')
            
        } else {
            let modal = await this.modalCtrl.create({
                component: 'AddfolderPage',
                componentProps:{
                    is_smail_folder: '1'
                }
              });
              modal.onDidDismiss().then((data: any) => {
                if (data == '1') {
                    this.componentService.presentToast('Folder added.','success');
                }
                this.getLevelsDirectory('1');
              });
              await modal.present();
        

        }
    };


   async  presentConfirm() {
        this.file_path = localStorage.getItem('current_smail_path');
        console.log(this.file_path)
        if (!this.file_path && this.file_path == null) {
            this.componentService.presentToast('Please select folder to delete.','danger')
           
        }
        else {
            let alert = await this.alertCtrl.create({
                header: 'Delete Folder',
                message: 'Do you want to delete this folder?',
                buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.file_path = localStorage.getItem('current_smail_path');

                        if (!this.file_path) {
                            this.componentService.presentToast('Please select folder to delete.','danger')
                           
                        } else {
                            this.componentService.showLoader();
                            this.APIService.sendData('deletefolder',{
                                'folderId': this.file_path
                            }).subscribe((deleted:any) => {
                                if (deleted.status == 1) {
                                    this.getLevelsDirectory('1');
                                    this.componentService.dismissLoader();
                                    this.componentService.presentToast('Folder deleted.','success');
                                } else {
                                    this.componentService.dismissLoader();
                                    this.componentService.presentToast('Error, plz try later.','danger');
                                }
                            },
                                err => {
                                    this.componentService.dismissLoader();
                                    this.showTechnicalError('1');
                                });
                        }
                    }
                }
                ]
            });
            alert.present();
        }
    };

    reorderItems(indexes) {
        // console.log(indexes)
        let element = this.pages[indexes.from];
        this.pages.splice(indexes.from, 1);
        this.pages.splice(indexes.to, 0, element);
    };

    filterLevel(event, level_number) {
        // console.log(event)
        this.details = '';
        this.thread = false;


        if (event.checked == true) {
            this.shown_levels.push(level_number);
        }
        else {
            this.removeArray(this.shown_levels, level_number);
        }

        this.getLevelsDirectory();

    };

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

    getLevelsDirectory(folder:any = null) {
        this.APIService.getData('folder', this.userId).subscribe((all_files: any) => {
            var myArray = all_files.data;
            for (var i = myArray.length - 1; i >= 0; --i) {
                if (this.shown_levels.indexOf(myArray[i].name) == -1) {
                    myArray.splice(i, 1);
                }
            }
            this.directory = myArray;
            this.reverse = false;
            // if(folder == '1')
            // {
            //     var level = localStorage.getItem('smail_path');
            //     // document.getElementById('click_'+level).click();
            //     this.clickNode({name : level, children : []})
            // }
        },
            err => {
                this.showTechnicalError();
            });

    }

    async sendReply() {
        this.toId = [];
        var usersArray: any = [],
            fromUser: any = [];
        for (var i = 0; i < this.testCheckboxResult.length; i++) {
            for (var j = 0; j < this.data.length; j++) {
                if (this.testCheckboxResult[i].userId == this.data[j].userId) {
                    // if(this.override == true && this.data[j].force == true){
                    usersArray.push({
                        'userId': this.data[j].userId,
                        'level': this.data[j].level
                    });
                    fromUser.push({
                        'userId': localStorage.getItem('userinfo'),
                        'level': this.data[j].senderSetLevel
                    });


                }
            }
        }

        // console.log(usersArray);
        var id = null;
        if (this.details.thread[0].mailId == null) {
            id = this.details.thread[0]._id;
        } else {
            id = this.details.thread[0].mailId;
        }
        var mailData = {
            'toId': usersArray,
            'fromId': fromUser,
            'subject': this.details.thread[0].subject,
            'message': this.desc,
            'attacment': this.attacments,
            'isReply': true,
            'mailId': id,
            'bcc': this.bccId,
            'cc': this.ccId,
            'override': this.details.thread[0].isOverride,
            'level': this.details.thread[0].level,
            'isForward': false,
            'jobId': null,
            'tradeId': null
        };
        //console.log(mailData);
        if (usersArray.length == 0) {
            this.componentService.presentToast('Please specify at least one recipient.', 'danger');

        } else if (this.desc == '') {
            let alert = await this.alertCtrl.create({
                header: 'Smail',
                subHeader: 'Send this message without text in the body?',
                buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'OK',
                    handler: () => {
                        // console.log('Buy clicked');
                        this.componentService.showLoader();
                        this.APIService.sendData('sMailApi', mailData).subscribe((data) => {
                            // console.log(data);
                            this.componentService.dismissLoader();
                            this.componentService.presentToast('Mail has been sent successfully.', 'success')
                            this.thread = false;
                            this.getReplyMailData(id);
                        },
                            err => {
                                this.componentService.dismissLoader();
                                this.showTechnicalError('1');
                            });
                    }
                }
                ]
            });
            await alert.present();
        } else {
            this.componentService.showLoader();
            this.APIService.sendData('sMailApi', mailData).subscribe((data) => {
                // console.log(data);
                this.componentService.dismissLoader();
                this.componentService.presentToast('Mail has been sent successfully.', 'success');
                this.thread = false;
                this.getReplyMailData(id);
            },
                err => {
                    this.componentService.dismissLoader();
                    this.showTechnicalError('1');
                });
        }

    };

    getReplyMailData(id) {
        var data = {
            userId: this.userId,
            smailId: id
        }
        this.APIService.putData('sMailApi', data).subscribe((mailsData) => {

            // console.log(mailsData);
            // console.log('reply')
            localStorage.setItem('mailData', JSON.stringify(mailsData));
            this.replyMail = JSON.parse(localStorage.getItem('mailData') || '');
            this.details = mailsData;
        },
            err => {
                this.showTechnicalError();
            });
    };


    async sendSmail(subject = null) {
        var i, j, usersArray, fromUser, ccArray, all_recipients, bccArray;
        //if overridecheckbox clicked
        var id = null;
        if (this.details.thread[0].mailId == null) {
            id = this.details.thread[0]._id;
        } else {
            id = this.details.thread[0].mailId;
        }

        // if user does't select the job button
        //is group message, i.e. multiple contacts selected for email 
        var isGroupMessage = false;

        //if simple mail compose i.e. no group selected via contact form

        //is contact selected for to option
        if (this.testCheckboxResult.length > 0) {
            //is multiple contact selected for to option
            if (this.testCheckboxResult.length > 1) {
                isGroupMessage = true;
                //if single to user selected and cc selected or multiple
            } else if (this.testCheckboxResult.length > 0 && this.ccCheckboxResult.length > 0) {
                isGroupMessage = true;
            } else if (this.selectedGroups.length > 0) {
                isGroupMessage = true;
            } else {
                //if contact selected for cc option
                if (this.ccCheckboxResult.length > 0) {
                    //if multiple contacts selected for cc option
                    if (this.ccCheckboxResult.length > 1) {
                        isGroupMessage = true;
                    }
                }
            }
            //if contact selected for cc option
            if (this.bccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
        } else {
            //if contact selected for cc option
            if (this.ccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
            //if contact selected for cc option
            if (this.bccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
            if (this.selectedGroups.length > 0) {
                isGroupMessage = true;
            }
        }

        if (subject == 'RFI Requested') {
            isGroupMessage = false;
        }

        //if is group message
        if (isGroupMessage == true) {
            //if group is created i.e. random group message
            if (this.isGroupCreated == true) {
                // console.log(true);
            } else {
                //if group is not created
                //if override selected i.e. message override
                if (this.override == true) {
                    if (this.level == undefined) {
                        this.componentService.presentToast('Please select override level.', 'danger');
                    } else {
                        // console.log('override true with level select');
                    }
                } else {

                    var data = this.details.thread[0].level;
                    usersArray = [],
                        all_recipients = [],
                        fromUser = [];
                    fromUser.push({
                        'userId': localStorage.getItem('userinfo'),
                        'level': data
                    });


                    for (i = 0; i < this.testCheckboxResult.length; i++) {
                        // console.log(this.testCheckboxResult[i].userId)
                        usersArray.push({
                            'userId': this.testCheckboxResult[i].userId,
                            'level': data
                        });
                        all_recipients.push(this.testCheckboxResult[i].userId);
                    }
                    if (this.ccCheckboxResult.length > 0) {
                        for (i = 0; i < this.ccCheckboxResult.length; i++) {
                            usersArray.push({
                                'userId': this.ccCheckboxResult[i].userId,
                                'level': data
                            });
                            all_recipients.push(this.ccCheckboxResult[i].userId);
                        }
                    }

                    if (this.bccCheckboxResult.length > 0) {
                        for (i = 0; i < this.bccCheckboxResult.length; i++) {
                            usersArray.push({
                                'userId': this.bccCheckboxResult[i].userId,
                                'level': data
                            });
                            all_recipients.push(this.bccCheckboxResult[i].userId);
                        }
                    }

                    if (this.selectedGroups.length > 0) {
                        for (i = 0; i < this.selectedGroups.length; i++) {
                            var all_groupdata = this.selectedGroups[i].groupdata.split(',');
                            for (var a = 0; a < all_groupdata.length; a++) {
                                if (all_groupdata[a] != '') {
                                    if (all_recipients.indexOf(all_groupdata[a]) == -1) {
                                        usersArray.push({
                                            'userId': all_groupdata[a],
                                            'level': data
                                        });
                                        all_recipients.push(all_groupdata[a]);
                                    }
                                }
                            }
                        }
                    }

                    this.smailData = {
                        'toId': usersArray,
                        'fromId': fromUser,
                        'subject': this.details.thread[0].subject,
                        'message': this.desc,
                        'attacment': this.attacments,
                        'isReply': true,
                        'mailId': id,
                        'bcc': this.bccId,
                        'cc': this.ccId,
                        'override': true,
                        'level': data,
                        'isGroupMsg': true,
                        'read': false,
                        'isForward': false,
                        'jobId': null,
                        'tradeId': null
                    };

                    if (usersArray.length == 0) {
                        this.componentService.presentToast('Please specify at least one recipient.', 'danger');

                    } else if (this.desc == '') {
                        this.componentService.presentToast('Please enter message.', 'danger');
                    } else {
                        this.componentService.showLoader();
                        this.APIService.sendData('sMailApi',this.smailData).subscribe((data) => {
                            // console.log(data);
                            this.componentService.dismissLoader();
                            this.componentService.presentToast('Mail has been sent successfully.','success');
                            localStorage.setItem('view', 'Sent');
                            this.thread = false;
                            this.getReplyMailData(id);;
                        },
                            err => {
                                this.componentService.dismissLoader();
                                this.showTechnicalError('1');
                            });
                    }
                }
            }
        } else {
            //if only one contact selected for email sent
            usersArray = [],
                fromUser = [],
                ccArray = [],
                bccArray = [];
            for (i = 0; i < this.testCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.testCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        } else if (this.override == true && this.data[j].force == false) {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        } else {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        }

                    }
                }
            }

            for (i = 0; i < this.ccCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.ccCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else if (this.override == true && this.data[j].force == false) {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        }

                    }
                }
            }


            for (i = 0; i < this.bccCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.bccCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else if (this.override == true && this.data[j].force == false) {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        }

                    }
                }
            }

            if (subject == 'RFI Requested') {
                usersArray = [{
                    'userId': this.details.thread[0].fromId[0].userId,
                    'level': '0'
                }];
                fromUser = [{
                    'userId': localStorage.getItem('userinfo'),
                    'level': '0'
                }];
            }

            // console.log(usersArray)
            var mailData = {
                'toId': usersArray,
                'fromId': fromUser,
                'subject': this.details.thread[0].subject,
                'message': this.desc,
                'attacment': this.attacments,
                'isReply': true,
                'mailId': id,
                'bcc': bccArray,
                'cc': ccArray,
                'override': this.override,
                'level': this.level,
                'isGroupMsg': false,
                'read': false,
                'isForward': false,
                'jobId': null,
                'tradeId': null,
                'RfiEmailId': this.details.thread[0].others
            };
            // console.log(mailData);

            if (usersArray.length == 0) {
                this.componentService.presentToast('Please specify at least one recipient.','danger')
                
            } else if (this.subject == '' && this.desc == '') {
                let alert = await this.alertCtrl.create({
                    header: 'Smail',
                    subHeader: 'Send this message without a subject or text in the body?',
                    buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            // console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'OK',
                        handler: () => {
                            // console.log('Buy clicked');
                            this.componentService.showLoader();
                            this.APIService.sendData('sMailApi', mailData).subscribe((data) => {
                                // console.log(data);
                                this.componentService.dismissLoader();
                                this.componentService.presentToast('Mail has been sent successfully.','success');
                                // localStorage.setItem('view', 'Sent');
                                this.thread = false;
                                this.getReplyMailData(id);
                            },
                                err => {
                                    this.componentService.dismissLoader();
                                    this.showTechnicalError('1');
                                });
                        }
                    }
                    ]
                });
                alert.present();
            } else {
                this.componentService.showLoader();
                this.APIService.sendData('sMailApi', mailData).subscribe((data) => {
                    // console.log(data);
                    this.componentService.dismissLoader();
                    this.componentService.presentToast('Mail has been sent successfully.','success');
                    // localStorage.setItem('view', 'Sent');
                    this.thread = false;
                    this.getReplyMailData(id);
                },
                    err => {
                        this.componentService.dismissLoader();
                        this.showTechnicalError('1');
                    });
            }
        }


    };


    async fwdmail() {
        var i, j, usersArray, all_recipients, fromUser, ccArray, bccArray;
        //if overridecheckbox clicked
        var id = null;
        if (this.details.thread[0].mailId == null) {
            id = this.details.thread[0]._id;
        } else {
            id = this.details.thread[0].mailId;
        }
        // if user does't select the job button
        //is group message, i.e. multiple contacts selected for email 
        var isGroupMessage = false;
        //if simple mail compose i.e. no group selected via contact form
        //is contact selected for to option
        if (this.testCheckboxResult.length > 0) {
            //is multiple contact selected for to option
            if (this.testCheckboxResult.length > 1) {
                isGroupMessage = true;
                //if single to user selected and cc selected or multiple
            } else if (this.testCheckboxResult.length > 0 && this.ccCheckboxResult.length > 0) {
                isGroupMessage = true;
            } else if (this.selectedGroups.length > 0) {
                isGroupMessage = true;
            } else {
                //if contact selected for cc option
                if (this.ccCheckboxResult.length > 0) {
                    //if multiple contacts selected for cc option
                    if (this.ccCheckboxResult.length > 1) {
                        isGroupMessage = true;
                    }
                }
            }
            //if contact selected for cc option
            if (this.bccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
        } else {
            //if contact selected for cc option
            if (this.ccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
            //if contact selected for cc option
            if (this.bccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
            if (this.selectedGroups.length > 0) {
                isGroupMessage = true;
            }
        }
        //if is group message
        if (isGroupMessage == true) {
            //if group is created i.e. random group message
            if (this.isGroupCreated == true) {
                // console.log(true);
            } else {
                //if group is not created
                //if override selected i.e. message override
                if (this.override == true) {
                    if (this.level == undefined) {
                        this.componentService.presentToast('Please select override level.','danger');
                       
                    } else {
                        // console.log('override true with level select');
                    }
                } else {
                    var data = this.details.thread[0].level;

                    usersArray = [],
                        all_recipients = [],
                        fromUser = [];

                    fromUser.push({
                        'userId': localStorage.getItem('userinfo'),
                        'level': data
                    });


                    for (i = 0; i < this.testCheckboxResult.length; i++) {
                        // console.log(this.testCheckboxResult[i].userId)
                        usersArray.push({
                            'userId': this.testCheckboxResult[i].userId,
                            'level': data
                        });
                        all_recipients.push(this.testCheckboxResult[i].userId);
                    }
                    if (this.ccCheckboxResult.length > 0) {
                        for (i = 0; i < this.ccCheckboxResult.length; i++) {
                            usersArray.push({
                                'userId': this.ccCheckboxResult[i].userId,
                                'level': data
                            });
                            all_recipients.push(this.ccCheckboxResult[i].userId);
                        }
                    }

                    if (this.bccCheckboxResult.length > 0) {
                        for (i = 0; i < this.bccCheckboxResult.length; i++) {
                            usersArray.push({
                                'userId': this.bccCheckboxResult[i].userId,
                                'level': data
                            });
                            all_recipients.push(this.bccCheckboxResult[i].userId);
                        }
                    }

                    if (this.selectedGroups.length > 0) {
                        for (i = 0; i < this.selectedGroups.length; i++) {
                            var all_groupdata = this.selectedGroups[i].groupdata.split(',');
                            for (var a = 0; a < all_groupdata.length; a++) {
                                if (all_groupdata[a] != '') {
                                    if (all_recipients.indexOf(all_groupdata[a]) == -1) {
                                        usersArray.push({
                                            'userId': all_groupdata[a],
                                            'level': data
                                        });
                                        all_recipients.push(all_groupdata[a]);
                                    }
                                }
                            }
                        }
                    }
                    this.frd_mailData = {
                        'toId': usersArray,
                        'fromId': fromUser,
                        'subject': this.details.thread[0].subject,
                        'message': this.desc,
                        'attacment': this.attacments,
                        'isReply': true,
                        'mailId': id,
                        'bcc': this.bccId,
                        'cc': this.ccId,
                        'override': true,
                        'level': data,
                        'isGroupMsg': true,
                        'read': false,
                        'isForward': true,
                        'jobId': null,
                        'tradeId': null
                    };
                    if (usersArray.length == 0) {
                        this.componentService.presentToast('Please specify at least one recipient.','danger')
                        
                    } else if (this.desc == '') {
                        this.componentService.presentToast('Please enter message.','danger')

                    } else if (this.subject == '') {
                        let alert = await this.alertCtrl.create({
                            header: 'Smail',
                            subHeader: 'Send this message without a subject or text in the body?',
                            buttons: [{
                                text: 'Cancel',
                                role: 'cancel',
                                handler: () => {
                                    // console.log('Cancel clicked');
                                }
                            },
                            {
                                text: 'OK',
                                handler: () => {
                                    this.componentService.showLoader();
                                    this.APIService.sendData('sMailApi',this.frd_mailData).subscribe((data) => {
                                        this.componentService.dismissLoader();
                                        this.componentService.presentToast( 'Mail has been sent successfully.','success');
                                          // localStorage.setItem('view', 'Sent');
                                        this.thread = false;
                                        this.getReplyMailData(id);;
                                    },
                                        err => {
                                            this.componentService.dismissLoader();
                                            this.showTechnicalError('1');
                                        });
                                }
                            }
                            ]
                        });
                        alert.present();
                    } else {
                        this.componentService.showLoader();
                        this.APIService.sendData('sMailApi',this.frd_mailData).subscribe((data) => {
                            this.componentService.dismissLoader();
                            this.componentService.presentToast('Mail has been sent successfully.','success');
                            
                            // localStorage.setItem('view', 'Sent');
                            this.thread = false;
                            this.getReplyMailData(id);;
                        },
                            err => {
                                this.componentService.dismissLoader();
                                this.showTechnicalError('1');
                            });
                    }
                }
            }
        } else {
            //if only one contact selected for email sent
            usersArray = [],
                fromUser = [],
                ccArray = [],
                bccArray = [];
            for (i = 0; i < this.testCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.testCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        } else if (this.override == true && this.data[j].force == false) {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        } else {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        }

                    }
                }
            }
            for (i = 0; i < this.ccCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.ccCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else if (this.override == true && this.data[j].force == false) {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        }

                    }
                }
            }
            for (i = 0; i < this.bccCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.bccCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else if (this.override == true && this.data[j].force == false) {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        }

                    }
                }
            }
            var mailData = {
                'toId': usersArray,
                'fromId': fromUser,
                'subject': this.details.thread[0].subject,
                'message': this.desc,
                'attacment': this.attacments,
                'isReply': true,
                'mailId': id,
                'bcc': bccArray,
                'cc': ccArray,
                'override': this.override,
                'level': this.level,
                'isGroupMsg': false,
                'read': false,
                'isForward': true,
                'jobId': null,
                'tradeId': null
            };
            if (usersArray.length == 0) {
                this.componentService.presentToast('Please specify at least one recipient.', 'danger')
                
            } else if (this.desc == '') {
                this.componentService.presentToast('Please enter message.','danger')
               
            } else if (this.subject == '') {
                let alert = await this.alertCtrl.create({
                    header: 'Smail',
                    subHeader: 'Send this message without a subject?',
                    buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            // console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'OK',
                        handler: () => {
                            // console.log('Buy clicked');
                            this.componentService.showLoader();
                            this.APIService.sendData('sMailApi', mailData).subscribe((data) => {
                                // console.log(data);
                                this.componentService.dismissLoader();
                                this.componentService.presentToast('Mail has been sent successfully.','success')
                                
                                // localStorage.setItem('view', 'Sent');
                                this.thread = false;
                                this.getReplyMailData(id);
                            },
                                err => {
                                    this.componentService.dismissLoader();
                                    this.showTechnicalError('1');
                                });
                        }
                    }
                    ]
                });
                alert.present();
            } else {
                this.componentService.showLoader();
                this.APIService.sendData('sMailApi', mailData).subscribe((data) => {
                    // console.log(data);
                    this.componentService.dismissLoader();
                    this.componentService.presentToast('Mail has been sent successfully.','success')
                    
                    // localStorage.setItem('view', 'Sent');
                    this.thread = false;
                    this.getReplyMailData(id);
                },
                    err => {
                        this.componentService.dismissLoader();
                        this.showTechnicalError('1');
                    });
            }
        }
    };

    toUserName(name) {
        this.toId = name;
        // console.log(name);
    };

    toCcName(name) {
        this.ccId = name;
        // console.log(name);
    };

    toBccName(name) {
        this.bccId = name;
        // console.log(name);
    };

    // doCheckbox() {
    //     var i, j, k, m;
    //     let alert = this.alertCtrl.create();
    //     alert.setTitle('Select Contact');
    //     //if to contact not selected yet 
    //     if (this.testCheckboxResult.length == 0) {
    //         for (i = 0; i < this.data.length; i++) {
    //             //contact validation based on db conditions
    //             if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                 //if cc contacts selected 

    //                 var isContactExist = false;
    //                 for (k = 0; k < this.ccCheckboxResult.length; k++) {
    //                     if (this.data[i].userId == this.ccCheckboxResult[k].userId) {
    //                         isContactExist = true;
    //                     }
    //                 }
    //                 if (isContactExist == false) {
    //                     for (m = 0; m < this.bccCheckboxResult.length; m++) {
    //                         if (this.data[i].userId == this.bccCheckboxResult[m].userId) {
    //                             isContactExist = true;
    //                         }
    //                     }

    //                     if (!isContactExist) {
    //                         alert.addInput({
    //                             type: 'checkbox',
    //                             label: this.data[i].name,
    //                             value: this.data[i],
    //                             checked: false
    //                         });
    //                     }
    //                 }

    //             }
    //         }
    //     } else {
    //         for (i = 0; i < this.data.length; i++) {
    //             if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                 var isUserExist = false;
    //                 for (j = 0; j < this.testCheckboxResult.length; j++) {
    //                     if (this.data[i].userId == this.testCheckboxResult[j].userId) {
    //                         if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                             isUserExist = true;
    //                         }
    //                     }
    //                 }

    //                 if (isUserExist) {
    //                     alert.addInput({
    //                         type: 'checkbox',
    //                         label: this.data[i].name,
    //                         value: this.data[i],
    //                         checked: true
    //                     });
    //                 } else {
    //                     var bccContact = this.bccCheckboxResult;
    //                     if (this.ccCheckboxResult.length > 0) {
    //                         for (j = 0; j < this.ccCheckboxResult.length; j++) {
    //                             if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
    //                                 if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                                     isUserExist = true;
    //                                 }
    //                             }
    //                         }
    //                         if (!isUserExist) {
    //                             for (m = 0; m < bccContact.length; j++) {
    //                                 if (this.data[i].userId == bccContact[m].userId) {
    //                                     if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                                         isUserExist = true;
    //                                     }
    //                                 }
    //                             }

    //                             if (!isUserExist) {
    //                                 alert.addInput({
    //                                     type: 'checkbox',
    //                                     label: this.data[i].name,
    //                                     value: this.data[i],
    //                                     checked: false
    //                                 });
    //                             }
    //                         }
    //                     } else {
    //                         alert.addInput({
    //                             type: 'checkbox',
    //                             label: this.data[i].name,
    //                             value: this.data[i],
    //                             checked: false
    //                         });
    //                     }

    //                 }
    //             }
    //         }
    //     }

    //     alert.addButton('Cancel');

    //     alert.addButton({
    //         text: 'Okay',
    //         handler: data => {

    //             this.testCheckboxOpen = false;
    //             this.testCheckboxResult = data;

    //             if (this.testCheckboxResult.length == 1) {
    //                 if (this.userId == this.testCheckboxResult[0].senderId) {
    //                     this.level = this.testCheckboxResult[0].senderSetLevel;
    //                 } else {
    //                     this.level = this.testCheckboxResult[0].reciverSetLevel;
    //                 }
    //             }
    //         }
    //     });

    //     alert.present().then(() => {
    //         this.testCheckboxOpen = true;
    //     });
    // };

    discardSmail() {
        //console.log('test')
        this.toId = [];
        this.testCheckboxResult = [];
        this.bccId = '';
        this.ccId = '';
        //this.subject = '';
        this.desc = '';
        this.ccCheckboxResult = [];
        this.bccCheckboxResult = [];
        this.attacments = [];
        this.level = '';
        this.thread = false;
        //console.log(this.toId)
    };

    removeContact(contact) {
        for (var i = 0; i < this.testCheckboxResult.length; i++) {
            if (contact.userId == this.testCheckboxResult[i].userId) {
                this.testCheckboxResult.splice(i, 1);
            }
        }
        this.replyMail = JSON.parse(localStorage.getItem('mailData') || '');
        if (this.testCheckboxResult.length == 1) {
            if (this.userId == this.testCheckboxResult[0].senderId) {
                this.level = this.testCheckboxResult[0].senderSetLevel;
            } else {
                this.level = this.testCheckboxResult[0].reciverSetLevel;
            }
        }
    };

    removeCcContact(contact) {
        for (var i = 0; i < this.ccCheckboxResult.length; i++) {
            if (contact.userId == this.ccCheckboxResult[i].userId) {
                this.ccCheckboxResult.splice(i, 1);
            }
        }
    };

    removeBccContact(contact) {
        for (var i = 0; i < this.bccCheckboxResult.length; i++) {
            if (contact.userId == this.bccCheckboxResult[i].userId) {
                this.bccCheckboxResult.splice(i, 1);
            }
        }
    };

    // ccCheckbox() {
    //     var i, j, k, m, isUserExist;
    //     let alert = this.alertCtrl.create();
    //     alert.setTitle('Select Contact');
    //     //if no cc contact selected yet
    //     if (this.ccCheckboxResult.length == 0) {
    //         //if no to contact selected yet
    //         if (this.testCheckboxResult.length == 0 && this.bccCheckboxResult.length == 0) {
    //             for (i = 0; i < this.data.length; i++) {
    //                 //check contact validation based on set params in db
    //                 if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                     alert.addInput({
    //                         type: 'checkbox',
    //                         label: this.data[i].name,
    //                         value: this.data[i],
    //                         checked: false
    //                     });
    //                 }
    //             }
    //         } else {
    //             //if to contact selected
    //             var bccContact = this.bccCheckboxResult;
    //             for (i = 0; i < this.data.length; i++) {
    //                 isUserExist = false;
    //                 for (j = 0; j < this.testCheckboxResult.length; j++) {
    //                     if (this.data[i].userId == this.testCheckboxResult[j].userId) {
    //                         if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                             isUserExist = true;
    //                         }
    //                     }
    //                 }
    //                 // if user not selected yet
    //                 if (!isUserExist) {
    //                     for (k = 0; k < bccContact.length; k++) {
    //                         if (this.data[i].userId == bccContact[k].userId) {
    //                             if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                                 isUserExist = true;
    //                             }
    //                         }
    //                     }

    //                     if (!isUserExist) {
    //                         alert.addInput({
    //                             type: 'checkbox',
    //                             label: this.data[i].name,
    //                             value: this.data[i],
    //                             checked: false
    //                         });
    //                     }
    //                 }
    //             }
    //         }
    //     } else if (this.ccCheckboxResult.length > 0 && this.testCheckboxResult.length == 0 && this.bccCheckboxResult.length == 0) {
    //         for (i = 0; i < this.data.length; i++) {
    //             isUserExist = false;
    //             for (j = 0; j < this.ccCheckboxResult.length; j++) {
    //                 if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
    //                     if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                         isUserExist = true;
    //                     }
    //                 }
    //             }
    //             if (isUserExist) {
    //                 alert.addInput({
    //                     type: 'checkbox',
    //                     label: this.data[i].name,
    //                     value: this.data[i],
    //                     checked: true
    //                 });
    //             } else {
    //                 alert.addInput({
    //                     type: 'checkbox',
    //                     label: this.data[i].name,
    //                     value: this.data[i],
    //                     checked: false
    //                 });
    //             }
    //         }
    //     } else if (this.ccCheckboxResult.length == 0 && this.testCheckboxResult.length > 0 && this.bccCheckboxResult.length == 0) {
    //         for (i = 0; i < this.data.length; i++) {
    //             isUserExist = false;
    //             for (j = 0; j < this.testCheckboxResult.length; j++) {
    //                 if (this.data[i].userId == this.testCheckboxResult[j].userId) {
    //                     if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                         isUserExist = true;
    //                     }
    //                 }
    //             }
    //             if (!isUserExist) {
    //                 alert.addInput({
    //                     type: 'checkbox',
    //                     label: this.data[i].name,
    //                     value: this.data[i],
    //                     checked: true
    //                 });
    //             }
    //         }
    //     } else {
    //         for (i = 0; i < this.data.length; i++) {
    //             isUserExist = false;
    //             //check user exist in cc list
    //             for (j = 0; j < this.ccCheckboxResult.length; j++) {
    //                 if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
    //                     if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                         isUserExist = true;
    //                     }
    //                 }
    //             }
    //             if (isUserExist) {
    //                 alert.addInput({
    //                     type: 'checkbox',
    //                     label: this.data[i].name,
    //                     value: this.data[i],
    //                     checked: true
    //                 });
    //             } else {
    //                 //check user exist in to list
    //                 isUserExist = false;
    //                 for (k = 0; k < this.testCheckboxResult.length; k++) {
    //                     if (this.data[i].userId == this.testCheckboxResult[k].userId) {
    //                         if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                             isUserExist = true;
    //                         }
    //                     }
    //                 }
    //                 if (!isUserExist) {
    //                     for (m = 0; m < this.bccCheckboxResult.length; m++) {
    //                         if (this.data[i].userId == this.bccCheckboxResult[m].userId) {
    //                             if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                                 isUserExist = true;
    //                             }
    //                         }
    //                     }

    //                     if (!isUserExist) {
    //                         alert.addInput({
    //                             type: 'checkbox',
    //                             label: this.data[i].name,
    //                             value: this.data[i],
    //                             checked: false
    //                         });
    //                     }
    //                 }
    //             }
    //         }
    //     }


    //     alert.addButton('Cancel');

    //     alert.addButton({
    //         text: 'Okay',
    //         handler: data => {
    //             // console.log('Checkbox data:', data);
    //             //this.testCheckboxOpen = false;
    //             this.ccCheckboxResult = data;
    //         }
    //     });

    //     alert.present().then(() => {
    //         this.testCheckboxOpen = true;
    //     });
    // };


    // bccCheckbox() {
    //     var i, j, k, m, isUserExist;
    //     let alert = this.alertCtrl.create();
    //     alert.setTitle('Select Contact');


    //     //if no cc contact selected yet
    //     if (this.bccCheckboxResult.length == 0) {
    //         //if no to contact selected yet
    //         if (this.testCheckboxResult.length == 0 && this.ccCheckboxResult.length == 0) {
    //             for (i = 0; i < this.data.length; i++) {
    //                 //check contact validation based on set params in db
    //                 if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                     alert.addInput({
    //                         type: 'checkbox',
    //                         label: this.data[i].name,
    //                         value: this.data[i],
    //                         checked: false
    //                     });
    //                 }
    //             }
    //         } else {
    //             //if to contact selected
    //             for (i = 0; i < this.data.length; i++) {
    //                 isUserExist = false;
    //                 if (this.ccCheckboxResult.length > 0) {
    //                     for (j = 0; j < this.ccCheckboxResult.length; j++) {
    //                         if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
    //                             if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                                 isUserExist = true;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 // if user not selected yet
    //                 if (!isUserExist) {
    //                     if (this.testCheckboxResult.length > 0) {
    //                         for (j = 0; j < this.testCheckboxResult.length; j++) {
    //                             if (this.data[i].userId == this.testCheckboxResult[j].userId) {
    //                                 if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                                     isUserExist = true;
    //                                 }
    //                             }
    //                         }
    //                     }
    //                     if (!isUserExist) {
    //                         alert.addInput({
    //                             type: 'checkbox',
    //                             label: this.data[i].name,
    //                             value: this.data[i],
    //                             checked: false
    //                         });
    //                     }
    //                 }
    //             }
    //         }
    //     } else if (this.bccCheckboxResult.length > 0 && this.testCheckboxResult.length == 0 && this.testCheckboxResult.length == 0) {
    //         for (i = 0; i < this.data.length; i++) {
    //             isUserExist = false;
    //             for (j = 0; j < this.bccCheckboxResult.length; j++) {
    //                 if (this.data[i].userId == this.bccCheckboxResult[j].userId) {
    //                     if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                         isUserExist = true;
    //                     }
    //                 }
    //             }
    //             if (isUserExist) {
    //                 alert.addInput({
    //                     type: 'checkbox',
    //                     label: this.data[i].name,
    //                     value: this.data[i],
    //                     checked: true
    //                 });
    //             } else {
    //                 // alert.addInput({
    //                 //  type: 'checkbox',
    //                 //  label: this.data[i].name,
    //                 //  value: this.data[i],
    //                 //      checked: false
    //                 // });
    //                 if (this.ccCheckboxResult.length > 0) {
    //                     for (j = 0; j < this.ccCheckboxResult.length; j++) {
    //                         if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
    //                             if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                                 isUserExist = true;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 // if user not selected yet
    //                 if (!isUserExist) {
    //                     if (this.testCheckboxResult.length > 0) {
    //                         for (j = 0; j < this.testCheckboxResult.length; j++) {
    //                             if (this.data[i].userId == this.testCheckboxResult[j].userId) {
    //                                 if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                                     isUserExist = true;
    //                                 }
    //                             }
    //                         }
    //                     }
    //                     if (!isUserExist) {
    //                         alert.addInput({
    //                             type: 'checkbox',
    //                             label: this.data[i].name,
    //                             value: this.data[i],
    //                             checked: false
    //                         });
    //                     }
    //                 }
    //             }
    //         }
    //     } else {
    //         for (i = 0; i < this.data.length; i++) {
    //             isUserExist = false;
    //             //check user exist in cc list
    //             for (m = 0; j < this.bccCheckboxResult.length; j++) {
    //                 if (this.data[i].userId == this.bccCheckboxResult[m].userId) {
    //                     if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                         isUserExist = true;
    //                     }
    //                 }
    //             }
    //             if (isUserExist) {
    //                 alert.addInput({
    //                     type: 'checkbox',
    //                     label: this.data[i].name,
    //                     value: this.data[i],
    //                     checked: true
    //                 });
    //             } else {
    //                 for (j = 0; j < this.ccCheckboxResult.length; j++) {
    //                     if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
    //                         if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                             isUserExist = true;
    //                         }
    //                     }
    //                 }
    //                 if (!isUserExist) {
    //                     //check user exist in to list
    //                     isUserExist = false;
    //                     for (k = 0; k < this.testCheckboxResult.length; k++) {
    //                         if (this.data[i].userId == this.testCheckboxResult[k].userId) {
    //                             if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
    //                                 isUserExist = true;
    //                             }
    //                         }
    //                     }
    //                     if (!isUserExist) {
    //                         alert.addInput({
    //                             type: 'checkbox',
    //                             label: this.data[i].name,
    //                             value: this.data[i],
    //                             checked: false
    //                         });
    //                     }
    //                 }
    //             }
    //         }
    //     }


    //     alert.addButton('Cancel');

    //     alert.addButton({
    //         text: 'Okay',
    //         handler: data => {
    //             // console.log('Checkbox data:', data);
    //             //  this.testCheckboxOpen = false;
    //             this.bccCheckboxResult = data;
    //         }
    //     });

    //     alert.present().then(() => {
    //         this.testCheckboxOpen = true;
    //     });
    // };

    removeGroupsContact(contact) {
        for (var i = 0; i < this.selectedGroups.length; i++) {
            if (contact._id == this.selectedGroups[i]._id) {
                this.selectedGroups.splice(i, 1);
            }
        }
    };

    // groupListing() {
    //     this.groupprovider.getGroupData(this.userId).subscribe(response => {


    //         let alert = this.alertCtrl.create();
    //         alert.setTitle('Select Group');

    //         for (var i = 0; i < response.length; i++) {
    //             var isExist = false;
    //             for (var j = 0; j < this.selectedGroups.length; j++) {
    //                 if (response[i]._id == this.selectedGroups[j]._id) {
    //                     isExist = true;
    //                 }
    //             }

    //             if (isExist == true) {
    //                 alert.addInput({
    //                     type: 'checkbox',
    //                     label: response[i].name,
    //                     value: response[i],
    //                     checked: true
    //                 });
    //             } else {
    //                 alert.addInput({
    //                     type: 'checkbox',
    //                     label: response[i].name,
    //                     value: response[i],
    //                     checked: false
    //                 });
    //             }

    //         }

    //         alert.addButton('Cancel');

    //         alert.addButton({
    //             text: 'Okay',
    //             handler: data => {

    //                 this.testCheckboxOpen = false;
    //                 this.groups = data;
    //                 this.selectedGroups = data;
    //                 if (this.groups.length == 1) {
    //                     this.level = this.groups[0].userLevel;
    //                 }
    //                 // for(var j=0; j < data.length; j++){
    //                 //   for(var i=0; i < this.data.length; i++){
    //                 //     if(this.data[i]._id == data[j]){
    //                 //       this.data.splice(i, 1);
    //                 //     }
    //                 //   }
    //                 // }
    //             }
    //         });

    //         alert.present().then(() => {
    //             this.testCheckboxOpen = true;
    //         });

    //     },
    //         err => {
    //             this.showTechnicalError();
    //         });
    // };

   async  presentPromptGroup() {
        let alert = await this.alertCtrl.create({
            header: 'Create Group',
            inputs: [{
                name: 'Name',
                placeholder: 'name'
            },
            {
                name: 'level',
                placeholder: 'level',
                type: 'text'
            }
            ],
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: data => {
                    // console.log('Cancel clicked');
                }
            },
            {
                text: 'Save',
                handler: data => {
                    var groupdata:any = [],
                        groupUsers = '',
                        obj = {};
                    // if (!(data.name && data.level))) {
                    // logged in!
                    var i;
                    if (this.testCheckboxResult.length > 0) {
                        for (i = 0; i < this.testCheckboxResult.length; i++) {
                            groupdata.push(this.testCheckboxResult[i].userId);
                        }
                    }

                    if (this.ccCheckboxResult.length > 0) {
                        for (i = 0; i < this.ccCheckboxResult.length; i++) {
                            groupdata.push(this.ccCheckboxResult[i].userId);
                        }
                    }

                    if (this.bccCheckboxResult.length > 0) {
                        for (i = 0; i < this.bccCheckboxResult.length; i++) {
                            groupdata.push(this.bccCheckboxResult[i].userId);
                        }
                    }

                    for (i = 0; i < groupdata.length; i++) {
                        groupUsers = groupUsers + groupdata[i] + ',';
                    }

                    obj = {
                        groupdata: groupUsers,
                        userId: this.userId,
                        userLevel: data.level,
                        name: data.Name
                    };

                    this.APIService.sendData('addGroup',obj).subscribe((response:any) => {
                        // console.log(response);
                        if (response.status == 0) {
                            this.componentService.presentToast('Group name already exist.','danger');
                           
                        } else {
                            this.isGroupCreated = true;
                            this.componentService.presentToast('Group created successfully.','success');
                        }

                    },
                        err => {
                            this.showTechnicalError('1');
                        });
                }
            }
            ]
        });

        alert.present();
    };

    callStaticFunction() {
        // console.log(localStorage.getItem('fname'));
        this.selectedFolder = localStorage.getItem('fname');
        this.selectedLevel = localStorage.getItem('smail_path');
        this.which_level = localStorage.getItem('which_level');
        // console.log(localStorage.getItem('current_folder'));
        if (localStorage.getItem('current_folder') == "inbox") {
            this.inboxData('ee', '1');
        } else {
            this.sentMailsData('ee', '1');
        }
    };

    //NODE CLICK FUNCTION: If the node is a child (it has the component property) 
    clickNode(node) {
        this.bread_level = node.name;
        this.bread_level_node = node;
        this.bread_folder = '';
        this.bread_static = '';
        //this.preState = null;
        this.showNodeStatic = null;
        this.showNodeChild = null;
        localStorage.removeItem('current_smail_path');
        if (!(node.component)) {
            //NODE IS A FOLDER --> expand childs
            this.showChild(node);

        } else {
            //NODE IS A FILE --> open Page Component in data model, passing the node such as parameter.
            this.shownGroup = null;
            this.navCtrl.navigateForward(node.component, { state:{
                node: node
            }
            });
        }
    };

    //FUNCTION TO CHANGE THE NODE WHICH IS ACTUALLY EXPANDED.
    showChild(node) {
        if (this.isSelected(node)) {
            this.removeArray(this.shownGroup, node.name);

        } else {
            //The node is actually contacted --> expand node and show childs
            this.shownGroup.push(node.name);
            localStorage.setItem('smail_path', node.name);
            // console.log(node.name)
            // this.selectedFolder = 'folder';
            this.selectedLevel = node.name;
            this.selectedNode = node.name;
            //this.inboxData('ee','1');
        }
    };

    //FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
    isSelected(node) {
        return (this.shownGroup.indexOf(node.name) >= 0);
    };

    clickNodeChild(node) {
        this.bread_folder = node.name;
        this.bread_folder_node = node;
        this.bread_static = '';
        this.showNodeStatic = null;

        if (!(node.component)) {
            //NODE IS A FOLDER --> expand childs
            this.showChildNode(node);
        } else {
            //NODE IS A FILE --> open Page Component in data model, passing the node such as parameter.
            this.showNodeChild = null;
            this.navCtrl.navigateForward(node.component, { state :{
                node: node
            }
            });
        }
    };

    showChildNode(node) {
        if (this.isSelectedChild(node)) {
            //The node is actually expanded --> contract node and don't show childs
            this.showNodeChild = null;
            // localStorage.removeItem('smail_path');
            // localStorage.setItem('current_smail_path', node._id);
            // localStorage.setItem('fname', node.name);
            // console.log(node.name)
            // this.selectedFolder = node.name;
            // this.selectedNode = node.name;
            // this.selectedFolderId = node._id;
            // this.selecetedFolderNode = node;
            // this.selectedLevel = localStorage.getItem('smail_path');
            // this.inboxData('ee');
        } else {
            //The node is actually contacted --> expand node and show childs
            this.showNodeChild = node;
            localStorage.removeItem('smail_path');
            localStorage.setItem('current_smail_path', node._id);
            localStorage.setItem('fname', node.name);
            localStorage.setItem('which_level', node.level.replace('level', ''));
            // this.selectedFolder = node.name;
            this.selectedNode = node.name;
            this.selectedFolderId = node._id;
            this.selecetedFolderNode = node;
            this.selectedLevel = localStorage.getItem('smail_path');
            //this.inboxData('ee','1');
        }
    };

    //FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
    isSelectedChild(node) {
        return this.showNodeChild === node;
    };

    clickNodeStatic(node) {
        this.bread_static = node;
        if (!(node.component)) {
            //NODE IS A FOLDER --> expand childs
            this.showChildStatic(node);

        } else {
            //NODE IS A FILE --> open Page Component in data model, passing the node such as parameter.
            this.showNodeChild = null;
            this.navCtrl.navigateForward(node.component, {state:{
                node: node
            }
            });
        }
    };

    showChildStatic(node) {
        if (this.isSelectedStatic(node)) {
            //The node is actually expanded --> contract node and don't show childs
            this.showNodeStatic = null;
        } else {
            //this.preState = '';
            //The node is actually contacted --> expand node and show childs
            this.showNodeStatic = node;
            this.selectedNode = '';
            localStorage.removeItem('current_smail_path');
            localStorage.setItem('current_folder', node);
            // console.log(node);
            this.callStaticFunction();
        }
    };

    //FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
    isSelectedStatic(node) {
        return this.showNodeStatic === node;
    };

    editFolder(name, id) {
        $("#val_" + id).val(name.name);
        this.Node = name;
        this.foldername = name.name;
        if (this.prevId == null) {
            var p :any = document.getElementById(id);
            var q :any = document.getElementById('0' + id);
            this.prevId = id;
            p.style.display = 'block';
            q.style.display = 'none';
        } else {
            var p :any = document.getElementById(id);
            var q :any= document.getElementById('0' + id);
            var r :any= document.getElementById(this.prevId)
            var s :any = document.getElementById('0' + this.prevId)
            r.style.display = 'none';
            s.style.display = 'block';
            p.style.display = 'block';
            q.style.display = 'none';
        }
    };

    renameFolder(index, id) {
        this.componentService.showLoader();
        localStorage.setItem('nodename', this.Node.name);
        localStorage.setItem('nodelevel', this.Node.level);
        // console.log(this.oldValue);
        // console.log(this.Node);
        var data = this.Node;
        data.name = $("#val_" + id).val();
        // console.log(this.Node);
        //this.Node.name = this.Node;
        this.APIService.sendData('renamefolder/' + data.userId ,data).subscribe((formdata :any) => {
            // console.log(formdata);
            if (formdata.status == 1) {
                var p :any = document.getElementById(id);
                var q :any = document.getElementById('0' + id);
                //document.getElementById('00'+id).innerHTML = this.Node;
                // this.directory[id].path = this.file_path.split('/').slice(0, -1).join('/')+'/'+this.Node;
                p.style.display = 'none';
                q.style.display = 'block';

                this.componentService.dismissLoader();
                this.componentService.presentToast('Folder name updated successfully.','success');
              
            } else if (formdata.status == 2) {
                this.componentService.dismissLoader();
                this.componentService.presentToast('Folder name already exists.','danger');

            } else {
                this.componentService.dismissLoader();
                this.componentService.presentToast('Error, plz try later.','danger');

            }
        },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
    };

    cancelFolder(index, id) {
        var p: any = document.getElementById(id);
        var q: any = document.getElementById('0' + id);
        p.style.display = 'none';
        q.style.display = 'block';
    };


    locksClicked() {
        //this.myEvent.emit(null)
        this.reverse = false;
        this.openedLevel = [];
        this.allowed_levels = [];
        this.levelArray = [];
        var userId = localStorage.getItem('userinfo');
        this.all_levels = JSON.parse(localStorage.getItem('alllevel') || '');
        var i;
        if (this.all_levels) {
            this.all_levels.forEach((value) => {
                // console.log(value);
                this.openedLevel = [];
                var decrypted = CryptoJS.AES.decrypt(value, userId || '');
                // console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                    this.openedLevel.push({
                        'level': 1,
                        'name': 'level1',
                        'checked': true
                    });
                    this.levelArray = [{
                        'level': 1,
                        'checked': true
                    }];
                    for (i = 0; i < 1; i++) {
                        this.allowed_levels.push('level' + (i + 1));
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                    this.openedLevel.push({
                        'level': 1,
                        'name': 'level1',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 2,
                        'name': 'level2',
                        'checked': true
                    });
                    this.levelArray = [{
                        'level': 1,
                        'checked': true
                    },
                    {
                        'level': 2,
                        'checked': true
                    }
                    ];
                    for (i = 0; i < 2; i++) {
                        this.allowed_levels.push('level' + (i + 1));
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                    this.openedLevel.push({
                        'level': 1,
                        'name': 'level1',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 2,
                        'name': 'level2',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 3,
                        'name': 'level3',
                        'checked': true
                    });
                    this.levelArray = [{
                        'level': 1,
                        'checked': true
                    },
                    {
                        'level': 2,
                        'checked': true
                    },
                    {
                        'level': 3,
                        'checked': true
                    }
                    ];
                    for (i = 0; i < 3; i++) {
                        this.allowed_levels.push('level' + (i + 1));
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    this.openedLevel.push({
                        'level': 1,
                        'name': 'level1',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 2,
                        'name': 'level2',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 3,
                        'name': 'level3',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 4,
                        'name': 'level4',
                        'checked': true
                    });
                    this.levelArray = [{
                        'level': 1,
                        'checked': true
                    },
                    {
                        'level': 2,
                        'checked': true
                    },
                    {
                        'level': 3,
                        'checked': true
                    },
                    {
                        'level': 4,
                        'checked': true
                    }
                    ];
                    for (i = 0; i < 4; i++) {
                        this.allowed_levels.push('level' + (i + 1));
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
                    this.openedLevel = [];
                    this.allowed_levels = [];
                    this.levelArray = [];
                    //localStorage.setItem('selectedLevel', 0);
                    localStorage.removeItem('selectedLevel');
                }
            });
            this.allowed_levels.push('level' + 0);

            // console.log()
        }

        this.APIService.getData('folder',this.userId).subscribe((all_files:any) => {
            // console.log(all_files)
            if (all_files.data == null) {
                this.directory = [];
            } else {
                var myArray = all_files.data;
                for (i = myArray.length - 1; i >= 0; --i) {
                    if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
                        myArray.splice(i, 1);
                    }
                }
                this.directory = myArray;
            }

            if (this.preState == 'Inbox') {
                this.inboxData('ee');
            } else {
                this.sentMailsData('ee');
            }

        },
            err => {
                this.showTechnicalError();
            });
        this.getOpenLevels();
    };

    async attachfiles() {
        let modal = await this.modalCtrl.create({
            component: 'SmailFileUploadPage',
        });
        modal.onDidDismiss().then((data: any) => {
            for (var i = 0; i < data.length; i++) {
                this.attacments.push(data[i]);
            }
        });
        await modal.present();
        ;
    };

    removeFile(index) {
        this.componentService.showLoader();
        this.APIService.deleteDirectoryFiles('directory/smail_data/' + this.attacments[index]).subscribe((response) => {
            // console.log(response);
            this.componentService.dismissLoader();
            this.attacments.splice(index, 1);
        },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
    };

    listCheckbox(isChecked, value, event) {
        console.log(isChecked,"++++++++++");
        if (isChecked == true) {
            this.deleteSmails.push(value);
        } else {
            for (var i = 0; i < this.deleteSmails.length; i++) {
                if (this.deleteSmails[i]._id == value._id) {
                    this.deleteSmails.splice(i, 1);
                }
            }
        }
    };

    async trash() {
        if (this.deleteSmails.length > 0) {
            let alert = await this.alertCtrl.create({
                header: 'Delete mails',
                message: 'Do you want to delete these mails?',
                buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.componentService.showLoader();
                        var array: any = [];
                        // console.log(this.deleteSmails)
                        for (var i = 0; i < this.deleteSmails.length; i++) {
                            if (this.deleteSmails[i].mailId == null) {
                                array.push(this.deleteSmails[i]._id);
                            } else {
                                array.push(this.deleteSmails[i].mailId);
                            }
                        }
                        this.APIService.sendData('deletemails', {'idArray': array, 'userId': this.userId} ).subscribe((data) => {
                            // console.log(data);
                            this.deleteSmails = [];
                            this.componentService.dismissLoader();
                            this.componentService.presentToast('Mails has been deleted successfully.', 'success');

                            this.events.publish('read_mail:changed', '');
                            if (this.preState == 'Inbox') {
                                this.inboxData('ee');
                            } else {
                                this.sentMailsData('ee');
                            }
                            //this.navCtrl.push(SmailPage);
                        },
                            err => {
                                this.componentService.dismissLoader();
                                this.showTechnicalError('1');
                            });
                    }
                }
                ]
            });
            await alert.present();
        }
        else {
            this.componentService.presentToast('Please select atleast one mail.', 'danger');

        }
    };

    allChecked(isChecked) {
        this.deleteSmails = [];
        var i;
        if (isChecked) {
            for (i = 0; i < this.items.length; i++) {
                this.deleteSmails.push(this.items[i]);
                this.items[i].id = true;
            }
        } else {
            for (i = 0; i < this.items.length; i++) {
                this.items[i].id = false;
            }
        }

    };

    getValueOpton(value) {
        // console.log(value);
    };

    root() {
        this.navCtrl.navigateRoot(['dashboard', 0]);
    };

    smailPage() {
        this.navCtrl.navigateRoot(['small-inbox']);
      }
    
      composePage() {
        this.navCtrl.navigateRoot(['compose']);
      }

    acceptInvite(link) {
        if (localStorage.getItem('view') == 'sent' || localStorage.getItem('view') == 'Sent') {
            this.navCtrl.navigateRoot('contacts');
        } else {
            this.componentService.showLoader();
            var id = link.split('/');
            id = id[id.length - 1];
            // console.log(id)
            var sendData = {
                memberId: id,
                memberstatus: '2'
            }

            this.APIService.putData('accptinvitation',sendData).subscribe((dashboard_data:any) => {
                this.componentService.dismissLoader();
                if (dashboard_data.error) {
                    this.componentService.presentToast(dashboard_data.error, 'danger');
                } else {
                    this.componentService.presentToast('Invitation has been accepted successfully.', 'success');
                    this.navCtrl.navigateRoot('contacts');
                }

            },
                err => {
                    this.componentService.dismissLoader();
                    this.showTechnicalError('1');
                });
        }
    };

    rejectContact(link) {
        if (localStorage.getItem('view') == 'sent' || localStorage.getItem('view') == 'Sent') {
            this.navCtrl.navigateRoot('contacts');
        } else {
            this.componentService.showLoader();
            var id = link.split('/');
            id = id[id.length - 1];
            // console.log(id)
            var sendData = {
                memberId: id,
                memberstatus: '0'
            }
            this.APIService.putData('accptinvitation',sendData).subscribe((dashboard_data:any) => {
                this.componentService.dismissLoader();
                if (dashboard_data.error) {
                    this.componentService.presentToast(dashboard_data.error, 'danger');
                } else {
                    this.componentService.presentToast('Invitation has been rejected successfully.', 'success');
                    this.navCtrl.navigateRoot('contacts');
                }
            },
                err => {
                    this.componentService.dismissLoader();
                    this.showTechnicalError('1');
                });
        }
    };


    // this is run whenever the (ionInput) event is fired
    searchFn(searchTerm, jobId, readStatus, tradeId, isJobChanged, selectedType, isVal = false) {
        this.term = searchTerm;
        this.details = '';
        this.thread = false;
        this.items = this.allemails;

        let val = searchTerm;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.items = this.items.filter((item) => {
                return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.subject.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.toArray[0].name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }

        if (readStatus != undefined && readStatus != '') {

            this.items = this.items.filter((item) => {
                if (readStatus == 1) {
                    return (item.read == true);
                } else {
                    return (item.read == false);
                }
            });
        }

        if (jobId != '') {
            this.items = this.items.filter((item) => {
                return (item.jobId == jobId);
            });
        }

        if (selectedType != '') {
            this.items = this.items.filter((item) => {
                return (item.jobType == selectedType);
            });
        }
        // console.log(this.items)
        if (tradeId != '' && isJobChanged == false) {
            this.items = this.items.filter((item) => {
                return (item.tradeId == tradeId);
            });
        }

        if (isJobChanged == true && isVal == false) {
            this.selectedTrade = '';
            this.selected_trade_icon = null;
            this.APIService.getData('trades',jobId).subscribe((data) => {
                // console.log(data)
                this.trades = data;
                if (this.trades != '') {
                    var all_trades: any = [];
                    this.trades.forEach(function (trade) {
                        all_trades[trade._id] = trade;
                    })
                    this.trades = all_trades;
                }
            },
                err => {
                    this.showTechnicalError();
                });
        }


        if (this.items.length > 0) {
            // this.openSmaildetailPage(this.items[0], 0);
        } else {
            this.details = '';
        }

    }

    isParaActive: boolean = false;
    isBtnActive: boolean = false;

    //ToggleClass function functionality
    toggleClass() {
        this.isParaActive = !this.isParaActive;
        this.isBtnActive = !this.isBtnActive;
    };

    smail() {
        this.allowed_levels = [];
        for (var i = 0; i < this.openedLevel.length; i++) {
            this.openedLevel[i].checked = true;
            this.allowed_levels.push('level' + (i + 1));
        }
        this.selectedFolder = '';
        localStorage.setItem('view', "Inbox");
        this.preState = 'Inbox';
        this.inboxData('ee');
    };

    inboxPage() {
        localStorage.setItem('view', 'Inbox');
        this.preState = 'Inbox';
        this.inboxData('ee');
    };

    undo(item, index) {
        this.componentService.showLoader();
        var id;
        if (item.mailId == null) {
            id = item._id;
        } else {
            id = item.mailId;
        }
        this.APIService.sendData('undoemails/' + this.userId, {'emailId': id}).subscribe((data:any) => {
            this.componentService.dismissLoader();
            if (data.status == 1) {
                this.items.splice(index, 1);
                this.componentService.presentToast('Mail has been undo successfully.', 'success');
            } else {
                this.componentService.presentToast('You can\'t undo this mail.Its already been read by recipient.', 'danger');

            }

        },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
    };

    viewTransmittal(bidId) {
        this.navCtrl.navigateForward('bidding-page', {
            state: {
                bidJobId: bidId,
                status: 9,
            }
        });
    }

    async downloadTransmittal(transmittalId) {
        let modal = await this.modalCtrl.create({
            component: 'PdfTransmittalPage',
            componentProps: {
                transmittalId: transmittalId
            }
        });

        await modal.present();
    }

    dragMail(mailId) {
        localStorage.setItem('fnn_counter', '1');
        this.drag_mailId = mailId;
    }

    dragOut() {
        if (localStorage.getItem('fnn_counter') == '1') {
            setTimeout(function () {
                localStorage.setItem('fnn_counter', '0');
                console.log(localStorage.getItem('fnn_counter'))
            }, 200);
        }
    }

    dropSmails(folderId) {
        if (localStorage.getItem('fnn_counter') == '1') {
            localStorage.setItem('fnn_counter', '0');
            this.componentService.showLoader();
            this.APIService.sendData('drag_smail_folder', {id : this.drag_mailId, folderId : folderId}).subscribe((data:any) => {
                this.componentService.dismissLoader();
                if (data.status == 1) {
                    this.componentService.presentToast('Mail has been droped successfully.', 'success');
                } else {
                    this.componentService.presentToast('There is some error.plz try later.', 'danger');
                }
            },
                err => {
                    this.componentService.dismissLoader();
                    this.showTechnicalError('1');
                });
        }
    }

    ChangeShareJobStatus(assocId, status) {
        this.componentService.showLoader();
        var data ={
            'employeeId':assocId,
            'status': status
        }
        this.APIService.sendData('changeStatusEmployee',data).subscribe((updated:any) => {
            if (updated.status == '1') {
                var msg = status == '1' ? 'accepted' : 'rejected';
                this.componentService.presentToast('Invitation has been ' + msg + ' successfully.', 'success');
            }
            else if (updated.status == '2') {
                this.componentService.presentToast('Link Expired, Action has been already performed.', 'info');
            }
            else if (updated.status == '3') {
                this.componentService.presentToast('Error, Invitation has been removed by sender.', 'info');
            }
            else {
                this.componentService.presentToast('Error,Plz try later.', 'danger');
            }
            this.componentService.dismissLoader();
        },
            err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
            });
    }
}