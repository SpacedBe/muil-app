import {Component, ViewChild} from '@angular/core';
import {IonicPage, Content, NavParams} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';
import {Observable} from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  userId: any;
  messages: Observable<{}[]>;
  convId: any;
  typingMessage: string = '';

  showGiphy: boolean = false;

  @ViewChild(Content) content: Content;

  constructor(private navParams: NavParams, private auth: AuthProvider) {
    this.convId = navParams.get('convId');
    this.init();
  }

  init() {
    // TODO: can be an API response

  }

  ionViewCanEnter() {
    if(!this.convId) {
      return false;
    }

    return this.auth.$loggedIn.filter(val => typeof val === 'boolean').take(1).toPromise();
  }

  ionViewDidLoad() {
    this.userId = this.auth.uid;
    this.messages = this.auth.getMessages(this.convId);
    this.scrollBottom();
  }

  sendGif(imageUrl) {
    // this.messages.push({
    //   isMe: true,
    //   type: 'image',
    //   body: imageUrl,
    //   timestamp: 'Oct 13, 2017 9:53am'
    // });
    // this.scrollBottom();
    //
    // this.fakeReply();
  }

  sendText() {
    this.auth.sendTextMessage(this.convId, this.typingMessage);
  }

  scrollBottom() {
    this.content.resize();

    this.content.scrollTo(0, this.content.scrollHeight, 350);
  }

  toggleGiphy() {
    this.showGiphy = !this.showGiphy;
    this.content.resize();
  }
}
