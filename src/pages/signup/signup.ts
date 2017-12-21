import {Component, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  IonicPage, LoadingCmp, LoadingController, NavController,
  ToastController
} from 'ionic-angular';

import {User} from '../../providers/providers';
import {MainPage} from '../pages';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Camera} from '@ionic-native/camera';
import {AuthProvider} from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  public form: FormGroup;

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder,
              public camera: Camera,
              public translateService: TranslateService,
              public auth: AuthProvider) {
    this.form = formBuilder.group({
      username: ['', Validators.required],
      tagLine: [''],
      profilePicture: ['']
    });

    this.translateService.get('SIGNUP_ERROR')
      .subscribe((value) => {
        this.signupErrorString = value;
      })
  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({'profilePicture': 'data:image/jpg;base64,' + data});
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();

    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({'profilePicture': imageData});
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePicture'].value + ')'
  }

  doSignup() {
    if (!this.form.valid) {
      return;
    }

    let loading = this.loadingCtrl.create();

    // Attempt to login in through our User service
    this.auth.createUser(this.form.value.username, this.form.value.tagLine)
      .then(() => {
        loading.dismiss()
          .then(() => this.navCtrl.push(MainPage));
      }, () => {
        loading.dismiss()
          .then(() => {
            let toast = this.toastCtrl.create({
              message: this.signupErrorString,
              duration: 3000,
              position: 'top'
            });

            toast.present();
          });

      })

    loading.present();
  }
}
