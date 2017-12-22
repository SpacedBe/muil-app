import {Component, ViewChild} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {TranslateService} from '@ngx-translate/core';
import {Config, Nav, Platform} from 'ionic-angular';

import {Settings} from '../providers/providers';

import {AngularFireAuth} from 'angularfire2/auth';
import {AuthProvider} from '../providers/auth/auth';

@Component({
  template: `
    <ion-nav #content [root]="rootPage"></ion-nav>
  `
})
export class MyApp {
  rootPage: any;

  @ViewChild(Nav) nav: Nav;

  constructor(public afAuth: AngularFireAuth,
              private translate: TranslateService,
              platform: Platform, settings: Settings,
              private config: Config,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private auth: AuthProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();

    afAuth.authState.take(1).subscribe(user => {
      if (user) {
        this.rootPage = 'MatchPage';
      } else {
        this.rootPage = 'TutorialPage';
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
