import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import { LoadMessageService } from '../../services/load-message.service';

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
	@ViewChild('messageScroll') private messageScroll: ElementRef;
	private _conversation = {name:''};
	loading = false;
	@Input()
	set conversation(conversation: any) { 
		if(conversation){
			this._conversation = conversation; 
			this.getMessage(conversation);

		}
	}
	get conversation(): any { return this._conversation; }
	messages = {page:0, docs:[]};
	constructor(private loadMessageService:LoadMessageService) { }

	ngOnInit() {

	}
	getMessage(conversation){
		this.messages = {page:0, docs:[]};
		this.loadMessageService.getMoreMessages(conversation , this.messages).subscribe(messages => {
			this.messages = messages;
			setTimeout(() => this.scrollToBottom(), 300)

		});

	}
	scrollToBottom(): void {
		try {
            this.messageScroll.nativeElement.scrollTop = this.messageScroll.nativeElement.scrollHeight;

		} catch(err) {console.log(err); }                 
	}
	onUp(ev) {
		if(this.loading == false) {
			console.log('get in');
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
