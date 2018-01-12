import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/take';

import 'rxjs/add/observable/empty';
import {tokenNotExpired} from 'angular2-jwt';
import { AuthService } from './auth.service';
import io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoadConversationService {
    socket: any;

    constructor(private http: Http, private authService: AuthService ) {
    }

    getConversations(inbox, conversations) {
        const page = conversations.page + 1;
        const headers = new Headers();
        this.authService.loadToken();
        headers.append('Authorization', this.authService.getToken());
        headers.append('Content-Type', 'application/json');
        return this.http.get('/api/communication/' + inbox._id + '/conversations?page=' + page, {headers: headers}).map(data => {
            if (data.json().pages > conversations.page) {
                conversations.page = page;
                return this.updateConversations(conversations, data.json());
            }else {
                return conversations;
            }
        });

    }
    readConversation(conversations, conversation) {
        const headers = new Headers();
        this.authService.loadToken();
        headers.append('Authorization', this.authService.getToken());
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/communication/' + conversation._id + '/read', conversation, {headers: headers}).map(data => {
            return this.updateConversations(conversations, {page: 0, docs: [data.json()]});
        });
    }

    updateConversations(conversations, conversationUpdate) {
        for (let j = 0; j < conversationUpdate.docs.length; j++) {
            let notExist = true;
            for (let i = 0; i < conversations.docs.length; i++) {
                if (conversationUpdate.docs[j].api.id === conversations.docs[i].api.id ) {
                    conversations.docs.splice(i, 1);
                    notExist = false;
                }
            }
                conversations.docs.push(conversationUpdate.docs[j]);
        }
        conversations.docs.sort(function (a, b) {
              return  Date.parse(b.lastTime) - Date.parse(a.lastTime);
        });
        if (conversationUpdate.page > conversations.page) {
            conversations.page = parseInt(conversationUpdate.page);
        }
        return conversations;
    }
    getConversationIO(inbox) {
        const observable = new Observable(observer => {
          this.socket = io.connect();
          this.socket.emit('subscribe', inbox._id);
          this.socket.on('new conversation', (conversatiion) => {
            observer.next(conversatiion);
          });
          return () => {
            this.socket.disconnect();
          };
        });
        return observable;
      }
}
