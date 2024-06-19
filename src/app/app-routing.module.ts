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
  {
    path: 'bidding',
    loadChildren: () => import('../pages/bidding/bidding.module').then( m => m.BiddingPageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('../pages/contacts/contacts.module').then( m => m.ContactsPageModule)
  },
  {
    path: 'extcont',
    loadChildren: () => import('../pages/extcont/extcont.module').then( m => m.ExtcontPageModule)
  },
  {
    path: 'edit-group',
    loadChildren: () => import('../pages/edit-group/edit-group.module').then( m => m.EditGroupPageModule)
  },
  {
    path: 'add-group',
    loadChildren: () => import('../pages/add-group/add-group.module').then( m => m.AddGroupPageModule)
  },
  {
    path: 'managegroup',
    loadChildren: () => import('../pages/managegroup/managegroup.module').then( m => m.ManagegroupPageModule)
  },
  {
    path: 'compose',
    loadChildren: () => import('../pages/compose/compose.module').then( m => m.ComposePageModule)
  }
  ,
  {
    path: 'small-inbox',
    loadChildren: () => import('../pages/small-inbox/small-inbox.module').then( m => m.SmallInboxPageModule)
  },
  {
    path: 'assign-company',
    loadChildren: () => import('../pages/assign-company/assign-company.module').then( m => m.AssignCompanyPageModule)
  },
  {
    path: 'pricing',
    loadChildren: () => import('../pages/pricing/pricing.module').then( m => m.PricingPageModule)
  },
  {
    path: 'extraspace',
    loadChildren: () => import('../pages/extraspace/extraspace.module').then( m => m.ExtraspacePageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('../pages/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('../pages/notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'add-job',
    loadChildren: () => import('../pages/add-job/add-job.module').then( m => m.AddJobPageModule)
  },
  {
    path: 'contactslist',
    loadChildren: () => import('../pages/contactslist/contactslist.module').then( m => m.ContactslistPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
