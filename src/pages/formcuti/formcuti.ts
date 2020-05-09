import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { NgForm } from '@angular/forms';

/**
 * Generated class for the FormcutiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formcuti',
  templateUrl: 'formcuti.html',
})
export class FormcutiPage {
  @ViewChild('slForm') slForm: NgForm;
  
  formijin: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormcutiPage');
  }

  ngOnInit() {
    
  }

  submitFormIjin(){
    this.formijin.typeIjin = 'Ijin cuti';

    this.api.postFormIjin(this.formijin).then((data: any[])=> {
      console.log(data['Success'] + "; " + data['Msg']);
      if(data['Success']==true){
        this.presentAlert('Success', data['Msg']);
      }
      this.slForm.reset();
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
