import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, AlertController, MenuController, ToastController, LoadingController } from '@ionic/angular';
import { EventService } from 'src/services/event.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import * as $ from 'jquery';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { polyfill } from 'mobile-drag-drop';
import { ComponentService } from 'src/services/component.service';
import { APIService } from 'src/services/api.service';
import { UploadfilePage } from '../uploadfile/uploadfile.page';
import { SmailfilesPage } from '../smailfiles/smailfiles.page';
import { JobfilePage } from '../jobfile/jobfile.page';
import { AddfolderPage } from '../addfolder/addfolder.page';
@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.page.html',
  styleUrls: ['./file-manager.page.scss'],
})
export class FileManagerPage implements OnInit {
  // @ViewChild('tree') tree;
  @ViewChild('tree') tree: any;
  @ViewChild('scroll') scroll: any;
  @Input('nodes') nodes;
  @Input('treePath') treePath;
  shownGroup: any;
  isLoggedIn: boolean = false;
  pages: any;
  public displayText: any;
  userId: any;
  related_files: any;
  related_files_data: any;
  level_hiddens: any;
  levels_hiddens: any = '';
  file_path: any;
  path_chain: any;
  all_levels: any;
  APIURL: any;
  show_add_folder: any;
  file_types: any;
  shared_files: any;
  enable_level1: any;
  enable_level2: any;
  enable_level3: any;
  enable_level4: any;
  allowed_levels: any;
  breadcrums: any;
  all_contacts: any;
  full_contacts: any;
  rest_shared_files: any;
  non_grouped_shared_files: any;
  new_obj: any;
  l3: any;
  edit_file_name: any;
  unread_users: any = [];
  isFolderRemoved: any = '0';
  custom_level: any = '1';
  isAccept_check: any = '1';
  downloaded_href: any = '#';
  isBrowser = localStorage.getItem('isBrowser');
  baseUrl = localStorage.getItem('baseUrl');
  options: any;
  editIndex: any;
  has_thumbs: any;
  is_video: any;
  hidden_editing: any;
  stateData: any = '';
  navBack: Boolean;
  constructor(
    public menu: MenuController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private file: File,
    private transfers: FileTransfer,
    public componentService: ComponentService,
    public APIService: APIService,
    public events: EventService,
    public router: Router) {

    polyfill({});
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    this.file_types = ['txt', 'docx', 'mp3', 'mp4', 'php', 'ppt', 'pptx', 'psd', 'xls', 'xlsx', 'zip', 'doc', 'odt', 'png', 'jpg', 'jpeg', 'gif', 'pdf', 'csv'];
    this.has_thumbs = ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'wmv', '3gp', 'avi'];
    this.is_video = ['mp4', 'mov', 'wmv', '3gp', 'avi'];
    this.all_levels = ['level1', 'level2', 'level3', 'level4'];
    this.APIURL = localStorage.getItem('APIURL');
    this.userId = localStorage.getItem('userinfo');
    localStorage.setItem('current_file_path', 'nopath');
    this.file_path = localStorage.getItem('current_file_path');
    this.path_chain = localStorage.getItem('path_chain');
    this.related_files_data = localStorage.getItem('related_files_data');
    this.options = {
      allowDrag: (node) => {
        if (this.all_levels.indexOf(node.data.name) == -1) {
          return true;
        }
      },
      allowDrop: (element, { parent, index }) => {
        if (parent.data.path != undefined) {
          return true;
        }
      },
      actionMapping: {
        mouse: {
          drop: (tree, node, $event, { from, to }) => {
            var dragPath = from.data.path;
            var is_panel = from.is_panel;
            var file_type = from.data.type;
            var dropPath = to.parent.data.path;
            if (dragPath != dropPath) {
              this.dragRightFiles(dragPath, dropPath, file_type, from.data, is_panel, from.shared_id);
            }
          }
        }
      },
      animateExpand: true,
      scrollContainer: document.documentElement
    };

    // this.state = {
    //   expandedNodeIds: {}
    // };
    var self = this;
    $(document).click(function (event) {
      self.menu.close();
      self.navBack = false
    })
    events.subscribe('openLevel:changed', data => {
      this.locksClicked(data);
    });
  }

  ionViewWillUnload() {
    this.events.unsubscribe('openLevel:changed');
  }



  showTechnicalError(type: any = null) {
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    this.componentService.presentToast('Technical error, Please ' + msg, 'info');
  }

  ngOnInit() {
    this.getOpenLevels();
    this.fetchTreeView();
    this.fetchRelatedFiles('main');
    this.getAllContacts();
  }


  dropOnFooter(event) {
    console.log('event')
    console.log(event)
  }

  getAllContacts() {
    this.APIService.getData('getContactList', this.userId).subscribe((allContacts: any) => {
      var All_contacts: any = [];
      allContacts.forEach(function (data) {
        if (data.memberstatus == '2' && data.senderSetLevelStatus == '1' && data.recevierSetLevelStatus == '1') {
          All_contacts.push(data.userId);
        }
      });
      this.all_contacts = All_contacts;
      this.full_contacts = allContacts;
      this.stateData = this.router.getCurrentNavigation()?.extras.state;
      if (this.stateData != undefined && this.stateData['notis_redirect'] == '1') {
        this.getSharedFolders();
      }
    },
      err => {
        this.showTechnicalError();
      });
  }

  files() {
    localStorage.setItem('current_file_path', 'nopath');
    this.ngOnInit();
  }

  downloadAndroid(url, name) {
    this.componentService.presentToast('Start downloading....', 'success');
    const fileTransfer: FileTransferObject = this.transfers.create();
    fileTransfer.download(url, this.file.externalRootDirectory + name.split('____').pop()).then((entry) => {
      this.componentService.presentToast('File downloaded.', 'success');
    }, (error) => {
      this.componentService.presentToast('Error', 'danger');
    });
  }

  locksClicked(event) {
    this.getOpenLevels();
    this.hideTreeLevels();
    var current_fp = localStorage.getItem('current_file_path');
    if (event != '5') {
      var level;
      var check = 0;
      for (level = +event + 1; level <= 4; level++) {
        if (current_fp != null && current_fp.search("level" + level) >= 0) {
          check = check + 1;
        }
      }
      if (check > 0) {
        this.fetchRelatedFiles('main');
        this.breadcrums = [];
        localStorage.setItem('current_file_path', 'nopath');
      }
    }

    // if(current_fp == 'nopath')
    // {
    if (this.related_files_data == 'shared_data') {
      var type;
      if (localStorage.getItem('shared_user_clicked') == '1') {
        type = localStorage.getItem('folder_type');
        var username = localStorage.getItem('clicked_user_name');
        var userId = localStorage.getItem('clicked_user_id');
        var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
        this.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
      }
      else if (localStorage.getItem('shared_user_clicked') == '2') {
        type = localStorage.getItem('folder_type');
        var shared_folder_path = localStorage.getItem('current_file_path');
        var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
        this.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
      }
      else if (localStorage.getItem('shared_user_clicked') == '3') {
        this.fetchRelatedFiles();
      }
      else {
        this.getSharedFolders();
      }
    }
    else {
      this.fetchRelatedFiles('main');
    }
    // }
  }

  getOpenLevels() {
    this.allowed_levels = [];
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
      this.allowed_levels.push('level1');
    }
    if (this.enable_level2 == 'false') {
      this.allowed_levels.push('level2');
    }
    if (this.enable_level3 == 'false') {
      this.allowed_levels.push('level3');
    }
    if (this.enable_level4 == 'false') {
      this.allowed_levels.push('level4');
    }
  }

  getBreadCrums() {
    this.file_path = localStorage.getItem('current_file_path');
    var breadcrums: any = [];
    if (this.file_path == 'nopath') {
      if (this.path_chain != '' && this.path_chain != undefined) {
        if (this.path_chain.search('shared') >= 0) {
          this.path_chain.split('/').forEach(function (bread) {
            breadcrums.push(bread);
          });
          this.breadcrums = breadcrums;
        }
        else {
          this.breadcrums = [];
        }
      }
      else {
        this.breadcrums = [];
      }
    }
    else if (this.path_chain != '' && this.path_chain != undefined) {
      this.path_chain.split('/').forEach(function (bread) {
        breadcrums.push(bread);
      });
      this.breadcrums = breadcrums;
    }
  }

  doubleClick(file_type, file_path, file_size, file_name) {
    if (file_type == 'file') {
      var download_ext = ['csv', 'zip', 'xlsx', 'xls', 'doc', 'docx'];
      if (download_ext.indexOf(file_name.split('.').pop().toLowerCase()) >= 0) {
        var file_id;
        if (this.isBrowser == 'true') {
          file_id = 'bro_' + file_name;
        }
        else {
          file_id = 'and_' + file_name;
        }
        var d: any = document.getElementById(file_id);
        d.click();
      }
      else {
        this.viewFile(file_path, file_size);
      }
    }
  }

  fetchTreeView() {
    this.APIService.getData('getDirectory', this.userId + '/files').subscribe((all_files: any) => {
      if (all_files.data != null) {
        this.pages = all_files.data.children;
      }
      else {
        this.pages = [];
      }
      this.hideTreeLevels();
    },
      err => {
        this.showTechnicalError();
      });
  }

  fetchRelatedFiles(param: any = null, tree: any = null, isremoved: any = null) {
    // console.log('working...')

    if (this.allowed_levels == '') {
      localStorage.setItem('current_file_path', 'nopath');
    }
    if (isremoved != '1') {
      this.isFolderRemoved = '0';
    }
    if (this.stateData != undefined && this.stateData['notis_redirect'] != '1') {
      this.componentService.showLoader();
    }
    this.file_path = localStorage.getItem('current_file_path');
    this.path_chain = localStorage.getItem('current_file_path');

    // set shared active
    if (this.file_path.search('level') >= 0) {
      this.related_files_data = 'level_data';
      this.show_add_folder = '4';
      this.isAccept_check = '1';
    }
    else {
      this.related_files_data = 'shared_data';
      this.shownGroup = null;
    }
    if (this.file_path == 'nopath') {
      this.related_files_data = '';
    }

    localStorage.setItem('related_files_data', this.related_files_data);
    if (localStorage.getItem('folder_type') == '1') {
      this.path_chain = 'shared/' + localStorage.getItem('clicked_user_name') + '/' + this.path_chain.split('shared/')[1];
    }
    else {
      this.path_chain = 'shared/' + this.path_chain.split('shared/')[1];
    }
    if (this.path_chain.split('shared/')[1].split('/').pop(-1) == 'undefined') {
      this.path_chain = localStorage.getItem('current_file_path');
      this.path_chain = this.path_chain.split('files/')[1];
    }
    this.getBreadCrums();
    if (param == 'main') {
      this.file_path = 'directory/' + this.userId + '/files';
    }
    var data = {
      'file_path': this.file_path
    }
    this.APIService.sendData('getDirectoryFiles', data).subscribe((related_files: any) => {
      localStorage.setItem('shared_user_clicked', '3');
      if (related_files.data != null) {
        if (this.stateData != undefined && this.stateData['notis_redirect'] != '1') {
          this.componentService.dismissLoader();
        }
        if (param == 'main') {
          this.file_path = 'nopath';
          this.related_files = related_files.data.children;
          var myArray = this.related_files;
          for (var i = myArray.length - 1; i >= 0; --i) {
            if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
              myArray.splice(i, 1);
            }
          }
          this.related_files = myArray;
        }
        else {
          this.related_files = related_files.data.children;
          if (this.related_files_data == 'shared_data') {
            if (localStorage.getItem('shared_user_clicked') == '2' || localStorage.getItem('shared_user_clicked') == '3') {
              var level1_hiddens = 0;
              var level2_hiddens = 0;
              var level3_hiddens = 0;
              var level4_hiddens = 0;
              var levels_hiddens: any = {
                level1_hiddens: 0,
                level2_hiddens: 0,
                level3_hiddens: 0,
                level4_hiddens: 0
              };
              var related_files = this.related_files;
              var related_files_sorted: any = [];
              var self = this;
              var allowed_levels = this.allowed_levels;
              var login_id = this.userId;
              related_files.forEach(function (data) {
                var send_user = data.name.split('_--_')[0];
                var which_level = '';
                if (self.all_contacts.indexOf(send_user) >= 0) {
                  self.full_contacts.forEach(function (data) {
                    if (data.userId == send_user) {
                      if (login_id == data.senderId) {
                        which_level = 'level' + data.senderSetLevel;
                      }
                      else {
                        which_level = 'level' + data.reciverSetLevel;
                      }
                    }
                  });

                }
                else {
                  which_level = "level" + localStorage.getItem('folder_root_level');

                }
                if (allowed_levels.indexOf(which_level) >= 0) {
                  related_files_sorted.push(data);
                }
                else {
                  if (which_level == 'level1') {
                    level1_hiddens = level1_hiddens + 1;
                  }
                  else if (which_level == 'level2') {
                    level2_hiddens = level2_hiddens + 1;
                  }
                  else if (which_level == 'level3') {
                    level3_hiddens = level3_hiddens + 1;
                  }
                  else if (which_level == 'level4') {
                    level4_hiddens = level4_hiddens + 1;
                  }
                  levels_hiddens = {
                    level1_hiddens: level1_hiddens,
                    level2_hiddens: level2_hiddens,
                    level3_hiddens: level3_hiddens,
                    level4_hiddens: level4_hiddens
                  };
                }
              });
            }
            this.related_files = related_files_sorted;
            this.levels_hiddens = levels_hiddens;
          }
        }

      }
      else {
        if (this.stateData != undefined && this.stateData['notis_redirect'] != '1') {
          this.componentService.dismissLoader();
        }
        if (param == 'main') {
          this.file_path = 'nopath';
        }
        this.related_files = [];
      }
      if (this.file_path != 'nopath' && tree != 'tree') {
        var file_name = this.file_path.split('/').pop(-1);
        var file_path = this.file_path;
        var nodeObj = {
          name: file_name,
          path: file_path
        }
        this.treePath = nodeObj;
      }

    },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
      });
    var levels_hiddens = {
      level1_hiddens: 0,
      level2_hiddens: 0,
      level3_hiddens: 0,
      level4_hiddens: 0
    };
    this.levels_hiddens = levels_hiddens;
  }

  readThis(status, fid = null) {
    if (status >= 0) {
      if (fid != null) {
        var data = {
          'fileId': fid,
          'userId': this.userId
        }
        this.APIService.sendData('setReadFile', data).subscribe((result) => {
          $('#fid' + fid).hide();
        },
          err => {
            this.showTechnicalError();
          });
      }
    }
  }

  openIt(filePath, fileType, fid = null, related_file, toLevel = null) {
    console.log(fileType, "fileType")
    if (toLevel != null) {
      this.custom_level = toLevel;
    }
    if (fileType == 'directory') {
      this.file_path = localStorage.setItem('current_file_path', filePath);
      this.ExpandFocusTree();
      if (fid != null) {
        var data = {
          'fileId': fid,
          'userId': this.userId
        }
        this.APIService.sendData('setReadFile', data).subscribe((result) => {
          this.fetchRelatedFiles();
        },
          err => {
            this.showTechnicalError('1');
          });
      }
      else {
        this.fetchRelatedFiles();
      }
    }
    else {
      if (fid != null) {
        var data = {
          'fileId': fid,
          'userId': this.userId
        }
        this.APIService.sendData('setReadFile', data).subscribe((result) => {
          $('#fid' + fid).hide();
        },
          err => {
            this.showTechnicalError('1');
          });
      }
    }
  }

  async exitGroup(folder_id) {
    let confirm = this.alertCtrl.create({
      header: 'Are you sure?',
      message: "After exit, you can't access any of the file of this folder.",
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
            var data = {
              'folderId': folder_id,
              'userId': this.userId
            }
            this.APIService.sendData('exitFolderGroup', data).subscribe((result: any) => {
              if (result.status == 1) {
                this.componentService.dismissLoader();
                this.componentService.presentToast('You have been exited from this folder.', 'success');
                this.getSharedFolders();
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
    (await confirm).present();
  }

  async removeMembers(folder_id, userId) {
    let confirm = this.alertCtrl.create({
      header: 'Are you sure?',
      message: "",
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
            var data = {
              'folderId': folder_id,
              'userId': userId
            }
            this.APIService.sendData('exitFolderGroup', data).subscribe((result: any) => {
              if (result.status == 1) {
                this.componentService.dismissLoader();
                this.componentService.presentToast('User has been removed successfully.', 'success');
                this.getSharedFolders();
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
    (await confirm).present();
  }

  async deleteFile(filePath, type, fid = null, isShared: any = null, isRoot = null) {
    if (this.show_add_folder == '2') {
      isShared = '1';
    }
    if (type == 'directory') {
      let confirm = this.alertCtrl.create({
        header: 'Are you sure?',
        message: 'it will delete the folder (' + filePath.split("/").pop(-1).split('_--_').pop(-1) + ') and its related files.',
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
              var data = {
                file_path: filePath,
                fid: fid,
                isShared: isShared,
                userId: this.userId,
                toId: localStorage.getItem('clicked_user_id'),
                toLevel: localStorage.getItem('clicked_whichLevel'),
                from_user: localStorage.getItem('userName'),
                show_add_folder: this.show_add_folder,
                clicked_fid: localStorage.getItem('clicked_fid'),
                isRoot: isRoot
              }
              this.APIService.sendData('deleteDirectoryFolders', data).subscribe((deleted: any) => {
                if (deleted.status == 1) {
                  this.componentService.presentToast('Folder deleted.', 'success');
                  if (isShared == '1') {
                    var type;
                    if (localStorage.getItem('shared_user_clicked') == '1') {
                      type = localStorage.getItem('folder_type');
                      var username = localStorage.getItem('clicked_user_name');
                      var userId = localStorage.getItem('clicked_user_id');
                      var clicked_whichLevel: any = localStorage.getItem('clicked_whichLevel');
                      this.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
                    }
                    else if (localStorage.getItem('shared_user_clicked') == '2') {
                      type = localStorage.getItem('folder_type');
                      var shared_folder_path = localStorage.getItem('current_file_path');
                      var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
                      this.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
                    }
                    else if (localStorage.getItem('shared_user_clicked') == '3') {
                      this.fetchRelatedFiles();
                    }
                    else {
                      this.getSharedFolders();
                    }
                  }
                  else {
                    var nodeToRemove = this.tree.treeModel.getNodeBy(node => node.data.path === filePath);
                    nodeToRemove.hide();
                    this.fetchRelatedFiles();
                  }

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
      (await confirm).present();
    }
    else {
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
              var data = {
                file_path: filePath,
                fid: fid,
                isShared: isShared,
                userId: this.userId,
                toId: localStorage.getItem('clicked_user_id'),
                toLevel: localStorage.getItem('clicked_whichLevel'),
                from_user: localStorage.getItem('userName'),
                show_add_folder: this.show_add_folder,
                clicked_fid: localStorage.getItem('clicked_fid'),
                isRoot: isRoot
              }
              this.componentService.showLoader();
              this.APIService.sendData('deleteDirectoryFolders', data).subscribe((deleted: any) => {
                if (deleted.status == 1) {
                  this.componentService.presentToast('File deleted.', 'success');
                  if (isShared == '1') {
                    var type;
                    if (localStorage.getItem('shared_user_clicked') == '1') {
                      type = localStorage.getItem('folder_type');
                      var username = localStorage.getItem('clicked_user_name');
                      var userId = localStorage.getItem('clicked_user_id');
                      var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
                      this.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
                    }
                    else if (localStorage.getItem('shared_user_clicked') == '2') {
                      type = localStorage.getItem('folder_type');
                      var shared_folder_path = localStorage.getItem('current_file_path');
                      var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
                      this.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
                    }
                    else if (localStorage.getItem('shared_user_clicked') == '3') {
                      this.fetchRelatedFiles();
                    }
                    else {
                      this.getSharedFolders();
                    }
                  }
                  else {
                    this.fetchRelatedFiles();
                  }
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
      (await confirm).present();
    }

  }

  viewFile(filePath, fileSize) {
    // let modal = this.modalCtrl.create('ViewfilePage', {file_path : filePath, fileSize:fileSize});
    // modal.present();
  }

  downloadFile() {
    this.componentService.presentToast('Start downloading...', 'success');
  }

  downloadFilePhone(url) {

    this.componentService.showLoader();

    const fileTransfer: FileTransferObject = this.transfers.create();

    const name = url.split('/');
    fileTransfer.download(url, this.file.dataDirectory + name[name.length - 1]).then((entry) => {
      this.componentService.dismissLoader();
      this.componentService.presentToast('Downloading has been success.', 'success');

    }, (error) => {
      // handle error
      this.componentService.presentToast('Try after sometime.', 'danger');

    });
  }

  async addFolders(isShared) {
    this.file_path = localStorage.getItem('current_file_path');
    if (this.file_path == 'nopath') {
      if (this.related_files_data != 'shared_data' && this.show_add_folder != '1') {
        this.componentService.presentToast('Please select parent folder to add new.', 'info');
        return false;
      }
    }
    let modal = await this.modalCtrl.create({
      component: AddfolderPage,
      componentProps: {
        isShared: isShared,
        show_add_folder: this.show_add_folder
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if (data == '1') {
        this.componentService.presentToast('Folder added.', 'success');
        if (isShared == '1') {
          var type;
          if (localStorage.getItem('shared_user_clicked') == '1') {
            type = localStorage.getItem('folder_type');
            var username = localStorage.getItem('clicked_user_name');
            var userId = localStorage.getItem('clicked_user_id');
            var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
            this.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
          }
          else if (localStorage.getItem('shared_user_clicked') == '2') {
            type = localStorage.getItem('folder_type');
            var shared_folder_path = localStorage.getItem('current_file_path');
            var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
            this.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
          }
          else if (localStorage.getItem('shared_user_clicked') == '3') {
            this.fetchRelatedFiles();
          }
          else {
            this.getSharedFolders();
          }
        }
        else {
          var new_folder = this.userId + '_--_' + localStorage.getItem('new_dir_folder');
          var new_folder_path = localStorage.getItem('current_file_path') + '/' + new_folder;
          let newNode = { 'name': new_folder, 'path': new_folder_path, 'type': 'directory', 'children': [] }
          var nodeToAddUnder = this.tree.treeModel.getNodeBy(node => node.data.path === localStorage.getItem('current_file_path'));
          if (nodeToAddUnder.data.children) {
            nodeToAddUnder.data.children.push(newNode);
          } else {
            nodeToAddUnder.data.children = [];
            nodeToAddUnder.data.children.push(newNode);
          }
          this.tree.treeModel.update();
          this.fetchRelatedFiles(null, 'tree');
        }
      }
    });
    await modal.present();

  }

  async shareFolders(folder_param = null) {
    this.file_path = localStorage.getItem('current_file_path');
    if (folder_param != null) {
      this.file_path = folder_param;
    }
    var folder_name = this.file_path.split("/").pop(-1);

    if (this.file_path == 'nopath' || this.all_levels.indexOf(folder_name) >= 0) {
      this.componentService.presentToast('Please select folder to share.', 'info')

    }
    else {
      var userId = localStorage.getItem('userinfo');
      var current_file_path = localStorage.getItem('current_file_path');
      if (folder_param != null) {
        current_file_path = folder_param;
      }
      let modal = await this.modalCtrl.create({
        component: 'ContactslistPage',
        componentProps: {
          share_page: '1',
          share_page_type: '1'
        }
      });

      modal.onDidDismiss().then(((data: any) => {
        if (data != undefined && data != null) {
          if (data.length > 0) {
            var returnedArr: any = [];
            var isAccept: any = '';
            if (data.length == '1') {
              var fromLevel: any = '';
              var toLevel: any = '';
              var contactLevel = localStorage.getItem('s_contactLevel');
              if (contactLevel == '5') {
                if (data[0].senderId != userId) {
                  fromLevel = data[0].reciverSetLevel;
                  toLevel = data[0].senderSetLevel;
                }
                else {
                  fromLevel = data[0].senderSetLevel;
                  toLevel = data[0].reciverSetLevel;
                }
              }
              else {
                fromLevel = contactLevel;
                if (data[0].senderId != userId) {
                  toLevel = data[0].senderSetLevel;
                }
                else {
                  toLevel = data[0].reciverSetLevel;
                }
              }

              isAccept = localStorage.getItem('s_isAccept');
              this.new_obj = {
                fromId: userId,
                toId: data[0].userId,
                memberId: data[0].member_id,
                to_folder: 'directory/' + userId + '/shared/' + folder_name,
                folder_path: current_file_path,
                fromLevel: fromLevel,
                toLevel: toLevel,
                isEditable: '1',
                isGroup: '0',
                availableUpto: '',
                isAccept: isAccept,
                from_user: localStorage.getItem('userName'),
                baseUrl: this.baseUrl
              }
              returnedArr.push(this.new_obj);
            }
            else {
              var userIds: any = [];
              data.forEach(function (contact) {
                userIds.push(contact.userId);
              });
              var main_folder_name = localStorage.getItem('s_folder_name');
              var availableUpto = localStorage.getItem('s_availableUpto');
              var yourLevel = localStorage.getItem('s_yourLevel');
              this.new_obj = {
                fromId: userId,
                toId: userIds,
                to_folder: 'directory/' + userId + '/shared/' + main_folder_name + '/' + folder_name,
                folder_path: current_file_path,
                fromLevel: yourLevel,
                toLevel: yourLevel,
                isEditable: '1',
                isGroup: '1',
                isAccept: '1',
                availableUpto: availableUpto,
                from_user: localStorage.getItem('userName'),
                baseUrl: this.baseUrl
              }
              returnedArr.push(this.new_obj);
            }

            this.componentService.showLoader();
            this.APIService.sendData('addShareFolders', returnedArr).subscribe((result: any) => {
              this.componentService.dismissLoader();
              if (result.status == '1') {
                this.componentService.presentToast('Shared successfully.', 'success');
                this.getSharedFolders();
              }
            },
              err => {
                this.componentService.dismissLoader();
                this.showTechnicalError('1');
              });
          }
        }
      }));
      modal.present();
    }

  }

  async removeFolders() {
    this.file_path = localStorage.getItem('current_file_path');
    if (this.file_path == 'nopath' || this.isFolderRemoved == '1') {
      this.componentService.presentToast('Please select folder to delete.', 'info')

      return false;
    }
    var folder_path = this.file_path.split('files/')[1];

    if (this.all_levels.indexOf(folder_path) >= 0 || folder_path == undefined) {
      this.componentService.presentToast('Please select folder to delete.', 'info')

    }
    else {
      let confirm = this.alertCtrl.create({
        header: 'Are you sure?',
        message: 'it will delete the folder (' + folder_path.split('_--_').pop(-1) + ') and its related files.',
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
              var data = {
                'file_path': this.file_path
              }
              this.APIService.sendData('deleteDirectoryFolders', data).subscribe((deleted: any) => {
                if (deleted.status == 1) {
                  this.isFolderRemoved = '1';
                  var nodeToRemove = this.tree.treeModel.getNodeBy(node => node.data.path === this.file_path);
                  nodeToRemove.hide();
                  var new_path = this.file_path.lastIndexOf('/');
                  localStorage.setItem('current_file_path', this.file_path.substring(0, new_path));
                  // this.fetchTreeView(); 
                  var nodeToActive = this.tree.treeModel.getNodeBy(node => node.data.path === localStorage.getItem('current_file_path'));
                  nodeToActive.setActiveAndVisible();
                  this.fetchRelatedFiles(null, 'tree', '1');
                  this.componentService.presentToast('Folder deleted.', 'success');
                }
                else {
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
      (await confirm).present();
    }
  }

  downloadFolders(folder_path) {
    this.componentService.showLoader();
    this.APIService.sendData('downloadFolders', { 'folder_path': folder_path }).subscribe((downloaded: any) => {
      if (downloaded.status == 1) {
        this.componentService.dismissLoader();
        this.downloaded_href = this.APIURL + '/salvum/' + downloaded.data.path;
        this.componentService.presentToast('Start downloading...', 'success');
        setTimeout(function () {
          var d: any = document.getElementById('download_zip_file');
          d.click();
        }, 1000);
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

  async addFiles(isShared) {
    this.file_path = localStorage.getItem('current_file_path');
    let modal = await this.modalCtrl.create({
      component: UploadfilePage,
      componentProps: {
        isShared: isShared,
        show_add_folder: this.show_add_folder
      }
    });

    modal.onDidDismiss().then((data => {
      if (isShared == '1') {
        var type;
        if (localStorage.getItem('shared_user_clicked') == '1') {
          type = localStorage.getItem('folder_type');
          var username = localStorage.getItem('clicked_user_name');
          var userId = localStorage.getItem('clicked_user_id');
          var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
          this.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
        }
        else if (localStorage.getItem('shared_user_clicked') == '2') {
          type = localStorage.getItem('folder_type');
          var shared_folder_path = localStorage.getItem('current_file_path');
          var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
          this.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
        }
        else if (localStorage.getItem('shared_user_clicked') == '3') {
          this.fetchRelatedFiles();
        }
        else {
          this.getSharedFolders();
        }
      }
      else {
        this.fetchRelatedFiles();
      }
    }));
    modal.present();
  }

  async addFilesSmail(isShared) {
    this.file_path = localStorage.getItem('current_file_path');
    let modal = await this.modalCtrl.create({
      component: SmailfilesPage,
      componentProps: {
        isShared: isShared,
        file_type: '4'
      }
    });

    modal.onDidDismiss().then(((rdata: any) => {
      var data  = rdata.data
      if (data != '' && data != undefined && data != null) {
        var onLevel: any = '1';
        var toLevel = localStorage.getItem('clicked_whichLevel');
        if (isShared == '1' && this.file_path == 'nopath') {
          onLevel = localStorage.getItem('file_upload_level');
          toLevel = onLevel;
        }

        this.componentService.showLoader();
        var self = this;
        var counter = 0;
        data.forEach(function (single) {
          var obj = {
            isShared: isShared,
            current_file_path: single.path,
            file_name: single.name,
            folder_path: self.file_path,
            userId: self.userId,
            show_add_folder: self.show_add_folder,
            onLevel: onLevel,
            toId: localStorage.getItem('clicked_user_id'),
            toLevel: toLevel,
            from_user: localStorage.getItem('userName'),
            clicked_fid: localStorage.getItem('clicked_fid')
          }
          self.APIService.sendData('dirFileUploadSmail/' + self.userId, obj).subscribe((result) => {
            counter = counter + 1;
            if (data.length == counter) {
              self.componentService.dismissLoader();
              self.componentService.presentToast('Files added successfully.', 'success');
              if (isShared == '1') {
                var type;
                if (localStorage.getItem('shared_user_clicked') == '1') {
                  type = localStorage.getItem('folder_type');
                  var username = localStorage.getItem('clicked_user_name');
                  var userId = localStorage.getItem('clicked_user_id');
                  var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
                  self.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
                }
                else if (localStorage.getItem('shared_user_clicked') == '2') {
                  type = localStorage.getItem('folder_type');
                  var shared_folder_path = localStorage.getItem('current_file_path');
                  var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
                  self.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
                }
                else if (localStorage.getItem('shared_user_clicked') == '3') {
                  self.fetchRelatedFiles();
                }
                else {
                  self.getSharedFolders();
                }
              }
              else {
                self.fetchRelatedFiles();
              }
            }
          },
            err => {
              self.componentService.dismissLoader();
              self.showTechnicalError('1');
            });
        });
      }

    }));
    modal.present();
  }

  async addFilesJobs(isShared) {
    this.file_path = localStorage.getItem('current_file_path');
    let modal = await this.modalCtrl.create({
      component: JobfilePage,
      componentProps: {
        isShared: isShared,
        jobId: '0'
      }
    });
    modal.onDidDismiss().then(((rdata: any) => {
      var data = rdata.data;
      console.log(data, "sd")
      if (data != '' && data != undefined && data != null) {
        var onLevel: any = '1';
        var toLevel = localStorage.getItem('clicked_whichLevel');
        if (isShared == '1' && this.file_path == 'nopath') {
          onLevel = localStorage.getItem('file_upload_level');
          toLevel = onLevel;
        }

        this.componentService.showLoader();
        var self = this;
        var counter = 0;
        var file_item, file_name;;
        data.forEach(function (single) {
          if (single.path == undefined) {
            file_item = 'directory/jobs_data/' + single.file_name;
            file_name = single.file_name;
          }
          else {
            file_item = single.path;
            file_name = single.name;
          }
          var obj = {
            isShared: isShared,
            current_file_path: file_item,
            file_name: file_name,
            folder_path: self.file_path,
            userId: self.userId,
            show_add_folder: self.show_add_folder,
            onLevel: onLevel,
            toId: localStorage.getItem('clicked_user_id'),
            toLevel: toLevel,
            from_user: localStorage.getItem('userName'),
            clicked_fid: localStorage.getItem('clicked_fid')
          }
          self.APIService.sendData('dirFileUploadSmail/' + self.userId, obj).subscribe((result) => {
            counter = counter + 1;
            if (data.length == counter) {
              self.componentService.dismissLoader();
              self.componentService.presentToast('Files added successfully.', 'success');
              if (isShared == '1') {
                var type;
                if (localStorage.getItem('shared_user_clicked') == '1') {
                  type = localStorage.getItem('folder_type');
                  var username = localStorage.getItem('clicked_user_name');
                  var userId = localStorage.getItem('clicked_user_id');
                  var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
                  self.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
                }
                else if (localStorage.getItem('shared_user_clicked') == '2') {
                  type = localStorage.getItem('folder_type');
                  var shared_folder_path = localStorage.getItem('current_file_path');
                  var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
                  self.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
                }
                else if (localStorage.getItem('shared_user_clicked') == '3') {
                  self.fetchRelatedFiles();
                }
                else {
                  self.getSharedFolders();
                }
              }
              else {
                self.fetchRelatedFiles();
              }
            }
          },
            err => {
              self.componentService.dismissLoader();
              self.showTechnicalError('1');
            });
        });
      }

    }));
    (await modal).present();
  }

  async uploadFileManager(isShared) {
    let modal = this.modalCtrl.create({
      component: 'FilemanagerfilesPage',
      componentProps: {
        reply_rfi: '1',
        isShared: isShared
      }
    });
    (await modal).onDidDismiss().then((data: any) => {
      if (data != undefined && data != '' && data != null) {
        var onLevel: any = '1';
        var toLevel = localStorage.getItem('clicked_whichLevel');
        if (isShared == '1' && this.file_path == 'nopath') {
          onLevel = localStorage.getItem('file_upload_level');
          toLevel = onLevel;
        }
        this.componentService.showLoader();
        var self = this;
        var counter = 0;
        data.forEach(function (single) {
          var obj = {
            isShared: isShared,
            current_file_path: single.path,
            file_name: single.name,
            folder_path: self.file_path,
            userId: self.userId,
            show_add_folder: self.show_add_folder,
            onLevel: onLevel,
            toId: localStorage.getItem('clicked_user_id'),
            toLevel: toLevel,
            from_user: localStorage.getItem('userName'),
            clicked_fid: localStorage.getItem('clicked_fid')
          }
          self.APIService.sendData('dirFileUploadSmail/' + self.userId, obj).subscribe((result) => {
            counter = counter + 1;
            if (data.length == counter) {
              self.componentService.dismissLoader();
              self.componentService.presentToast('Files added successfully.', 'success');
              if (isShared == '1') {
                var type;
                if (localStorage.getItem('shared_user_clicked') == '1') {
                  type = localStorage.getItem('folder_type');
                  var username = localStorage.getItem('clicked_user_name');
                  var userId = localStorage.getItem('clicked_user_id');
                  var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
                  self.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
                }
                else if (localStorage.getItem('shared_user_clicked') == '2') {
                  type = localStorage.getItem('folder_type');
                  var shared_folder_path = localStorage.getItem('current_file_path');
                  var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
                  self.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
                }
                else if (localStorage.getItem('shared_user_clicked') == '3') {
                  self.fetchRelatedFiles();
                }
                else {
                  self.getSharedFolders();
                }
              }
              else {
                self.fetchRelatedFiles();
              }
            }
          },
            err => {
              self.componentService.dismissLoader();
              self.showTechnicalError('1');
            });
        });
      }
    });
    (await modal).present();
  }

  getSharedFolders() {
    localStorage.setItem('path_chain', 'shared');
    localStorage.setItem('current_file_path', 'nopath');
    localStorage.setItem('shared_user_clicked', '0');
    localStorage.setItem('showTree', JSON.stringify([]));
    this.show_add_folder = '0';
    this.isAccept_check = '1';
    this.path_chain = 'shared';
    this.getBreadCrums();
    // this.fetchTreeView();
    this.componentService.showLoader();
    var allowed_levels = this.allowed_levels;
    var all_contacts = this.all_contacts;
    var self = this;
    this.APIService.getData('getSharedData', this.userId).subscribe((shared_files) => {
      this.componentService.dismissLoader();
      this.shared_files = shared_files;
      this.related_files = 'shared_data';
      this.related_files_data = 'shared_data';
      localStorage.setItem('related_files_data', this.related_files_data);
      this.shownGroup = null;
      var rest_shared: any = [];
      var unread_users: any = [];
      var rest_shared_extra: any = [];
      var non_grouped_shared: any = [];
      var non_grouped_shared_check: any = [];
      var shown_level, shown_level_number, read, which_level = '';
      var unread_count = 0;
      var level1_hiddens = 0;
      var level2_hiddens = 0;
      var level3_hiddens = 0;
      var level4_hiddens = 0;
      var level_hiddens = {
        level1_hiddens: 0,
        level2_hiddens: 0,
        level3_hiddens: 0,
        level4_hiddens: 0
      };
      this.shared_files.forEach(function (data) {
        var login_id = localStorage.getItem('userinfo');
        if (data.isGroup == '0' && data.isAccept == '1' && data.isRead.indexOf(login_id) >= 0) {
          unread_users.push(data.userId);
        }
        if (data.isGroup == '0' && data.isRoot == '1') {
          if (login_id == data.fromId) {
            shown_level = 'level' + data.fromLevel;
            which_level = data.fromLevel;
            shown_level_number = data.toLevel;
          }
          else {
            shown_level = 'level' + data.toLevel;
            which_level = data.toLevel;
            shown_level_number = data.fromLevel;
          }
          if (data.userId instanceof Array) {
            data.userId = data.userId[0];
          }


          var f: any = data.shared_user_name + '##' + data.userId
          if (rest_shared_extra.indexOf(f) === -1) {
            if (data.isAccept == '2' && data.fromId != localStorage.getItem('userinfo')) {
              // do nothing
            }
            else {
              // console.log(data.isRead)
              if (data.isRead.indexOf(login_id) >= 0) {
                read = data.isRead;
                unread_count = unread_count + 1;
              }
              if (allowed_levels.indexOf(shown_level) >= 0) {
                rest_shared.push(data.shared_user_name + '##' + data.userId + '##' + data.isAccept + '##' + data.fromId + '##' + read + '##' + shown_level_number + '##' + data.shared_user_image + '##' + unread_count + '##' + which_level);
                rest_shared_extra.push(data.shared_user_name + '##' + data.userId);
              }
              else {
                // if(data.fromId != login_id)
                // {
                if (which_level == '1') {
                  level1_hiddens = level1_hiddens + 1;
                }
                else if (which_level == '2') {
                  level2_hiddens = level2_hiddens + 1;
                }
                else if (which_level == '3') {
                  level3_hiddens = level3_hiddens + 1;
                }
                else if (which_level == '4') {
                  level4_hiddens = level4_hiddens + 1;
                }
                level_hiddens = {
                  level1_hiddens: level1_hiddens,
                  level2_hiddens: level2_hiddens,
                  level3_hiddens: level3_hiddens,
                  level4_hiddens: level4_hiddens
                };
                rest_shared_extra.push(data.shared_user_name + '##' + data.userId);
                // }
              }
            }
          }



        }
        else if (data.isGroup == '1') {
          var is_check;
          var all_ids;
          if (login_id == data.fromId) {
            shown_level = 'level' + data.fromLevel;
            if (allowed_levels.indexOf(shown_level) >= 0) {
              is_check = true;
              if (data.toId != '') {
                all_ids = data.toId
                self.removeArray(all_ids, self.userId);
                all_ids.forEach(function (one_id) {
                  if (all_contacts.indexOf(one_id) === -1) {
                    is_check = false;
                  }
                });
              }
              data['is_check'] = is_check;
              if (non_grouped_shared_check.indexOf(data.folder_path.split('/').reverse()[1]) == -1) {
                non_grouped_shared.push(data);
                non_grouped_shared_check.push(data.folder_path.split('/').reverse()[1]);
              }
            }
            else {
              if (data.fromLevel == '1') {
                level1_hiddens = level1_hiddens + 1;
              }
              else if (data.fromLevel == '2') {
                level2_hiddens = level2_hiddens + 1;
              }
              else if (data.fromLevel == '3') {
                level3_hiddens = level3_hiddens + 1;
              }
              else if (data.fromLevel == '4') {
                level4_hiddens = level4_hiddens + 1;
              }
              level_hiddens = {
                level1_hiddens: level1_hiddens,
                level2_hiddens: level2_hiddens,
                level3_hiddens: level3_hiddens,
                level4_hiddens: level4_hiddens
              };
            }
          }
          else {
            shown_level = 'level' + data.toLevel;
            if (allowed_levels.indexOf(shown_level) >= 0) {
              is_check = true;
              if (data.toId != '') {
                all_ids = data.toId;
                self.removeArray(all_ids, self.userId);
                all_ids.forEach(function (one_id) {
                  if (all_contacts.indexOf(one_id) === -1) {
                    is_check = false;
                  }
                });
              }
              data['is_check'] = is_check;
              if (non_grouped_shared_check.indexOf(data.folder_path.split('/').reverse()[1]) == -1) {
                if (data.isAccept != '3') {
                  non_grouped_shared.push(data);
                  non_grouped_shared_check.push(data.folder_path.split('/').reverse()[1]);
                }
                else {
                  non_grouped_shared_check.push(data.folder_path.split('/').reverse()[1]);
                }
              }
            }
            else {
              if (data.toLevel == '1') {
                level1_hiddens = level1_hiddens + 1;
              }
              else if (data.toLevel == '2') {
                level2_hiddens = level2_hiddens + 1;
              }
              else if (data.toLevel == '3') {
                level3_hiddens = level3_hiddens + 1;
              }
              else if (data.toLevel == '4') {
                level4_hiddens = level4_hiddens + 1;
              }
              level_hiddens = {
                level1_hiddens: level1_hiddens,
                level2_hiddens: level2_hiddens,
                level3_hiddens: level3_hiddens,
                level4_hiddens: level4_hiddens
              };
            }
          }
        }
      });
      var counts = {};
      unread_users.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
      this.unread_users = counts;
      this.rest_shared_files = rest_shared;
      console.log(non_grouped_shared)
      this.non_grouped_shared_files = non_grouped_shared;
      this.level_hiddens = level_hiddens;
    },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
      });
  }

  clickSharedFolders(shared_folder_path, shared_folder_name, type, fid = null, status, root_level, isAccept) {
    this.custom_level = root_level;
    if (status == true) {
      this.componentService.presentToast('Please Select Yes/No first.', 'info');
    }
    else {
      localStorage.setItem('clicked_fid', fid || '');
      localStorage.setItem('folder_root_level', root_level);
      this.isAccept_check = isAccept == '3' ? '0' : '1';
      if (fid != null) {
        this.APIService.sendData('setReadFile', { 'fileId': fid, 'userId': this.userId }).subscribe((result) => {
          this.callSharedFolders(shared_folder_path, shared_folder_name, type);
        });
      }
      else {
        this.callSharedFolders(shared_folder_path, shared_folder_name, type);
      }
    }
  }

  callSharedFolders(shared_folder_path, shared_folder_name, type) {
    this.show_add_folder = '2';
    localStorage.setItem('folder_type', type);
    localStorage.setItem('current_file_path', shared_folder_path);
    localStorage.setItem('path_chain', shared_folder_path);
    localStorage.setItem('c_shared_folder_name', shared_folder_name);
    localStorage.setItem('share_clicked', '1');
    localStorage.setItem('shared_user_clicked', '2');
    this.path_chain = 'shared/' + shared_folder_name;
    // var shared_folder_path = 'directory/'+this.userId+'/shared';
    this.getBreadCrums();

    this.componentService.showLoader();
    this.APIService.sendData('getDirectoryFiles', { 'file_path': shared_folder_path }).subscribe((related_files: any) => {
      this.componentService.dismissLoader();
      if (related_files.data != null) {
        var level1_hiddens = 0;
        var level2_hiddens = 0;
        var level3_hiddens = 0;
        var level4_hiddens = 0;
        var levels_hiddens = {
          level1_hiddens: 0,
          level2_hiddens: 0,
          level3_hiddens: 0,
          level4_hiddens: 0
        };
        var related_files = related_files.data.children;
        this.related_files_data = 'shared_data';
        this.shownGroup = null;
        var related_files_sorted: any = [];
        var self = this;
        var allowed_levels = this.allowed_levels;
        var login_id = this.userId;
        related_files.forEach(function (data) {
          var send_user = data.name.split('_--_')[0];
          var which_level = '';
          if (self.all_contacts.indexOf(send_user) >= 0) {
            self.full_contacts.forEach(function (data) {
              if (data.userId == send_user) {
                if (login_id == data.senderId) {
                  which_level = 'level' + data.senderSetLevel;
                }
                else {
                  which_level = 'level' + data.reciverSetLevel;
                }
              }
            });

          }
          else {
            which_level = "level" + localStorage.getItem('folder_root_level');

          }
          if (allowed_levels.indexOf(which_level) >= 0) {
            related_files_sorted.push(data);
          }
          else {
            if (which_level == 'level1') {
              level1_hiddens = level1_hiddens + 1;
            }
            else if (which_level == 'level2') {
              level2_hiddens = level2_hiddens + 1;
            }
            else if (which_level == 'level3') {
              level3_hiddens = level3_hiddens + 1;
            }
            else if (which_level == 'level4') {
              level4_hiddens = level4_hiddens + 1;
            }
            levels_hiddens = {
              level1_hiddens: level1_hiddens,
              level2_hiddens: level2_hiddens,
              level3_hiddens: level3_hiddens,
              level4_hiddens: level4_hiddens
            };
          }
        });
        this.levels_hiddens = levels_hiddens;
        this.related_files = related_files_sorted;
      }
      else {
        this.related_files = [];
        this.related_files_data = 'shared_data';
        this.shownGroup = null;
      }
      localStorage.setItem('related_files_data', this.related_files_data);
    },
      err => {
        this.componentService.dismissLoader();
        this.showTechnicalError();
      });
  }

  clickSharedFoldersUsers(userId, status, from, to, username, type, whichLevel: any = null) {
    if (whichLevel != null) {
      this.custom_level = whichLevel;
    }
    if (status == '0' && from != to) {
      this.componentService.presentToast('Please Accept/Reject first.', 'info')

    }
    else {
      localStorage.setItem('folder_type', type);
      localStorage.setItem('current_file_path', 'nopath');
      localStorage.setItem('clicked_user_name', username);
      localStorage.setItem('clicked_user_id', userId);
      localStorage.setItem('shared_user_clicked', '1');
      localStorage.setItem('clicked_whichLevel', whichLevel || '');

      // this.path_chain = localStorage.getItem('path_chain')+'/'+username;
      this.path_chain = 'shared/' + username;
      this.getBreadCrums();
      this.show_add_folder = '1';

      this.componentService.showLoader();
      this.APIService.getData('getSharedDataUsers', this.userId + '/' + userId).subscribe((result: any) => {
        this.componentService.dismissLoader();
        var fullObj: any = [];
        var other_level_files = 0;
        var other_level_unread = 0;
        var allowed_levels = this.allowed_levels;
        var loginId = this.userId;
        var file_types = this.file_types;
        var which_level = '';
        var level1_hiddens = 0;
        var level2_hiddens = 0;
        var level3_hiddens = 0;
        var level4_hiddens = 0;
        var levels_hiddens = {
          level1_hiddens: 0,
          level2_hiddens: 0,
          level3_hiddens: 0,
          level4_hiddens: 0
        };
        result.forEach(function (data) {
          if (loginId == data.fromId) {
            which_level = data.fromLevel;
          }
          else {
            which_level = data.toLevel;
          }
          if (allowed_levels.indexOf('level' + which_level) == -1) {
            other_level_files = other_level_files + 1;
            if (data.isRead.indexOf(loginId) >= 0) {
              other_level_unread = other_level_unread + 1;
            }
            if (which_level == '1') {
              level1_hiddens = level1_hiddens + 1;
            }
            else if (which_level == '2') {
              level2_hiddens = level2_hiddens + 1;
            }
            else if (which_level == '3') {
              level3_hiddens = level3_hiddens + 1;
            }
            else if (which_level == '4') {
              level4_hiddens = level4_hiddens + 1;
            }
            levels_hiddens = {
              level1_hiddens: level1_hiddens,
              level2_hiddens: level2_hiddens,
              level3_hiddens: level3_hiddens,
              level4_hiddens: level4_hiddens
            };
          }

          else {
            if (data.isAccept == '1' || data.fromId == loginId) {
              var file_name = data.folder_path.split('/').pop(-1);
              var file_type = 'directory';
              if (file_types.indexOf(file_name.split('.').pop(-1).toLowerCase()) >= 0) {
                file_type = 'file';
              }
              var newObj = {
                name: file_name,
                path: data.folder_path,
                type: file_type,
                shared_date: data.date_created,
                date_updated: data.date_updated,
                isRead: data.isRead,
                _id: data._id,
                toLevel: data.toLevel,
                isAllowed: '1',
                fromId: data.fromId,
                isRoot: data.isRoot,
                toId: data.toId,
                isAccept: data.isAccept
              }
              fullObj.push(newObj);
            }
          }
        });
        this.related_files = fullObj;
        this.levels_hiddens = levels_hiddens;
        this.related_files_data = 'shared_data';
        localStorage.setItem('related_files_data', this.related_files_data);
      },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError();
        });
    }
  }

  filterlevels(evn, level_number) {
    var event = evn.target;
    if (event.checked == true) {
      this.allowed_levels.push(level_number);
    }
    else {
      this.removeArray(this.allowed_levels, level_number);
    }

    this.hideTreeLevels();

    if (this.path_chain != '' && this.path_chain != undefined) {
      if (this.path_chain.search('shared') >= 0) {
        this.getSharedFolders();
      }

    }

    if (this.file_path == 'nopath') {
      if (this.path_chain == undefined) {
        this.fetchRelatedFiles('main');
      }
      else {
        if (this.path_chain.search('shared') == -1) {
          this.fetchRelatedFiles('main');
        }
      }
    }
  }

  hideTreeLevels() {
    var myArray = this.pages;
    for (var i = myArray.length - 1; i >= 0; --i) {
      if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
        myArray[i].isHidden = true;
      }
      else {
        myArray[i].isHidden = false;
      }
    }
    this.pages = myArray;
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

  ChangeSharingStatus(fromId, toId, status, level) {
    this.componentService.showLoader();
    var from_user = localStorage.getItem('userName');
    var data = {
      'fromId': fromId,
      'toId': toId,
      'status': status,
      'level': level,
      'from_user': from_user
    }
    this.APIService.sendData('ChangeSharingStatus', from_user).subscribe((response: any) => {
      if (response.status == '1') {
        this.componentService.dismissLoader();
        this.componentService.presentToast('Information updated.', 'success');
        this.getSharedFolders();
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

  ChangeGroupStatus(fid, status) {

    this.componentService.showLoader();
    var from_user = localStorage.getItem('userName');
    var data = {
      'folderId': fid,
      'userId': this.userId,
      'from_user': from_user,
      'status': status
    }
    this.APIService.sendData('ChangeGroupStatus', data).subscribe((response: any) => {
      if (response.status == '1') {
        var msg = status == '1' ? 'Information updated' : "Success, Now you can't get any further updates in this group.";
        this.componentService.dismissLoader();
        this.componentService.presentToast(msg, 'success');
        this.getSharedFolders();
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

  editSharedFolders(id, file_name) {
    this.edit_file_name = file_name.split('_--_').pop(-1);
    var showpanel = 'showpanel' + id;
    var editpanel = 'editpanel' + id;
    if (document.getElementById(showpanel)!.style.display == 'none') {
      document.getElementById(showpanel)!.style.display = 'block';
      document.getElementById(editpanel)!.style.display = 'none';
    }
    else {
      document.getElementById(showpanel)!.style.display = 'none';
      document.getElementById(editpanel)!.style.display = 'block';
    }
  }

  saveEdit(node, folder_name, indx, isShared: any = null) {
    if (this.show_add_folder == '2') {
      isShared = '1';
    }
    if (folder_name != undefined && folder_name != '') {
      var pre_folder_name = node.path.split("/").pop(-1).split('_--_').pop(-1);
      var pre_folder_id = node.path.split("/").pop(-1).split('_--_')[0];
      if (folder_name == pre_folder_name) {
        this.editSharedFolders(indx, null);
        return false;
      }

      this.componentService.showLoader();
      var new_path = node.path.split('/').slice(0, -1).join('/') + '/' + pre_folder_id + '_--_' + folder_name;
      var data = {
        'old_path': node.path,
        'new_path': new_path,
        'fid': '1',
        'isShared': isShared,
        'userId': this.userId,
        'toId': localStorage.getItem('clicked_user_id'),
        'toLevel': localStorage.getItem('clicked_whichLevel'),
        'from_user': localStorage.getItem('userName'),
        'show_add_folder': this.show_add_folder,
        'clicked_fid': localStorage.getItem('clicked_fid')
      }
      this.APIService.sendData('renameDirectoryFolder', data).subscribe((formdata: any) => {
        if (formdata.status == 1) {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Folder renamed.', 'success');
          if (isShared == '1') {
            var type;
            if (localStorage.getItem('shared_user_clicked') == '1') {
              type = localStorage.getItem('folder_type');
              var username = localStorage.getItem('clicked_user_name');
              var userId = localStorage.getItem('clicked_user_id');
              var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
              this.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
            }
            else if (localStorage.getItem('shared_user_clicked') == '2') {
              type = localStorage.getItem('folder_type');
              var shared_folder_path = localStorage.getItem('current_file_path');
              var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
              this.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
            }
            else if (localStorage.getItem('shared_user_clicked') == '3') {
              this.fetchRelatedFiles();
            }
            else {
              this.getSharedFolders();
            }
          }
          else {
            var nodeToEdit = this.tree.treeModel.getNodeBy(pre_node => pre_node.data.path === node.path);
            var old_name = nodeToEdit.data.name;
            var new_name = pre_folder_id + '_--_' + folder_name;
            nodeToEdit.data.name = new_name;
            nodeToEdit.data.path = new_path;
            this.tree.treeModel.update();
            if (nodeToEdit.data.children && nodeToEdit.data.children != '') {
              this.callRecursiveEditFn(nodeToEdit.data.children, old_name, new_name);
            }
            this.fetchRelatedFiles();
          }
        }
        else if (formdata.status == 2) {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Folder name already exists.', 'danger');
          this.editSharedFolders(indx, null);
        }
        else {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Error, plz try later.', 'danger')

          this.editSharedFolders(indx, null);
        }
      },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError('1');
        });
    }
    else {
      this.componentService.presentToast('Please enter valid folder name.', 'danger');

    }
  }

  showGroupUsers(show_id) {
    var showpanel = 'sh' + show_id;
    $("#" + showpanel).toggle();
  }

  breadCrumbsClick(clicked_bread) {
    var current_path: any = localStorage.getItem('current_file_path');
    if (current_path.search(clicked_bread) >= 0) {
      var file_path = current_path.split(clicked_bread)[0];
      this.file_path = file_path + clicked_bread;
      localStorage.setItem('current_file_path', this.file_path);
      this.fetchRelatedFiles(null, 'tree');
      this.ExpandFocusTree();
    }
    else {
      var type = localStorage.getItem('folder_type');
      var username = localStorage.getItem('clicked_user_name');
      var userId = localStorage.getItem('clicked_user_id');
      var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
      this.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
    }
  }

  treeClicked() {
    var current_file_path = localStorage.getItem('current_file_path');
    var previous_file_path = localStorage.getItem('previous_file_path');
    if (current_file_path != previous_file_path) {
      localStorage.setItem('previous_file_path', current_file_path || '');
      if (current_file_path == 'nopath') {
        this.fetchRelatedFiles('main', 'tree');
      }
      else {
        this.fetchRelatedFiles(null, 'tree');
      }
    }
  }

  dragDropFired(event) {
    this.fetchTreeView();
    this.fetchRelatedFiles(null, 'tree');
  }

  root() {
    this.navCtrl.navigateRoot(['dashboard', "0"]);
  }

  async addNewGroupMember(folder_id, groupEmails) {
    let modal = await this.modalCtrl.create({
      component: 'ContactslistPage',
      componentProps: {
        already: groupEmails
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if (data != undefined && data != null) {
        if (data.length > 0) {

          this.componentService.showLoader();
          this.APIService.sendData('addNewGroupMembers/' + folder_id + '/' + data, this.userId).subscribe((result: any) => {
            if (result.status == 1) {
              this.componentService.dismissLoader();
              this.componentService.presentToast('New members added successfully.', 'success');
              this.getSharedFolders();
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
    });
    await modal.present();

  }

  async modalupload() {
    let modal = await this.modalCtrl.create({
      component: 'AppuploadfilePage',
      componentProps: {
      }
    });
    modal.onDidDismiss().then((data: any) => {
      this.fetchRelatedFiles();
    });
    await modal.present();
  }

  higherLevelFiles() {
    this.componentService.presentToast('Please open higher levels to access these files.', 'info');
  }

  isParaActive: boolean = false;
  isBtnActive: boolean = false;

  //ToggleClass function functionality
  toggleClass() {
    this.isParaActive = !this.isParaActive;
    this.isBtnActive = !this.isBtnActive;
  };
  openMenu() {
    this.menu.enable(true, 'second')
      .then(myMenu => {
        console.log(myMenu);
        this.menu.open('second');
        this.navBack = true;
      });
  }
  CusTreeClicked(event) {
    if (localStorage.getItem('current_file_path') != event.data.path && event.isFocused == true) {
      localStorage.setItem('current_file_path', event.data.path);
      localStorage.setItem('current_active_node', event.id);
      this.fetchRelatedFiles(null, 'tree');
      //this.ExpandFocusTree();
    }
  }

  checkDir(node) {
    return node.type == 'file';
  }

  dragRightFiles(dragPath, dropPath, file_type, dragData, is_panel, shared_id = null) {
    this.executeDragDrop(dragPath, dropPath, file_type, is_panel, dragData, shared_id);
  }

  onMoveNode($event) {
    var dragPath = $event.node.path;
    var dropPath = $event.to.parent.path;
    this.executeDragDrop(dragPath, dropPath, 'directory', '0', null);
  }

  executeDragDrop(dragPath, dropPath, file_type, move_type, dragData, shared_id = null) {
    if (dropPath == undefined) {
      this.componentService.presentToast("Error, You can't drop here.", 'danger');
    }
    else {

      this.componentService.showLoader();
      var data = {
        'old_path': dragPath,
        'new_path': dropPath,
        'shared_id': shared_id
      }
      this.APIService.sendData('dragDropFolder', data).subscribe((result: any) => {
        if (result.status == 1) {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Moved successfully.', 'success');
          var self = this;
          if (shared_id != undefined && shared_id != null) {
            var type;
            if (localStorage.getItem('shared_user_clicked') == '1') {
              type = localStorage.getItem('folder_type');
              var username = localStorage.getItem('clicked_user_name');
              var userId = localStorage.getItem('clicked_user_id');
              var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
              self.clickSharedFoldersUsers(userId, '1', '0', '0', username, type, clicked_whichLevel);
            }
            else if (localStorage.getItem('shared_user_clicked') == '2') {
              type = localStorage.getItem('folder_type');
              var shared_folder_path = localStorage.getItem('current_file_path');
              var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
              self.callSharedFolders(shared_folder_path, c_shared_folder_name, type);
            }
            else if (localStorage.getItem('shared_user_clicked') == '3') {
              self.fetchRelatedFiles(null, 'tree');
            }
            else {
              self.fetchRelatedFiles(null, 'tree');
            }
          }
          else {
            self.fetchRelatedFiles(null, 'tree');
          }
          if (file_type == 'directory') {
            // if(move_type == 1){
            var nodeToRemove = this.tree.treeModel.getNodeBy(node => node.data.path === dragPath);
            if (nodeToRemove != undefined && nodeToRemove != null) {
              nodeToRemove.hide();
            }
            var new_dropPath = dropPath + '/' + dragData.name;
            this.addNodeInTree(dragData.name, new_dropPath, dropPath);
            this.recurse(dragData, new_dropPath);
          }
        }
        else if (result.status == 2) {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Folder already exists.', 'danger');

          // this.fetchTreeView(); 
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

  callRecursiveFn(childs, dropPath, startNode) {
    var self = this;
    childs.forEach(function (data) {
      if (data.type == 'directory') {
        var new_path = dropPath + '/' + startNode + data.path.split(startNode).pop();
        var nodeToEdit = self.tree.treeModel.getNodeBy(pre_node => pre_node.data.path === data.path);
        nodeToEdit.data.path = new_path;
        self.tree.treeModel.update();
      }
      if (data.children && data.children != '') {
        self.callRecursiveFn(data.children, dropPath, startNode);
      }
    });
  }

  callRecursiveEditFn(childs, old_name, new_name) {
    var self = this;
    childs.forEach(function (data) {
      if (data.type == 'directory') {
        var nodeToEdit = self.tree.treeModel.getNodeBy(pre_node => pre_node.data.path === data.path);
        nodeToEdit.data.path = nodeToEdit.data.path.replace(old_name, new_name);
        self.tree.treeModel.update();
      }
      if (data.children && data.children != '') {
        self.callRecursiveEditFn(data.children, old_name, new_name);
      }
    });
  }

  editFolders(node, state) {
    var unq = node.path.split('/').join('_');
    $('#input' + unq).val(node.name.split('_--_').pop(-1));
    var showpanel = 'showpanel' + unq;
    var showpanel1 = 'showpanel1' + unq;
    var showpanel2 = 'showpanel2' + unq;
    var editpanel = 'editpanel' + unq;
    if (document.getElementById(showpanel)!.style.display == 'none') {
      document.getElementById(showpanel1)!.style.display = 'inline-block';
      if (state == false) {
        document.getElementById(showpanel2)!.setAttribute('style', 'display:inline-block !important');
      }
      document.getElementById(showpanel)!.style.display = 'inline-block';
      document.getElementById(editpanel)!.style.display = 'none';
    }
    else {
      document.getElementById(showpanel1)!.style.display = 'none';
      if (state == false) {
        document.getElementById(showpanel2)!.setAttribute('style', 'display:none !important');
      }
      document.getElementById(showpanel)!.style.display = 'none';
      document.getElementById(editpanel)!.style.display = 'inline-block';
    }
  }

  saveEditNode(node, folder_names = null, state) {
    var unq = node.path.split('/').join('_');
    var folder_name = $('#input' + unq).val();
    if (folder_name != undefined && folder_name != '') {
      var pre_folder_name = node.path.split("/").pop(-1).split('_--_').pop(-1);
      if (folder_name == pre_folder_name) {
        this.editFolders(node, state);
        return false;
      }

      this.componentService.showLoader();
      var userId = node.path.split("/").pop(-1).split('_--_')[0];
      var new_path = node.path.split('/').slice(0, -1).join('/') + '/' + userId + '_--_' + folder_name;
      var data = {
        'old_path': node.path,
        'new_path': new_path,
        'fid': '0'
      }

      this.APIService.sendData('renameDirectoryFolder', data).subscribe((formdata: any) => {
        if (formdata.status == 1) {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Folder renamed.', 'success');
          var nodeToEdit = this.tree.treeModel.getNodeBy(pre_node => pre_node.data.path === node.path);
          var old_name = nodeToEdit.data.name;
          var new_name = userId + '_--_' + folder_name;
          nodeToEdit.data.name = new_name;
          nodeToEdit.data.path = new_path;
          this.tree.treeModel.update();
          this.editFolders(node, state);
          if (nodeToEdit.data.children && nodeToEdit.data.children != '') {
            this.callRecursiveEditFn(nodeToEdit.data.children, old_name, new_name);
          }
          this.fetchRelatedFiles(null, 'tree');

        }
        else if (formdata.status == 2) {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Folder name already exists.', 'danger');
          this.editFolders(node, state);
        }
        else {
          this.componentService.dismissLoader();
          this.componentService.presentToast('Error, plz try later.', 'danger');
          this.editFolders(node, state);
        }
      },
        err => {
          this.componentService.dismissLoader();
          this.showTechnicalError('1');
        });
    }
    else {
      this.componentService.presentToast('Please enter valid folder name.', 'danger');
    }
  }

  ExpandFocusTree() {
    console.log(this.tree);
    this.tree.treeModel.expandAll();
    var nodeToExpand = this.tree.treeModel.getNodeBy(node => node.data.path === localStorage.getItem('current_file_path'));
    if (nodeToExpand != null && nodeToExpand != undefined) {
      nodeToExpand.setActiveAndVisible();
      nodeToExpand.expand();
    }
  }

  openTreeNodes(event, filePath) {
    if (event.target.className != 'no_clicks_avail' && event.target.className != 'toggle-children' && event.target.className.search('icon-md') == -1) {
      this.file_path = localStorage.setItem('current_file_path', filePath);
      this.ExpandFocusTree();
      this.fetchRelatedFiles();
    }
  }

  fileDroped(event, dropPath, isShared = null) {
    if (event.dragData != undefined && event.dragData != null && event.dragData != '') {
      if (event.dragData.path != dropPath) {
        var dragPath = event.dragData.path;

        this.componentService.showLoader();
        var data = {
          'old_path': dragPath,
          'new_path': dropPath,
          'shared_id': null
        }
        this.APIService.sendData('dragDropFolder', data).subscribe((result: any) => {
          this.componentService.dismissLoader();
          if (result.status == '1') {
            if (event.dragData.type == 'directory') {
              if (isShared != null) {
                var nodeToRemove = this.tree.treeModel.getNodeBy(node => node.data.path === dragPath);
                if (nodeToRemove != undefined && nodeToRemove != null) {
                  nodeToRemove.hide();
                }
              }
              var new_dropPath = dropPath + '/' + event.dragData.name;
              this.addNodeInTree(event.dragData.name, new_dropPath, dropPath);
              this.recurse(event.dragData, new_dropPath);
            }
            this.fetchRelatedFiles();
            this.componentService.presentToast('Moved successfully..', 'success');
          }
          else {
            this.componentService.presentToast('File/Folder already exists with same name.', 'danger');
          }
        },
          err => {
            this.componentService.dismissLoader();
            this.showTechnicalError('1');
          });
      }
    }
  }

  recurse(node, dropPath) {
    if (node.children != undefined) {
      for (var i = 0, count = node.children.length; i < count; i++) {
        if (node.children[i].type == 'directory') {
          this.addNodeInTree(node.children[i].name, node.children[i].path, dropPath);
          this.recurse(node.children[i], node.children[i].path);
        }
      }
    }
  }

  addNodeInTree(name, path, dropPath) {
    let newNode = { 'name': name, 'path': path, 'type': 'directory', 'children': [] }
    var nodeToAddUnder = this.tree.treeModel.getNodeBy(node => node.data.path === dropPath);
    if (nodeToAddUnder.data.children) {
      nodeToAddUnder.data.children.push(newNode);
    } else {
      nodeToAddUnder.data.children = [];
      nodeToAddUnder.data.children.push(newNode);
    }
    this.tree.treeModel.update();
  }
}


