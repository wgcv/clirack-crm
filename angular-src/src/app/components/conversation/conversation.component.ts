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
	@Output() conversation = new EventEmitter();
	inbox: any;
	conversations = {page:0, docs:[]};
	loading = false;
	firstTime = true;
	private timerSubscription: AnonymousSubscription;

	constructor(private loadConversationService:LoadConversationService) { }

	ngOnInit() {
		this.loadConversationService.getInbox(this.slug).subscribe(inbox => {
			this.inbox = inbox;
			this.loadConversations();
		},
		err => {
			console.log(err);
		});
	}
	checkConversations(){
		this.timerSubscription = Observable.timer(7000).subscribe(
			() => {
				this.loadConversations()
			}
		);

	}
	loadConversations(){
		this.loadConversationService.getConversations(this.inbox,  {page:0, docs:[]}).subscribe(conversations =>{
			this.conversations = this.loadConversationService.updateConversations(this.conversations, conversations);
			if(this.firstTime && (conversations.docs.length > 0)){
				this.firstTime = false;
				this.conversation.emit(conversations.docs[0]);
			}
			this.checkConversations();

		},
		error => {
				this.checkConversations();
			});
	}
	click($event, conversation){
		this.conversation.emit(conversation);
	}
	onScrollDown(ev){
		if(this.loading == false) {
			this.loading = true;
			this.loadConversationService.getConversations(this.inbox, this.conversations).subscribe(conversations => {
				this.conversations = conversations;
				this.loading = false;
			},
			err => {
				console.log(err);
			});
		}
	}
}
