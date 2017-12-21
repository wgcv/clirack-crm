import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import { LoadMessageService } from '../../services/load-message.service';
import {Observable} from "rxjs/Observable";
import {AnonymousSubscription} from "rxjs/Subscription";

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
	@ViewChild('messageScroll') private messageScroll: ElementRef;
	private _conversation = {name:''};
	loading = false;
	private timerSubscription: AnonymousSubscription;
	messages = {page:0, docs:[]};

	@Input()
	set conversation(conversation: any) { 
		if(conversation){
			this._conversation = conversation; 
			this.messages = {page:0, docs:[]};
			this.loadMessageInit();

		}
	}
	get conversation(): any { return this._conversation; }
	constructor(private loadMessageService:LoadMessageService) { }

	ngOnInit() {

	}
	loadMessageInit(){
		this.loadMessageService.getMessages(this.conversation , this.messages).subscribe(messages => {
			this.messages = messages;
			setTimeout(() => this.scrollToBottom(), 100)
			this.checkMessages();
		});

	}
	loadMessage(){
		this.loadMessageService.getMessages(this.conversation , this.messages).subscribe(messages => {
			console.log(this.messageScroll.nativeElement.scrollHeight - this.messageScroll.nativeElement.scrollTop);
			console.log(this.messageScroll.nativeElement.clientHeight);

			if((this.messageScroll.nativeElement.scrollHeight - this.messageScroll.nativeElement.scrollTop) === this.messageScroll.nativeElement.clientHeight) {
				this.messages = messages;
				setTimeout(() => this.scrollToBottom(), 100)
			}else{
				this.messages = messages;
			}
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
	onUp(ev) {

		if(this.loading == false) {
			this.loading = true;
			this.loadMessageService.getMoreMessages(this.conversation, this.messages).subscribe(messages => {
				this.messages = messages;
				this.loading = false;
			},
			err => {
				console.log(err);
			});
		}

	}

}
