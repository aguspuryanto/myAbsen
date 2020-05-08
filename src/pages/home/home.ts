import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

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
  
  constructor(public navCtrl: NavController, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {

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

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
       this.map.addListener('dragend', () => { 
        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();
         // this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    
    // Ionic 3
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
    .then((result: NativeGeocoderReverseResult[]) => {
      console.log(JSON.stringify(result[0]))
    })
    .catch((error: any) => {
      console.log(error)
    });

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
  
}
