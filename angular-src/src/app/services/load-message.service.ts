import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthService } from './auth.service';
import io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoadMessageService {
    socket: any;

    constructor(private http: Http, private authService: AuthService ) {}
    getMessages(conversations, messages) {
        const page = 1;
        const headers = new Headers();
        this.authService.loadToken();
        headers.append('Authorization', this.authService.getToken());
        headers.append('Content-Type', 'application/json');
        return this.http.get('/api/communication/' + conversations._id + '/messages?page=' + page, { headers: headers}).map(data => {
            return this.updateConversations(messages, data.json());
        });
    }
    getMoreMessages(conversations, messages) {
        // tslint:disable-next-line:radix
        const page = parseInt(messages.page) + 1;
        const headers = new Headers();
        this.authService.loadToken();
        headers.append('Authorization', this.authService.getToken());
        headers.append('Content-Type', 'application/json');
        return this.http.get('/api/communication/' + conversations._id + '/messages?page='+ page,{ headers: headers}).map(data => {
            return this.updateConversations(messages, data.json());
        });
    }
    updateConversations(messages, messagesUpdate) {
        let wasUpdate = false;
        for (let j = 0; j < messagesUpdate.docs.length; j++) {
            let notExist = true;
            for (let i = 0; i < messages.docs.length; i++) {
                if ( messagesUpdate.docs[j].id === messages.docs[i].id ) {
                    notExist = false;
                    wasUpdate = true;
                }
            }
            if (notExist) {
                messages.docs.push(messagesUpdate.docs[j]);
            }
        }
        messages.docs.sort(function (a, b) {
              return Date.parse(a.time) - Date.parse(b.time);
        });
        if (messagesUpdate.pages > messages.page) {
            // tslint:disable-next-line:radix
            messages.page = parseInt(messagesUpdate.page);
        }

        return [messages, wasUpdate];
    }
    sendMessage(messages, message, conversation) {
        const headers = new Headers();
        this.authService.loadToken();
        headers.append('Authorization', this.authService.getToken());
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/communication/' + conversation._id + '/messages', message, {headers: headers}).map(data => {
            return this.updateConversations(messages, {page: 0, docs: [data.json()]});
        });
    }

    getMessageIO(conversations) {
        const observable = new Observable(observer => {
          this.socket = io.connect();
          this.socket.emit('subscribe', conversations._id);
          this.socket.on('new message', (message) => {
            observer.next(message);
          });
          return () => {
            this.socket.disconnect();
          };
        });
        return observable;
      }
}
