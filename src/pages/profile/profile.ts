import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Items} from '../../mocks/providers/items';
import {AuthProvider} from '../../providers/auth/auth';
import {Observable} from 'rxjs/Observable';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profile$: Observable<{}>;
  userId: any;

  constructor(public navParams: NavParams, private auth: AuthProvider) {
    this.userId = navParams.get('userId');
  }

  ionViewDidLoad() {
    this.profile$ = this.auth.getProfile(this.userId);
  }

  ionViewCanEnter() {
    if (!this.userId) {
      return false;
    }

    return this.auth.$loggedIn.filter(val => typeof val === 'boolean').take(1).toPromise();
  }
}
