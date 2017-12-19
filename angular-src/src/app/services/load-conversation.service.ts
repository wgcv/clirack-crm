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
	updateConversations(conversations, conversationUpdate){
		for (var i =0; i< conversationUpdate.docs.length; i++) {
			if(conversations.docs.length < 1){
				conversations.docs.push(conversationUpdate.docs[i]);
			}else{
				var exist = false;
				var position = 0;
				for (var j = 0; j < conversations.docs.length; j++) {
					if(conversationUpdate.docs[i].api.id === conversations.docs[j].api.id ){
						position = j;
						exist = true;
					}
				}
				if(this.dateFromISO8601(conversations.docs[0].lastTime).getTime() <= this.dateFromISO8601(conversationUpdate.docs[i].lastTime).getTime() ){
					if(exist){
						conversations.docs.splice(position, 1);
					}
					conversations.docs.unshift(conversationUpdate.docs[i]);
				}else{
					if(exist){
						conversations.docs.splice(position, 1);
					}
					conversations.docs.push(conversationUpdate.docs[i]);
				}

			}
		}
		if(conversations.page < conversationUpdate.page ){
			conversations.page = conversationUpdate.page;
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

	dateFromISO8601(isostr) {
    var parts = isostr.match(/\d+/g);
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
	}
}
