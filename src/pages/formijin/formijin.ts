import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";

/**
 * Generated class for the FormijinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formijin',
  templateUrl: 'formijin.html',
})
export class FormijinPage {
  formijin: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormijinPage');
  }

  ngOnInit() {
    
  }

  submitFormIjin(){
    this.formijin.typeIjin = 'Ijin tanpa keterangan';

    this.api.postFormIjin(this.formijin).then((data: any[])=> {
      console.log(data['Success'] + "; " + data['Msg']);
      if(data['Success']==true){
        this.presentAlert('Success', data['Msg']);
      }
    }, (error)=>{
      console.log("Error with " + JSON.stringify(error));
    });
  }

  presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
