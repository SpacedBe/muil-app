import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { GiphyComponent } from './giphy/giphy';
import { NlbrPipe } from './giphy/nlbr.pipe';

@NgModule({
	declarations: [GiphyComponent, NlbrPipe],
	imports: [
		HttpModule,
		IonicModule.forRoot(GiphyComponent)
	],
	entryComponents: [
		GiphyComponent
	],
	exports: [GiphyComponent, NlbrPipe]
})
export class ComponentsModule {}
