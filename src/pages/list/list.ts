import {Component} from '@angular/core';
import {IonicPage, NavController, ViewController} from 'ionic-angular';
import {Item} from '../../models/item';
import {Items} from '../../mocks/providers/items';

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
  currentItems: Item[];

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    public items: Items) {
    this.currentItems = this.items.query();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  openProfile(item: Item) {
    this.navCtrl.push('ProfilePage', {
      item: item
    });
  }

  openMatch() {
    this.navCtrl.push('MatchPage');
  }

  openChat(item: Item) {
    this.navCtrl.push('MessagePage', {
      item: item
    });
  }
}
