import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class GiphyService {

  API_KEY = 'dc6zaTOxFJmzC';
  ENDPOINT = 'http://api.giphy.com/v1/gifs';

  constructor(public http: Http) {
    
  }

  search(query: string): Observable<any> {
    let params = new URLSearchParams();
    params.set('q', query);
    params.set('api_key', this.API_KEY);

    return this.http.get(`${this.ENDPOINT}/search`, {
      search: params
    }).map(res => res.json());
  }

  trending(): Observable<any> {
    let params = new URLSearchParams();
    params.set('api_key', this.API_KEY);

    return this.http.get(`${this.ENDPOINT}/trending`, {
      search: params
    }).map(res => res.json());
  }
}
