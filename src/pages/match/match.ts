import {Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import {
  StackConfig,
  SwingStackComponent,
} from 'angular2-swing';

import {HttpClient} from '@angular/common/http';
import {Item} from '../../models/item';
import {AuthProvider} from '../../providers/auth/auth';
import {AngularFirestore} from "angularfire2/firestore";

@IonicPage()
@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {
  @ViewChild('myswing') swingStack: SwingStackComponent;
  @ViewChildren('mycards') swingCards: QueryList<any>;

  stackConfig: StackConfig;
  recentCard: string = '';

  cards = [];

  loading = true;
  noMatches = false;

  constructor(private http: HttpClient,
              private auth: AuthProvider,
              private viewCtrl: ViewController,
              private afs: AngularFirestore,
              public navCtrl: NavController, public navParams: NavParams) {
    // card BS
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

  ionViewCanEnter() {
    return this.auth.$loggedIn.filter(val => typeof val === 'boolean').take(1).toPromise();
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  ionViewDidLoad() {
  }

  ngAfterViewInit() {
    this.addNewCards();
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

    console.log(element);

    element.style.background = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

// Connected through HTML
  voteUp(value: boolean) {
    let removedCard = this.cards.pop();

    this.auth.likeDisLike(removedCard.id, value)
      .map((data) => data.json())
      .subscribe((res: any) => {
        console.log(res);

        if (res.match) {
          alert('you have a new match!');
        }

        this.addNewCards();
      });
  }

// Add new cards to our array
  addNewCards() {
    this.auth.getMatch()
      .map((data) => data.json())
      .subscribe(result => {
        this.cards.push(result);
      }, () => {
        this.noMatches = true;
      });
  }

  // move to helper
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
    this.navCtrl.push('ProfilePage', {item});
  }

  openList() {
    this.navCtrl.push('ListPage');
  }
}
