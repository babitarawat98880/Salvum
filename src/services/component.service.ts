import { Injectable } from '@angular/core';
import { ToastController, NavController, LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(
    private toastController:ToastController,
    public loadingCtrl:LoadingController
    ) {

   }
  async presentToast(msg:any, type: any){
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      position : 'top',
      cssClass: type
      });
      toast.removeAttribute('tabindex'); 
      toast.present();
   }
   async showLoader() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loading.present();
   }
   async dismissLoader(){
    this.loadingCtrl.dismiss()
   }
}
