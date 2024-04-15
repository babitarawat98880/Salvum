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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
