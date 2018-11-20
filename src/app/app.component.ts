import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private ga: GoogleAnalytics) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.ga.startTrackerWithId('UA-129493547-1', 30)
      .then(() => {
          this.ga.setAllowIDFACollection(true);
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }
}

