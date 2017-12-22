import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase/app';

@Injectable()
export class UploadProvider {

  constructor() {
    console.log('Hello UploadProvider Provider');
  }

  private basePath: string = '/uploads';

  upload(upload: any) {
    let storageRef = firebase.storage().ref();

    let uploadTask = storageRef.child(`${this.basePath}/${upload.name}`).put(upload);

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
