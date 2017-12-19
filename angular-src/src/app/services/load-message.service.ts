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
				messages = data.json();
				messages.page = page;
				messages.docs = messages.docs.reverse();
				return messages;
			
		});

	}
	getMoreMessages(conversations, messages){
		var page = messages.page+1;
		let headers = new Headers();
		this.authService.loadToken();
		headers.append('Authorization', this.authService.getToken());
		headers.append('Content-Type','application/json');
		return this.http.get('/api/communication/'+conversations._id+'/messages?page='+page,{headers:headers}).map(data => {
			if(data.json().pages > messages.page){
				messages.page = page;
				return this.updateConversations(messages,data.json());
			}else{
				return messages;
			}
		});
	}
	
	updateConversations(messages, messagesUpdate){
		for (var i =0; i< messagesUpdate.docs.length; i++) {
			if(messages.docs.length < 1){
				messages.docs.push(messagesUpdate.docs[i]);
			}else{
				var exist = false;
				var position = 0;
				for (var j = 0; j < messages.docs.length; j++) {
					if(messagesUpdate.docs[i].id === messages.docs[j].id ){
						position = j;
						exist = true;
					}
				}
				if(this.dateFromISO8601(messages.docs[0].time).getTime() >= this.dateFromISO8601(messagesUpdate.docs[i].time).getTime() ){
					if(exist){
						messages.docs.splice(position, 1);
					}
					messages.docs.unshift(messagesUpdate.docs[i]);

				}else{
					if(exist){
						messages.docs.splice(position, 1);
					}
					messages.docs.push(messagesUpdate.docs[i]);

				}

			}
		}
		if(messages.page < messagesUpdate.page ){
			messages.page = messagesUpdate.page;
		}
		return messages;

	}
	dateFromISO8601(isostr) {
   		var parts = isostr.match(/\d+/g);
    	return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
	}
}
