import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { Platform, NavController, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
// import { Geocodio } from 'geocodio-library-node';
import { 
  BackgroundGeolocation, 
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
 } from '@ionic-native/background-geolocation';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Vibration } from '@ionic-native/vibration';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { HttpClient } from '@angular/common/http';
import { ApiProvider } from '../../providers/api/api';

import { FormijinPage } from '../formijin/formijin';
import { FormsakitPage } from '../formsakit/formsakit';
import { FormcutiPage } from '../formcuti/formcuti';
import { ReportPage } from '../report/report';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  address: string = "...";
 
  latitude: number;
  longitude: number;

  // geocoder;
  // api_key: string = '62be5e223e43bbd5664ddd6523d5d5b5d64c226';

  checkGeolocation:any;
  datalocation:any;
  status:any;
  
  days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  dayname: string;
  now = new Date();
  time = this.now.getHours() * 60 + this.now.getMinutes();  
  datatime: any;

  _absenpagi: string = "07:30-08:40";
  _absensiang: string = "12:00-13:00";
  _absenpulang: string = "16:30-18:00";
  _paket: string;

  formabsensi: any = {};

  clickSub: any;
  imageURI: any;
  userData: any;
  loading: Loading;

  constructor(public platform: Platform, public navCtrl: NavController, private alertCtrl: AlertController, public loadingCtrl: LoadingController, private geolocation: Geolocation, private locationAccuracy: LocationAccuracy, private nativeGeocoder: NativeGeocoder, private backgroundGeolocation: BackgroundGeolocation,private zone: NgZone, public httpClient: HttpClient, public api: ApiProvider, private localNotifications: LocalNotifications, private vibration: Vibration, private camera: Camera, private transfer: FileTransfer, public toastCtrl: ToastController) {

    this.platform.ready().then(()=>{
      // navigator.geolocation.getCurrentPosition(this.showPosition, this.errorHandler, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

      // console.log("Device Ready");
      // this.geocoder = new Geocodio('62be5e223e43bbd5664ddd6523d5d5b5d64c226');
      // console.log('getDay', this.now.getDay());
      this.dayname = this.days[this.now.getDay()];
      this._paket = 'basic';
    });

    setInterval(() => {
      this.datatime = new Date();
    }, 1000);
  }

  requestAccuracy() {
    if (this.platform.is('cordova')) {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
          );
        }
      
      });
    }
  }
  
  ngOnInit() {
    this.requestAccuracy();
    this.cekGPS();
    this.loadMap();
    // this.getAlarm();
  }

  // https://www.joshmorony.com/getting-familiar-with-local-notifications-in-ionic-2/
  getAlarm(){
    if(this.platform.is('cordova')){
      // Cancel any existing notifications
      this.localNotifications.cancelAll().then(() => {

        this.clickSub = this.localNotifications.on('click').subscribe(data => {
          console.log(data);
          this.presentAlert('Alert', 'Your notifiations contains a secret = ' + data.data.secret);
          this.clickSub.unsubscribe();
        });
        
        // Schedule delayed notification
        let date = new Date(new Date().getTime() + 3600);
        this.localNotifications.schedule({
          id: 1,
          // title: 'Local ILocalNotification Example',
          text: 'Delayed ILocalNotification',
          trigger: {at: date},
          foreground:true,
          vibrate: true,
          led: {color: '#FF00FF', on: 500, off: 500},
          data: {secret: 'My hidden message this is'},
          // sound: this.platform.is('android') ? 'file://assets/sounds/Rooster.mp3' : null,
          //every: 'day'
        });

        this.vibration.vibrate(1000);

      });
    }
  }

  // https://baadiersydow.com/ionic-google-maps-geolocation-native-javascript-ios-android/
  loadMap() {
    return new Promise((resolve, reject) => {
      // let options = {
      //   enableHighAccuracy: true, maximumAge : 60000, timeout : 10000
      // };

      // this.geolocation.getCurrentPosition(options).then((resp) => {

      //   this.latitude = resp.coords.latitude;
      //   this.longitude = resp.coords.longitude;

      //   this.getAddressFromCoords(this.latitude, this.longitude);

      //   let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      //   let mapOptions = {
      //     center: latLng,
      //     zoom: 15,
      //     mapTypeId: google.maps.MapTypeId.ROADMAP
      //   }

      //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      //    this.map.addListener('dragend', () => { 
      //     this.latitude = this.map.center.lat();
      //     this.longitude = this.map.center.lng();
      //      // this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      //   });

      // }).catch((error) => {
      //   console.log('Error getting location', error);
      //   this.address = error.message;
      // });

      if(this.platform.is('cordova') && (this.platform.is('ios') || this.platform.is('android'))){

        let watchOptions = {
          enableHighAccuracy: true, timeout: 60000, frequency: 1000, maximumAge: 0
        };

        let watch = this.geolocation.watchPosition(watchOptions);
        watch.subscribe((data) => {
          console.log("watchPosition", data);
          // this.address = data.message;
          if(!data){
            this.zone.run(() => {
              this.latitude = data.coords.latitude;
              this.longitude = data.coords.longitude;
              this.getAddressFromCoords(this.latitude, this.longitude);
            });
          }
        }, function(error) {
          console.log('Error w/ watchPosition: ' +JSON.stringify(error));
        });

      };

    });
  }

  cekGPS(){
    if(this.platform.is('cordova') && (this.platform.is('ios') || this.platform.is('android'))){
      // const loader = this.loadingCtrl.create({
      //   content: "Please wait..."
      // });
      // loader.present();
    
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: true // enable this to clear background location settings when the app terminates
      };

      this.backgroundGeolocation.configure(config).then(() => {
        this.checkGeolocation=this.backgroundGeolocation
            .on(BackgroundGeolocationEvents.location)
            .subscribe((location: BackgroundGeolocationResponse) => {

              this.zone.run(() => {
                this.datalocation=JSON.stringify(location);
                console.log(location);
              });
              
              if(location.isFromMockProvider==true){
                this.status="Fake GPS detected!";
                const alert = this.alertCtrl.create({
                  subTitle: 'We detected you using the Fake GPS application. Turn off the application immediately.',
                  buttons: ['OK']
                });
                alert.present();
              }
            });
            // loader.dismiss();
        });  
   
      this.backgroundGeolocation.start();
    }
      
  }

  CekStop(){
    console.log("stop");
    console.log(this.checkGeolocation)
    this.datalocation="";
    this.status="";
    this.checkGeolocation.unsubscribe();
    this.backgroundGeolocation.deleteAllLocations();
    this.backgroundGeolocation.stop();
  }

  getAddressFromCoords(lattitude, longitude) {
    // console.log("getAddressFromCoords " + lattitude + " " + longitude);

    // this.geocoder = this.httpClient.get('https://api.geocod.io/v1.4/reverse?q='+lattitude+','+longitude+'&api_key='+this.api_key);
    // this.geocoder.subscribe(data => {
    //   console.log('my data: ', data);
    // });

    this.address = "Tempel, Kecamatan Krian, Kabupaten Sidoarjo";

    if(localStorage.getItem('Geocode_' + lattitude+'_'+longitude) === null) {
      let result = JSON.parse(localStorage.getItem('Geocode_' + lattitude+'_'+longitude) || '{}');
      console.log("getAddressFromCoords localStorage", JSON.stringify(result));
      this.address = result.subLocality + ", "+result.locality + ", "+result.subAdministrativeArea + ", "+result.postalCode + ", "+result.administrativeArea;
    }

    // } else {

      if(this.platform.is('cordova') && (this.platform.is('ios') || this.platform.is('android'))){
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
        
        // Ionic 3
        this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
        .then((result: NativeGeocoderReverseResult[]) => {
          console.log("getAddressFromCoords reverseGeocode");
          localStorage.setItem('Geocode_' + lattitude+'_'+longitude, JSON.stringify(result[0]));
          if(result[0].subLocality!==undefined) this.address = result[0].subLocality + ", "+result[0].locality + ", "+result[0].subAdministrativeArea;
          // this.address = this.pretifyAddress(result[0]);

        })
        .catch((error: any) => {
          alert('Error getting location'+ JSON.stringify(error));
        });
      }

    // }

    // this.nativeGeocoder.forwardGeocode('Berlin', options)
    // .then((coordinates: NativeGeocoderForwardResult[]) => console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude))
    // .catch((error: any) => console.log(error));

    // Ionic 4
    // this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
    //   .then((result: NativeGeocoderReverseResult[]) => {
    //     this.address = "";
    //     let responseAddress = [];
    //     for (let [key, value] of Object.entries(result[0])) {
    //       if (value.length > 0)
    //         responseAddress.push(value); 
    //     }
    //     responseAddress.reverse();
    //     for (let value of responseAddress) {
    //       this.address += value + ", ";
    //     }
    //     this.address = this.address.slice(0, -2);
    //   })
    //   .catch((error: any) => {
    //     this.address = "Address Not Available!";
    //   }); 
  }

  // address
  pretifyAddress(address){
    let obj = [];
    let data = "";
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if(obj[val].length)
      data += obj[val]+', ';
    }
    return address.slice(0, -2);
  }

  absenPagi(){
    // 07:30-08:40
    var start = 7 * 60 + 30;
    var end   = 8 * 60 + 40;

    if(this._paket == 'basic'){
      // foto selfie
    }

    console.log(this.now.getHours() + ":" + ("0" + this.now.getMinutes()).substr(-2));

    var title = 'Absen Pagi';
    if(this.time >= start && this.time < end){

      this.formabsensi.tgl = this.now.toISOString().split('T')[0];
      this.formabsensi.time = this.now.getHours() + ":" + ("0" + this.now.getMinutes()).substr(-2);
      this.formabsensi.type = title;
      this.formabsensi.latlong = (this.latitude!==undefined) ? this.latitude + ',' + this.longitude : '';
      this.formabsensi.chekpoint = this.address;
      this.formabsensi.iduser = 1;

      this.api.postAbsensi(this.formabsensi).then((data: any[])=> {
        console.log(data['Success'] + "; " + data['Msg']);
        // if(data['Success']==true){
          this.presentAlert(title, data['Msg']);
        // }
      }, (error)=>{
        console.log("Error with " + JSON.stringify(error));
      });

      // this.presentAlert(title, title + ' berhasil disimpan');
    } else {
      if(this.time < start){
        this.presentAlert(title, 'Belum Waktu ' + title);
      }
      if(this.time > end){

        this.formabsensi.tgl = this.now.toISOString().split('T')[0];
        this.formabsensi.time = this.now.getHours() + ":" + ("0" + this.now.getMinutes()).substr(-2);
        this.formabsensi.type = title;
        this.formabsensi.latlong = (this.latitude!==undefined) ? this.latitude + ',' + this.longitude : '';
        this.formabsensi.chekpoint = this.address;
        this.formabsensi.iduser = 1;
  
        this.api.postAbsensi(this.formabsensi).then((data: any[])=> {
          console.log(data['Success'] + "; " + data['Msg']);
          // if(data['Success']==true){
            this.presentAlert(title, data['Msg']);
          // }
        }, (error)=>{
          console.log("Error with " + JSON.stringify(error));
        });
      }
    }
  }

  absenSiang(){
    // 12:00-13:00
    var start = 12 * 60;
    var end   = 13 * 60;

    console.log(this.now.getHours() + ":" + ("0" + this.now.getMinutes()).substr(-2));
    
    var title = 'Absen Siang';
    if(this.time >= start && this.time < end){

      this.formabsensi.tgl = this.now.toISOString().split('T')[0];
      this.formabsensi.time = this.now.getHours() + ":" + ("0" + this.now.getMinutes()).substr(-2);
      this.formabsensi.type = title;
      this.formabsensi.latlong = (this.latitude!==undefined) ? this.latitude + ',' + this.longitude : '';
      this.formabsensi.chekpoint = this.address;
      this.formabsensi.iduser = 1;

      this.api.postAbsensi(this.formabsensi).then((data: any[])=> {
        console.log(data['Success'] + "; " + data['Msg']);
        // if(data['Success']==true){
          this.presentAlert(title, data['Msg']);
        // }
      }, (error)=>{
        console.log("Error with " + JSON.stringify(error));
      });

      // this.presentAlert(title, title + ' berhasil disimpan');
    } else {
      if(this.time < start){
        this.presentAlert(title, 'Belum Waktu ' + title);
      }
      if(this.time > end){

        this.formabsensi.tgl = this.now.toISOString().split('T')[0];
        this.formabsensi.time = this.now.getHours() + ":" + ("0" + this.now.getMinutes()).substr(-2);
        this.formabsensi.type = title;
        this.formabsensi.latlong = (this.latitude!==undefined) ? this.latitude + ',' + this.longitude : '';
        this.formabsensi.chekpoint = this.address;
        this.formabsensi.iduser = 1;
  
        this.api.postAbsensi(this.formabsensi).then((data: any[])=> {
          console.log(data['Success'] + "; " + data['Msg']);
          // if(data['Success']==true){
            this.presentAlert(title, data['Msg']);
          // }
        }, (error)=>{
          console.log("Error with " + JSON.stringify(error));
        });
      }
    }
  }

  absenPulang(){
    // 16:30-18:00
    var start = 16 * 60 + 30;
    var end   = 18 * 60;

    console.log(this.now.getHours() + ":" + ("0" + this.now.getMinutes()).substr(-2));
    
    var title = 'Absen Pulang';
    if(this.time >= start && this.time < end){

      this.formabsensi.tgl = this.now.toISOString().split('T')[0];
      this.formabsensi.time = this.now.getHours() + ":" + ("0" + this.now.getMinutes()).substr(-2);
      this.formabsensi.type = title;
      this.formabsensi.latlong = (this.latitude!==undefined) ? this.latitude + ',' + this.longitude : '';
      this.formabsensi.chekpoint = this.address;
      this.formabsensi.iduser = 1;

      this.api.postAbsensi(this.formabsensi).then((data: any[])=> {
        console.log(data['Success'] + "; " + data['Msg']);
        // if(data['Success']==true){
          this.presentAlert(title, data['Msg']);
        // }
      }, (error)=>{
        console.log("Error with " + JSON.stringify(error));
      });

      // this.presentAlert(title, title + ' berhasil disimpan');
    } else {
      if(this.time < start){
        this.presentAlert(title, 'Belum Waktu ' + title);
      }
      if(this.time > end){

        this.formabsensi.tgl = this.now.toISOString().split('T')[0];
        this.formabsensi.time = this.now.getHours() + ":" + ("0" + this.now.getMinutes()).substr(-2);
        this.formabsensi.type = title;
        this.formabsensi.latlong = (this.latitude!==undefined) ? this.latitude + ',' + this.longitude : '';
        this.formabsensi.chekpoint = this.address;
        this.formabsensi.iduser = 1;
  
        this.api.postAbsensi(this.formabsensi).then((data: any[])=> {
          console.log(data['Success'] + "; " + data['Msg']);
          // if(data['Success']==true){
            this.presentAlert(title, title + ' Overtime');
          // }
        }, (error)=>{
          console.log("Error with " + JSON.stringify(error));
        });
      }
    }
  }

  formIjin(){
    this.navCtrl.push(FormijinPage);
  }

  formSakit(){
    this.navCtrl.push(FormsakitPage);
  }

  formCuti(){
    this.navCtrl.push(FormcutiPage);
  }

  goReport(){
    this.navCtrl.push(ReportPage);
  }

  presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  getAbsenTime(start, end){
    return this.getTimestamp(start) + "-" + this.getTimestamp(end);
  }

  getTimestamp(timestamp){
    var date  = new Date(timestamp),
      hours   = date.getHours(),
      minutes = date.getMinutes();

    return ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2);
  }

  // Paket : Basic, Bisnis, Pro
  getImage() {
    //Foto
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType:  this.camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 350,
      targetHeight: 350,
      saveToPhotoAlbum: false
      // allowEdit : true,
      // mediaType: this.camera.MediaType.PICTURE
    }
  
    this.camera.getPicture(options).then((imageData) => {
      let base64data = 'data:image/jpeg;base64,' + imageData;
      this.imageURI = base64data;

    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
      this.presentToast(err);
    });
  }

  uploadFile() {
    // console.log("imageURI:" + this.imageURI);
    this.showLoading();

    // setTimeout(() => {
    //   loader.dismiss();
    // }, 5000);

    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";

    const fileTransfer: FileTransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: "photo",
      fileName: newFileName,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {},
    }

    fileTransfer.upload(this.imageURI, this.api.UPLOAD_URL, options)
      .then((data) => {
      console.log("226_Image uploaded successfully:", data);
      // this.loading.dismiss();

      this.userData.photo = newFileName;
      // this.userData.type = this.checkIn;
      this.userData.checkpoint_in = 0;
      this.userData.checkpoint_out = 0;

      // if(this.checkIn==false){
      //   this.userData.checkpoint_in = this.checkinPoint;
      // } else {
      //   this.userData.checkpoint_out = this.checkinPoint;
      // }
      // console.log("397_userData", this.userData);

      this.api.absensiIn(this.userData).then(data => {
        console.log('402_absensiIn', data);
        if (data) {
          // reset
          this.imageURI = null;
          // if(this.userData.username){
          //   this.navCtrl.push(ListPage, {
          //     username: this.userData.username
          //   });
          // } else {
            this.presentToast(data);
          // }
        } else {
          this.showError("Absensi Gagal");
        }
      },error => {
        this.showError(error);
      });

    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: JSON.stringify(msg),
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true,
      enableBackdropDismiss: true,
      showBackdrop: true,
      duration: 2000
    });
    await this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
}
