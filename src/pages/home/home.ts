import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
// import { Geocodio } from 'geocodio-library-node';

import { HttpClient } from '@angular/common/http';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  address: string;
 
  latitude: number;
  longitude: number;

  geocoder;
  api_key: string = '62be5e223e43bbd5664ddd6523d5d5b5d64c226';

  now = new Date();
  time = this.now.getHours() * 60 + this.now.getMinutes();

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, public httpClient: HttpClient) {
    // this.geocoder = new Geocodio('62be5e223e43bbd5664ddd6523d5d5b5d64c226');
  }
  
  ngOnInit() {
    this.loadMap();
  }

  loadMap() {

    var options = {
      enableHighAccuracy: true,
      maximumAge : 60000,
      timeout : 10000
    };

    // var onSuccess = function(position) {
    //   console.log(position);
    // }
    
    // var onError = function(error){
    //   console.log(error);
    // }

    this.geolocation.getCurrentPosition(options).then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      this.getAddressFromCoords(this.latitude, this.longitude);

      // let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      // let mapOptions = {
      //   center: latLng,
      //   zoom: 15,
      //   mapTypeId: google.maps.MapTypeId.ROADMAP
      // }

      // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      //  this.map.addListener('dragend', () => { 
      //   this.latitude = this.map.center.lat();
      //   this.longitude = this.map.center.lng();
      //    // this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      // });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    // console.log("getAddressFromCoords " + lattitude + " " + longitude);

    // this.geocoder = this.httpClient.get('https://api.geocod.io/v1.4/reverse?q='+lattitude+','+longitude+'&api_key='+this.api_key);
    // this.geocoder.subscribe(data => {
    //   console.log('my data: ', data);
    // });

    // if(localStorage.getItem(lattitude+'_'+longitude) === null) {
    //   let result = JSON.parse(localStorage.getItem('Geocode_' + lattitude+'_'+longitude) || '{}');
    //   console.log("getAddressFromCoords localStorage", JSON.stringify(result));

    //   this.address = result.subLocality + ", "+result.locality + ", "+result.subAdministrativeArea + ", "+result.postalCode + ", "+result.administrativeArea;
      this.address = "Tempel, Kecamatan Krian, Kabupaten Sidoarjo";

    // } else {

      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      
      // Ionic 3
      this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        console.log("getAddressFromCoords reverseGeocode");
        // {"latitude":-7.3841432,"longitude":112.59291119999999,"countryCode":"ID","countryName":"Indonesia","postalCode":"61262","administrativeArea":"Jawa Timur","subAdministrativeArea":"Kabupaten Sidoarjo","locality":"Kecamatan Krian","subLocality":"Tempel","thoroughfare":"","subThoroughfare":"","areasOfInterest":["Bakalan"]}
        localStorage.setItem('Geocode_' + lattitude+'_'+longitude, JSON.stringify(result[0]));
        this.address = result[0].subLocality + ", "+result[0].locality + ", "+result[0].subAdministrativeArea + ", "+result[0].postalCode + ", "+result[0].administrativeArea;

      })
      .catch((error: any) => {
        console.log(error)
      });

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

  absenPagi(){
    // 08:30-08:40
    var start = 8 * 60 + 30;
    var end   = 8 * 60 + 40;

    console.log(this.now.getHours() + ":" + this.now.getMinutes());

    var title = 'Absen Pagi';
    if(this.time >= start && this.time < end){
      this.presentAlert(title, title + ' berhasil disimpan');
    } else {
      if(this.time < start){
        this.presentAlert(title, 'Belum Waktu ' + title);
      }
      if(this.time > end){
        this.presentAlert(title, title + ' Terlambat');
      }
    }
  }

  absenSiang(){
    // 12:00-13:00
    var start = 12 * 60;
    var end   = 13 * 60;

    console.log(this.now.getHours() + ":" + this.now.getMinutes());
    
    var title = 'Absen Siang';
    if(this.time >= start && this.time < end){
      this.presentAlert(title, title + ' berhasil disimpan');
    } else {
      if(this.time < start){
        this.presentAlert(title, 'Belum Waktu ' + title);
      }
      if(this.time > end){
        this.presentAlert(title, title + ' Terlambat');
      }
    }
  }

  absenPulang(){
    // 16:30-18:00
    var start = 16 * 60 + 30;
    var end   = 18 * 60;

    console.log(this.now.getHours() + ":" + this.now.getMinutes());
    
    var title = 'Absen Pulang';
    if(this.time >= start && this.time < end){
      this.presentAlert(title, title + ' berhasil disimpan');
    } else {
      if(this.time < start){
        this.presentAlert(title, 'Belum Waktu ' + title);
      }
      if(this.time > end){
        this.presentAlert(title, title + ' Terlambat');
      }
    }
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
