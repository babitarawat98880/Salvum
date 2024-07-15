import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FileManagerPageRoutingModule } from './file-manager-routing.module';
import { FileManagerPage } from './file-manager.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
// import { TreeModule } from '@circlon/angular-tree-component';
// import { TreeModule } from 'angular-tree-component-amphinicy';
// import { TreeModule } from '@ali-hm/angular-tree-component';
// import { TreeModule } from 'angular-tree-component';
import { TreeModule } from '@ali-hm/angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileManagerPageRoutingModule,
    SharedModuleModule,
    TreeModule
  ],
  declarations: [FileManagerPage]
})
export class FileManagerPageModule {}
