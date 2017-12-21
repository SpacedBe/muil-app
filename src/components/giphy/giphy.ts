import { Component, Output, EventEmitter } from '@angular/core';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { GiphyService } from './giphy.service';

@Component({
  selector: 'giphy',
  templateUrl: 'giphy.html',
  providers: [GiphyService]
})
export class GiphyComponent {
  @Output() onSelect = new EventEmitter();
  @Output() onClose = new EventEmitter();

  gifs: any[];
  isGiphyLoading: boolean = false;
  giphyQuery: string = '';
  queryControl = new FormControl();

  constructor(public GiphyService: GiphyService) {
    this.getTrending();

    this.queryControl.valueChanges
      .debounceTime(1000)
      .subscribe(newValue => newValue ? this.searchGif(newValue) : this.getTrending());

  }

  getTrending() {
    this.isGiphyLoading = true;
    this.GiphyService.trending()
      .subscribe((res) => {
        this.gifs = res.data;
        this.isGiphyLoading = false;
      })
  }

  searchGif(query: string) {
    this.isGiphyLoading = true;
    this.GiphyService.search(query)
      .subscribe((res) => {
        this.gifs = res.data;
        this.isGiphyLoading = false;
      })
  }

  select(gif) {
    this.onSelect.emit(gif.images.fixed_height_small.url);
  }

  close() {
    this.queryControl.reset();
    this.onClose.emit();
  }
}
