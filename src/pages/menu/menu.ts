import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Router, RouterEvent } from '@angular/router';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage implements OnInit {
  activePath = '';

  pages = [
    {
      name: 'Login',
      path: '/menu/login'
    },
    {
      name: 'Register',
      path: '/menu/register'
    },
    {
      name: 'Home',
      path: '/menu/home'
    },
    {
      name: 'Contact',
      path: '/menu/contact'
    }
  ]
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url
    })
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

}
