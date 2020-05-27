import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {
  loading : any;
  // apiUrl: string = "http://localhost/myabsenweb/api/";
  apiUrl: string = "http://mysod.xyz/myabsenweb/api/";

  UPLOAD_URL: string = "https://mysod.xyz/myabsenweb/api/uploadImage/";
  ABSENSI_IN_URL: string = 'https://mysod.xyz/myabsenweb/api/absensiIn';

  constructor(public loadingCtrl: LoadingController, public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }  
  
  get( url, load = ''){
    if(load == ''){
      this.loadingshow();
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + url).subscribe((data: any) => {
        resolve(data);
        this.dismissLoading();
      }, (err) => {
        reject(err);
        this.dismissLoading();
      });
    });
  }

  post( url, post, load = ''){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    if(load == ''){
      this.loadingshow();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + url, JSON.stringify(post))
        .subscribe(res => {
          resolve(res);
          this.dismissLoading();
        }, (err) => {
          reject(err);
          this.dismissLoading();
        });
    });
  }

  getJabatan(){
    return this.get('getJabatan');
  }

  postFormIjin(params){
    return this.post('frmijin', params);
  }

  postAbsensi(params){
    return this.post('frmabsensi', params);
  }

  // https://mysod.xyz/myabsenweb/api/absensiIn
  absensiIn(params){
    return this.post('absensiIn', params);
  }

  getReportAbsensi(){
    // http://mysod.xyz/myabsenweb/index.php/Welcome/apiAbsensi
    // http://mysod.xyz/myabsenweb/reportabsensi
    return this.get('reportabsensi');
  }

  async loadingshow(){
    if(!this.loading){
      const loading = await this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Loading',
        duration: 3000,
        dismissOnPageChange: true,
        showBackdrop: true,
        enableBackdropDismiss: true
      });
      return await loading.present();
    }
  }

  async dismissLoading(){
    // console.log(this.loading);
    if(this.loading){
      await this.loading.dismiss();
    }
  }

}
