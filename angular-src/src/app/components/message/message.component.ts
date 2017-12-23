import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import { LoadMessageService } from '../../services/load-message.service';
import {Observable} from "rxjs/Observable";
import {AnonymousSubscription} from "rxjs/Subscription";
import {NgForm} from '@angular/forms';
import { FlashMessageService } from '../../services/flash-message.service';
import { LoadConversationService } from '../../services/load-conversation.service';

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
	@ViewChild('messageScroll') private messageScroll: ElementRef;
	private _conversation = {name:'', api:{link:''}};
	loading = false;
	private timerSubscription: AnonymousSubscription;
	messages = {page:0, docs:[]};
	newMessage = '';
	@Input()
	set conversation(conversation: any) { 
		if(conversation){
			this._conversation = conversation; 
			this.messages = {page:0, docs:[]};
			this.loadMessageInit();

		}
	}
	get conversation(): any { return this._conversation; }
	constructor(private loadMessageService:LoadMessageService,private loadConversationService:LoadConversationService,
		private flashMessageService: FlashMessageService) { }

	ngOnInit() {

	}
	loadMessageInit(){
		this.loadMessageService.getMessages(this.conversation , this.messages).subscribe(messages => {
			this.messages = messages[0];
			setTimeout(() => this.scrollToBottom(), 100)
			this.checkMessages();
		});

	}
	loadMessage(){
		this.loadMessageService.getMessages(this.conversation , this.messages).subscribe(messages => {
			if((this.messageScroll.nativeElement.scrollHeight - this.messageScroll.nativeElement.scrollTop) === this.messageScroll.nativeElement.clientHeight) {
				this.messages = messages[0];
				
				setTimeout(() => this.scrollToBottom(), 100)
			}else{
				this.messages = messages[0];
			}
			if(messages[1]){
				this.loadConversationService.readConversation({page:0, docs:[]}, this.conversation).subscribe(conversations =>{
				});
				}
			this.checkMessages();

		},
		err => {
			console.log('Can\'t load new messages');
			this.checkMessages();
		});

	}
	checkMessages(){
		this.timerSubscription = Observable.timer(7000).subscribe(
			() => {
				this.loadMessage()
			}
			);

	}
	scrollToBottom(): void {
		try {
			this.messageScroll.nativeElement.scrollTop = this.messageScroll.nativeElement.scrollHeight;

		} catch(err) {console.log(err); }                 
	}
	scrollToStay(scrollHeight): void {
		try {
			this.messageScroll.nativeElement.scrollTop = this.messageScroll.nativeElement.scrollHeight - scrollHeight;

		} catch(err) {console.log(err); }                 
	}
	onUp(ev) {
		var page = this.messages.page;
		var scrollHeight = this.messageScroll.nativeElement.scrollHeight;
		if(this.loading == false) {
			this.loading = true;
			this.loadMessageService.getMoreMessages(this.conversation, this.messages).subscribe(messages => {
				this.messages = messages[0];
				if(this.messageScroll.nativeElement.scrollTop == 0){
					setTimeout(() => this.scrollToStay(scrollHeight), 100)
				}
				this.loading = false;

			},
			err => {
				console.log(err);
			});
		}

	}
	send(){
		let message = {'message':this.newMessage};
		this.loadMessageService.sendMessage(this.messages, message, this.conversation).subscribe(messages => {
			setTimeout(() => this.scrollToBottom(), 100)
			this.messages = messages[0];
		},
		err=>{
			this.flashMessageService.alert('<strong>Sin internet!</strong> Al parecer tu conexión esta fallando. <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>', 2500);
		});
		this.newMessage = '';
	}
}
