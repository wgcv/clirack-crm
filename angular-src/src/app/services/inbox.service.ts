import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { AuthService } from './auth.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import io from 'socket.io-client';

@Injectable()
export class InboxService {
    socket: any;
    constructor(private http: Http, private authService: AuthService ) {}

    getInbox(slug) {
        const headers = new Headers();
        this.authService.loadToken();
        headers.append('Authorization', this.authService.getToken());
        headers.append('Content-Type', 'application/json');
        return this.http.get('/api/communication/inbox/' + slug.toLowerCase(), {headers: headers}).map(data => data.json()[0]);

    }
    getInboxes() {
        const headers = new Headers();
        this.authService.loadToken();
        headers.append('Authorization', this.authService.getToken());
        headers.append('Content-Type', 'application/json');
        return this.http.get('/api/communication/inboxes/', {headers: headers}).map(data => data.json());

    }

    getInboxIO() {
        const observable = new Observable(observer => {
          this.socket = io.connect();
          this.socket.emit('subscribe', this.authService.getUser().id);
          this.socket.on('add inbox', (inbox) => {
            observer.next(inbox);
          });
          return () => {
            this.socket.disconnect();
          };
        });
        return observable;
      }
}
