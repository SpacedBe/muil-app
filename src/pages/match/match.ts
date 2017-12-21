import {Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import {
  StackConfig,
  SwingStackComponent,
} from 'angular2-swing';

import {HttpClient} from '@angular/common/http';
import {Item} from '../../models/item';

@IonicPage()
@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {
  @ViewChild('myswing') swingStack: SwingStackComponent;
  @ViewChildren('mycards') swingCards: QueryList<any>;

  cards: Array<any>;
  stackConfig: StackConfig;
  recentCard: string = '';

  constructor(
    private http: HttpClient,
    private viewCtrl: ViewController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.stackConfig = {
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth / 2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchPage');
  }

  ngAfterViewInit() {
    // Either subscribe in controller or set in HTML
    // this.swingStack.throwin.subscribe((event: DragEvent) => {
    //   event.target.style.background = '#ffffff';
    // });
    //
    this.cards = [{email: ''}];
    this.addNewCards(1);
  }

// Called whenever we drag an element
  onItemMove(element, x, y, r) {
    var color = '';
    var abs = Math.abs(x);
    let min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    let hexCode = this.decimalToHex(min, 2);

    if (x < 0) {
      color = '#FF' + hexCode + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }

    element.style.background = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

// Connected through HTML
  voteUp(like: boolean) {
    let removedCard = this.cards.pop();
    this.addNewCards(1);
    if (like) {
      this.recentCard = 'You liked: ' + removedCard.email;
    } else {
      this.recentCard = 'You disliked: ' + removedCard.email;
    }
  }

// Add new cards to our array
  addNewCards(count: number) {
    this.http.get('https://randomuser.me/api/?results=' + count)
      .map((data: any) => data.results)
      .subscribe(result => {
        for (let val of result) {
          this.cards.push(val);
        }
      })
  }

// http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }

    return hex;
  }

  openProfile(item: Item) {
    this.navCtrl.push('ProfilePage', {
      item: item
    });
  }

  openList() {
    this.navCtrl.push('ListPage');
  }
}
