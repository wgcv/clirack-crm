import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthService } from './auth.service';

@Injectable()
export class LoadMessageService {

	constructor(private http:Http, private authService:AuthService ) {}
	getMessages(conversations, messages){
		var page = 1;
		let headers = new Headers();
		this.authService.loadToken();
		headers.append('Authorization', this.authService.getToken());
		headers.append('Content-Type','application/json');
		return this.http.get('/api/communication/'+conversations._id+'/messages?page='+page,{headers:headers}).map(data => {
			
			return this.updateConversations(messages,data.json());
			
		});

	}
	getMoreMessages(conversations, messages){
		var page = parseInt(messages.page)+1;
		let headers = new Headers();
		this.authService.loadToken();
		headers.append('Authorization', this.authService.getToken());
		headers.append('Content-Type','application/json');
		return this.http.get('/api/communication/'+conversations._id+'/messages?page='+page,{headers:headers}).map(data => {
			return this.updateConversations(messages,data.json());

		});
	}
	updateConversations(messages, messagesUpdate){
		var wasUpdate = false;
		for (var j =0; j< messagesUpdate.docs.length; j++) {
			var notExist = true;
			for (var i =0; i< messages.docs.length; i++) {
				if(messagesUpdate.docs[j].id === messages.docs[i].id ){
					notExist = false;
					wasUpdate = true;
				}
			}
			if(notExist){
				messages.docs.push(messagesUpdate.docs[j]);
			}	
		}
		messages.docs.sort(function (a, b) {
  			return Date.parse(a.time) - Date.parse(b.time);
		});
		if(messagesUpdate.pages > messages.page){
			messages.page = parseInt(messagesUpdate.page);
		}

		return [messages, wasUpdate];
	}
	sendMessage(messages, message, conversation){
		let headers = new Headers();
		this.authService.loadToken();
		headers.append('Authorization', this.authService.getToken());
		headers.append('Content-Type','application/json');
		return this.http.post('/api/communication/'+conversation._id+'/messages', message,{headers:headers}).map(data => {
			return this.updateConversations(messages,{page:0, docs:[data.json()]});
		});
	}

}
