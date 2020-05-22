import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HttpClientModule } from '@angular/common/http';
import { ApiProvider } from '../providers/api/api';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FormijinPage } from '../pages/formijin/formijin';
import { FormsakitPage } from '../pages/formsakit/formsakit';
import { FormcutiPage } from '../pages/formcuti/formcuti';
import { ReportPage } from '../pages/report/report';

import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FormijinPage,
    FormsakitPage,
    FormcutiPage,
    ReportPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FormijinPage,
    FormsakitPage,
    FormcutiPage,
    ReportPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    LocationAccuracy,
    BackgroundGeolocation,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider
  ]
})
export class AppModule {}
