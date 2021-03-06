import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Camera} from '@ionic-native/camera';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Keyboard} from '@ionic-native/keyboard';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {Items} from '../mocks/providers/items';
import {Settings} from '../providers/providers';
import {User} from '../providers/providers';
import {Api} from '../providers/providers';
import {MyApp} from './app.component';
import {SwingModule} from 'angular2-swing';
import {ElasticModule} from 'ng-elastic';
import {ComponentsModule} from '../components/components.module';
import {DirectivesModule} from '../directives/directives.module';

import {AuthProvider} from '../providers/auth/auth';

import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import { UploadProvider } from '../providers/upload/upload';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {});
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    DirectivesModule,
    HttpClientModule,
    SwingModule,
    ElasticModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyA37P4SHH1W3k8kDGEhV-CWCf6VWUrsz0g",
      authDomain: "muil-app.firebaseapp.com",
      databaseURL: "https://muil-app.firebaseio.com",
      projectId: "muil-app",
      storageBucket: "muil-app.appspot.com",
      messagingSenderId: "856018502652"
    }),
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    SplashScreen,
    StatusBar,
    Keyboard,
    {provide: Settings, useFactory: provideSettings, deps: [Storage]},
    // Keep this to enable Ionic's runtime error handling during development
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    UploadProvider,
  ]
})
export class AppModule {
}
