import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

require('firebase/firestore');

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  public $userProfile = new BehaviorSubject(undefined);
  public $loggedIn = new BehaviorSubject(undefined);

  public uid;

  constructor(public http: Http,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.$loggedIn.next(true);

        this.uid = user.uid;

        afs.doc<any>(`users/${user.uid}`)
          .valueChanges()
          .subscribe((profile) => {
            this.$userProfile.next({
              ...profile,
              uid: user.uid,
            });
          });
      } else {
        this.$loggedIn.next(false);

        this.$userProfile.next(undefined);
      }
    });
  }

  createUser(username: string, tagLine: string, picture: string): Promise<any> {
    return this.afAuth.auth
      .signInAnonymously()
      .then(newUser => {
        // if this fails, signout & remove user
        return this.afs.collection('users').doc(newUser.uid).set({username, tagLine, picture});
      });
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  getMatch() {
    return this.afAuth.idToken
      .take(1)
      .switchMap((token) => {
        return this.http.get('http://localhost:5000/muil-app/us-central1/getMatch?token=' + token);
      })
      .take(1);
  }

  getMatches() {
    return this.afs.collection('users').doc(this.uid).collection('matches').valueChanges();
  }

  likeDisLike(userId, value) {
    return this.afAuth.idToken
      .take(1)
      .switchMap((token) => {
        return this.http.get(`http://localhost:5000/muil-app/us-central1/likeDisLike?token=${token}&value=${value}&userId=${userId}`);
      })
      .take(1);
  }
}
