import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { Camera } from '@ionic-native/camera';
import { Http, HttpModule } from '@angular/http';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { Network } from '@ionic-native/network';
// import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularCropperjsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    ImagePicker,
    Base64,
    Network,
    SocialSharing,
    File,
    GoogleAnalytics
    
    
  ]
})
export class AppModule {}
