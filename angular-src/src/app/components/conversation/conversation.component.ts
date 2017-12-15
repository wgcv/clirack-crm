import {  Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LoadConversationService } from '../../services/load-conversation.service';
import {Observable} from "rxjs/Observable";
import {AnonymousSubscription} from "rxjs/Subscription";
import 'rxjs/add/observable/timer';

@Component({
	selector: 'app-conversation',
	templateUrl: './conversation.component.html',
	styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
	@Input()  slug: string;
	inbox: any;
	conversations = {page:0, docs:[]};
	loading = false;
    private timerSubscription: AnonymousSubscription;

	constructor(private loadConversationService:LoadConversationService) { }

	ngOnInit() {
		this.loadConversationService.getInbox(this.slug).subscribe(inbox => {
			this.inbox = inbox;
			this.loadConversations({page:0, docs:[]},{next:'', docs:[]});
		},
		err => {
			console.log(err);
		});
	}
	suscribeToConversations(){
		this.timerSubscription = Observable.timer(5000).subscribe(() => this.loadConversations({page:0, docs:[]},{next:'', docs:[]}));

	}

	loadConversations(conversations, fbConversation) {
		this.loading = true;
		this.loadConversationService.getConversations(this.inbox, conversations).subscribe(conversations => {
			this.loadConversationService.getConversationsFacebook(this.inbox, fbConversation).subscribe(fbConversation => {
				var mixed = this.loadConversationService.mixConversationFacebook(this.inbox, conversations, fbConversation);
				if(fbConversation.next != '' &&  mixed) {
					this.loadConversations(conversations, fbConversation);
					this.conversations = conversations;
				}else{
					this.loading = false
					this.suscribeToConversations()
				}
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
		if(this.loading == false) {
			this.loading = true;
			this.loadConversationService.getConversations(this.inbox, this.conversations).subscribe(conversations => {
				console.log(conversations);
				this.conversations = conversations;
				this.loading = false;
			},
			err => {
				console.log(err);
			});
		}
	}
}
