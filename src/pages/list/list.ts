import {Component} from '@angular/core';
import {IonicPage, NavController, ViewController} from 'ionic-angular';
import {Item} from '../../models/item';
import {AuthProvider} from '../../providers/auth/auth';
import {Observable} from 'rxjs/Observable';

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  matches$ : Observable<any>;

  constructor(private auth: AuthProvider,
              public navCtrl: NavController,
              private viewCtrl: ViewController) {
  }

  ionViewCanEnter() {
    return this.auth.$loggedIn.filter(val => typeof val === 'boolean').take(1).toPromise();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.matches$ = this.auth.getMatches();
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }


  openMatch() {
    this.navCtrl.push('MatchPage');
  }

  openProfile(item: Item) {
    // this.navCtrl.push('ProfilePage', {
    //   item: item
    // });
  }


  openChat(convId) {
    this.navCtrl.push('MessagePage', {
      convId: convId
    });
  }
}
