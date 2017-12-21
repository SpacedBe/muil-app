import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchPage } from './match';
import {SwingModule} from 'angular2-swing';

@NgModule({
  declarations: [
    MatchPage,
  ],
  imports: [
    SwingModule,
    IonicPageModule.forChild(MatchPage),
  ],
})
export class MatchPageModule {}
