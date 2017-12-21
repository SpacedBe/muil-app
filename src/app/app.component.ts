import {Component, ViewChild} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {TranslateService} from '@ngx-translate/core';
import {Config, Nav, Platform} from 'ionic-angular';

import {Settings} from '../providers/providers';
import * as firebase from 'firebase';
import {ListPage} from '../pages/list/list';
import {TutorialPage} from '../pages/tutorial/tutorial';

@Component({
  template: `
    <ion-nav #content [root]="rootPage"></ion-nav>
  `
})
export class MyApp {
  rootPage: any;

  @ViewChild(Nav) nav: Nav;

  constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();

    firebase.initializeApp({
      apiKey: "AIzaSyA37P4SHH1W3k8kDGEhV-CWCf6VWUrsz0g",
      authDomain: "muil-app.firebaseapp.com",
      databaseURL: "https://muil-app.firebaseio.com",
      projectId: "muil-app",
      storageBucket: "muil-app.appspot.com",
      messagingSenderId: "856018502652"
    });

    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.rootPage = 'TutorialPage';
        unsubscribe();
      } else {
        this.rootPage = 'ListPage';
        unsubscribe();
      }
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
