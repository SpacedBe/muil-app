import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable()
export class UploadProvider {

  constructor() {
    console.log('Hello UploadProvider Provider');
  }

  private basePath: string = '/uploads';

  upload(upload: any, form = true) {
    let storageRef = firebase.storage().ref();
    let uploadTask;

    if (form) {
      uploadTask = storageRef.child(`${this.basePath}/${upload.name}`).put(upload);
    } else {
      uploadTask = storageRef.child(`${this.basePath}/${upload.name}`).putString(upload.base64);
    }

    return new Promise((resolve, reject) => {
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: any) => {
          // uploadProvider in progress
          upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          reject(error);
        },
        () => {
          // uploadProvider success
          upload.url = uploadTask.snapshot.downloadURL;

          resolve(upload);
        }
      );
    })


  }
}
