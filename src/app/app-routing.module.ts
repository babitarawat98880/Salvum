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
  },
  {
    path: 'trade-dashboard',
    loadChildren: () => import('../pages/trade-dashboard/trade-dashboard.module').then( m => m.TradeDashboardPageModule)
  },
  {
    path: 'trade',
    loadChildren: () => import('../pages/trade/trade.module').then( m => m.TradePageModule)
  },
  {
    path: 'edit-job',
    loadChildren: () => import('../pages/edit-job/edit-job.module').then( m => m.EditJobPageModule)
  },
  {
    path: 'share-job-contacts',
    loadChildren: () => import('../pages/share-job-contacts/share-job-contacts.module').then( m => m.ShareJobContactsPageModule)
  },
  {
    path: 'job-calendar',
    loadChildren: () => import('../pages/job-calendar/job-calendar.module').then( m => m.JobCalendarPageModule)
  },
  {
    path: 'file-manager',
    loadChildren: () => import('../pages/file-manager/file-manager.module').then( m => m.FileManagerPageModule)
  },
  {
    path: 'members',
    loadChildren: () => import('../pages/members/members.module').then( m => m.MembersPageModule)
  },
  {
    path: 'invite',
    loadChildren: () => import('../pages/invite/invite.module').then( m => m.InvitePageModule)
  },
  {
    path: 'wallets',
    loadChildren: () => import('../pages/wallets/wallets.module').then( m => m.WalletsPageModule)
  },
  {
    path: 'sites',
    loadChildren: () => import('../pages/sites/sites.module').then( m => m.SitesPageModule)
  },
  {
    path: 'passwords',
    loadChildren: () => import('../pages/passwords/passwords.module').then( m => m.PasswordsPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('../pages/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'invitemail',
    loadChildren: () => import('../pages/invitemail/invitemail.module').then( m => m.InvitemailPageModule)
  },
  {
    path: 'addwebsite',
    loadChildren: () => import('../pages/addwebsite/addwebsite.module').then( m => m.AddwebsitePageModule)
  },
  {
    path: 'sitesdetail',
    loadChildren: () => import('../pages/sitesdetail/sitesdetail.module').then( m => m.SitesdetailPageModule)
  },
  {
    path: 'editsite',
    loadChildren: () => import('../pages/editsite/editsite.module').then( m => m.EditsitePageModule)
  },
  {
    path: 'walletdetail',
    loadChildren: () => import('../pages/walletdetail/walletdetail.module').then( m => m.WalletdetailPageModule)
  },
  {
    path: 'modals',
    loadChildren: () => import('../pages/modals/modals.module').then( m => m.ModalsPageModule)
  },
  {
    path: 'addpassword',
    loadChildren: () => import('../pages/addpassword/addpassword.module').then( m => m.AddpasswordPageModule)
  },
  {
    path: 'passworddetail',
    loadChildren: () => import('../pages/passworddetail/passworddetail.module').then( m => m.PassworddetailPageModule)
  },
  {
    path: 'editpass',
    loadChildren: () => import('../pages/editpass/editpass.module').then( m => m.EditpassPageModule)
  },
  {
    path: 'uploadfile',
    loadChildren: () => import('../pages/uploadfile/uploadfile.module').then( m => m.UploadfilePageModule)
  },
  {
    path: 'smailfiles',
    loadChildren: () => import('../pages/smailfiles/smailfiles.module').then( m => m.SmailfilesPageModule)
  },
  {
    path: 'jobfile',
    loadChildren: () => import('../pages/jobfile/jobfile.module').then( m => m.JobfilePageModule)
  },
  {
    path: 'addtrade',
    loadChildren: () => import('../pages/addtrade/addtrade.module').then( m => m.AddtradePageModule)
  },
  {
    path: 'groupslist',
    loadChildren: () => import('../pages/groupslist/groupslist.module').then( m => m.GroupslistPageModule)
  },
  {
    path: 'addevent',
    loadChildren: () => import('../pages/addevent/addevent.module').then( m => m.AddeventPageModule)
  },
  {
    path: 'trade-contacts',
    loadChildren: () => import('../pages/trade-contacts/trade-contacts.module').then( m => m.TradeContactsPageModule)
  },
  {
    path: 'add-coworkers',
    loadChildren: () => import('../pages/add-coworkers/add-coworkers.module').then( m => m.AddCoworkersPageModule)
  },
  {
    path: 'addcontact',
    loadChildren: () => import('../pages/addcontact/addcontact.module').then( m => m.AddcontactPageModule)
  },
  {
    path: 'jobphotos',
    loadChildren: () => import('../pages/jobphotos/jobphotos.module').then( m => m.JobphotosPageModule)
  },
  {
    path: 'filemanagerfiles',
    loadChildren: () => import('../pages/filemanagerfiles/filemanagerfiles.module').then( m => m.FilemanagerfilesPageModule)
  },
  {
    path: 'addfolder',
    loadChildren: () => import('../pages/addfolder/addfolder.module').then( m => m.AddfolderPageModule)
  },
  {
    path: 'contracts',
    loadChildren: () => import('../pages/contracts/contracts.module').then( m => m.ContractsPageModule)
  },
  {
    path: 'adendum',
    loadChildren: () => import('../pages/adendum/adendum.module').then( m => m.AdendumPageModule)
  },
  {
    path: 'add-adendum',
    loadChildren: () => import('../pages/add-adendum/add-adendum.module').then( m => m.AddAdendumPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
