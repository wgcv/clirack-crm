import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/take';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import {tokenNotExpired} from 'angular2-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class LoadConversationService {
	inboxes: any;

	constructor(private http:Http, private authService:AuthService ) {
	}

	getInbox(slug){
		let headers = new Headers();
		this.authService.loadToken();
		headers.append('Authorization', this.authService.getToken());
		headers.append('Content-Type','application/json');
		return this.http.get('/api/communication/inbox/'+slug.toLowerCase(), {headers:headers}).map(data => data.json()[0])

	}

	getConversations(inbox, conversations){
		var page = conversations.page+1;
		let headers = new Headers();
		this.authService.loadToken();
		headers.append('Authorization', this.authService.getToken());
		headers.append('Content-Type','application/json');
		return this.http.get('/api/communication/'+inbox._id+'/conversations?page='+page,{headers:headers}).map(data => {
			if(data.json().pages > conversations.page){
				conversations.page = page;
				return this.updateConversations(conversations,data.json());
			}else{
				return conversations;
			}
		});

	}
	readConversation(conversations, conversation){
		let headers = new Headers();
		this.authService.loadToken();
		headers.append('Authorization', this.authService.getToken());
		headers.append('Content-Type','application/json');
		return this.http.post('/api/communication/'+conversation._id+'/read', conversation,{headers:headers}).map(data => {
			return this.updateConversations(conversations, {page:0, docs:[data.json()]});
		});
	}

	updateConversations(conversations, conversationUpdate){
		for (var j =0; j< conversationUpdate.docs.length; j++) {
			var notExist = true;
			for (var i =0; i< conversations.docs.length; i++) {
				if(conversationUpdate.docs[j].api.id === conversations.docs[i].api.id ){
					conversations.docs.splice(i, 1);
					notExist = false;
				}
			}

				conversations.docs.push(conversationUpdate.docs[j]);
			
		}
		conversations.docs.sort(function (a, b) {
  			return  Date.parse(b.lastTime) - Date.parse(a.lastTime);
		});
		if(conversationUpdate.page > conversations.page){
			conversations.page = parseInt(conversationUpdate.page);
		}

		return conversations;
	}

	getInboxes(){
		let headers = new Headers();
		this.authService.loadToken();
		headers.append('Authorization', this.authService.getToken());
		headers.append('Content-Type','application/json');
		this.http.get('/api/communication/inboxes',{headers:headers}).subscribe(data => {
			this.inboxes = data.json();
		});
	}

}
