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
		return this.http.get('/api/communication/inbox/'+slug, {headers:headers}).map(data => data.json()[0])

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
				conversations.docs = conversations.docs.concat(data.json().docs);
				return conversations;
			}else{
				return conversations;
			}
		});

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

	

	mixConversationFacebook(inbox, conversations, conversationsOutside){
		var wasUpdate = false;
		let headers = new Headers();
		this.authService.loadToken();
		headers.append('Authorization', this.authService.getToken());
		headers.append('Content-Type','application/json');
			for (var i = 0; i < conversationsOutside.docs.length; i++) {
				var exist = false;
				for (var j = 0; j < conversations.docs.length; j++) {
					if( conversationsOutside.docs[i].api.id === conversations.docs[j].api.id){
						exist = true;
					}
				}
				if(!exist){
					wasUpdate = true;
					let conversationOutside = conversationsOutside.docs[i];
					this.http.post('/api/communication/'+inbox._id+'/conversations',conversationOutside ,{headers:headers}).subscribe({ error: e => console.error(e) });
				}
			}
		
		return wasUpdate;
	}
	loadConversationsFacebook(inbox, conversations, conversationsfb){
		return this.getConversationsFacebook(inbox, conversationsfb).map(conversationsfb => {
			return this.getConversations(inbox,conversations).map(conversations => {
				var mixed = this.mixConversationFacebook(inbox, conversations, conversationsfb);
				if(conversationsfb.next != '' &&  mixed) {
					return this.loadConversationsFacebook(inbox, conversations, conversationsfb).map(data=>{return data});
				} else {
					return conversationsfb;
				}
			});

		});
	}


	getConversationsFacebook(inbox, conversations){
		if( conversations.next == '' ){
			return this.http.get('https://graph.facebook.com/'+inbox.user+'/conversations?fields=id,participants,link,unread_count,messages.limit(1){message,created_time}&limit=10&access_token='+inbox.token).map(data => {
				conversations.docs = [];
				data.json().data.forEach(function(element){
					var conversation = {
						inbox: inbox._id,
						name: element.participants.data[0].name,
						unread: element.unread_count,
						preview: element.messages.data[0].message,
						lastTime: element.messages.data[0].created_time,
						api:{
							id: element.id,
							participantId: element.participants.data[0].id,
							link: 'https://facebook.com'+ element.link
						}
					};
					conversations.docs.push(conversation);
					if(data.json().paging.next){
						conversations.next = data.json().paging.next;
					}else{
						conversations.next = '';
					}
				});
				return conversations;
			});	
		}else{
			return this.http.get(conversations.next).map(data => {
				conversations.docs = [];
				data.json().data.forEach(function(element){
					var conversation = {
						inbox: inbox._id,
						name: element.participants.data[0].name,
						unread: element.unread_count,
						preview: element.messages.data[0].message,
						lastTime: element.messages.data[0].created_time,
						api:{
							id: element.id,
							participantId: element.participants.data[0].id,
							link: 'https://facebook.com'+ element.link
						}
					};
					conversations.docs.push(conversation);
					if(data.json().paging.next){
						conversations.next = data.json().paging.next;
					}else{
						conversations.next = '';
					}

				});

				return conversations;
			});	

		}
	}

}
