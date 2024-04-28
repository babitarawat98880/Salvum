import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('../pages/login/login.module').then( m => m.LoginPageModule)
  },
  {

    path: 'dashboard/:id',
    loadChildren: () => import('../pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('../pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
 
  {
    path: 'add-email',
    loadChildren: () => import('../pages/add-email/add-email.module').then( m => m.AddEmailPageModule)
  },
  {
    path: 'license',
    loadChildren: () => import('../pages/license/license.module').then( m => m.LicensePageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('../pages/history/history.module').then( m => m.HistoryPageModule)
  },
  {
    path: 'managejob',
    loadChildren: () => import('../pages/managejob/managejob.module').then( m => m.ManagejobPageModule)
  },
  {
    path: 'update-license',
    loadChildren: () => import('../pages/update-license/update-license.module').then( m => m.UpdateLicensePageModule)
  },
  {
    path: 'editprofile',
    loadChildren: () => import('../pages/editprofile/editprofile.module').then( m => m.EditprofilePageModule)
  },
  {
    path: 'changepassword',
    loadChildren: () => import('../pages/changepassword/changepassword.module').then( m => m.ChangepasswordPageModule)
  },
  {
    path: 'bidjobs',
    loadChildren: () => import('../pages/bidjobs/bidjobs.module').then( m => m.BidjobsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
