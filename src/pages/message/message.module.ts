import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagePage } from './message';
import {ComponentsModule} from '../../components/components.module';
import {DirectivesModule} from '../../directives/directives.module';

@NgModule({
  declarations: [
    MessagePage,
  ],
  imports: [
    ComponentsModule,
    DirectivesModule,
    IonicPageModule.forChild(MessagePage),
  ],
})
export class MessagePageModule {}
