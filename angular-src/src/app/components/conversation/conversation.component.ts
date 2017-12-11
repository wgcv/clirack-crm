import {  Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LoadConversationService } from '../../services/load-conversation.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
	@Input()  slug: string;
	inbox: any;
	conversations = {page:0, docs:[]};

 	constructor(private loadConversationService:LoadConversationService) { }

 	ngOnInit() {
 		this.loadConversationService.getInbox(this.slug).subscribe(inbox => {
			this.inbox = inbox;
			this.loadConversationService.getConversations(this.inbox, this.conversations).subscribe(conversations => {
				this.conversations = conversations;
				this.loadConversationService.loadConversationsFacebook(this.inbox, conversations,  {next:'', docs:[]}).subscribe(mixed => {
					console.log(mixed);
				},
				err => {
					console.log(err);
				});
			},
			err => {
				console.log(err);
			});
		},
		err => {
			console.log(err);
		});
 	}

 	onScrollDown(ev){
    console.log('scrolled down!!',ev);

 	}
 	onUp(ev){
    console.log('scrolled up!!', ev);

 	}
 	onScroll () {
	    console.log('scrolled!!');
	}
}
