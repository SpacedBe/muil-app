import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public http: Http) {
  }

  createUser(username: string, tagLine: string): Promise<any> {
    return firebase
      .auth()
      .signInAnonymously()
      .then(newUser => {
        return firebase
          .database()
          .ref('/userProfile')
          .child(newUser.uid)
          .set({username, tagLine});
      });
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }
}
