import {  Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LoadConversationService } from '../../services/load-conversation.service';
import { InboxService } from '../../services/inbox.service';

import {Observable} from 'rxjs/Observable';
import {AnonymousSubscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import io from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-conversation',
    templateUrl: './conversation.component.html',
    styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
    private _slug = '';

    @Input()
    set slug(slug: any) {
        if (slug) {
            this.firstTime = true;
            this._slug = slug;
            this.inboxService.getInbox(this._slug).subscribe(inbox => {
                this.inbox = inbox;
                this.loadConversations();
                this.socket = io.connect();
                this.socket = this.loadConversationService.getConversationIO(this.inbox).subscribe(conversation => {
                    this.conversations = this.loadConversationService.updateConversations(this.conversations,  
                        {page: 0, docs: [conversation]});
                });
            },
            err => {
                console.log(err);
            });
        }
    }
    @Output() conversation = new EventEmitter();
    inbox: any;
    conversations = {page: 0, docs: []};
    loading = false;
    firstTime = true;
    socket: any;
    constructor(private loadConversationService: LoadConversationService,
        private inboxService: InboxService) {
        }
    ngOnInit() {

    }

    loadConversations() {
        this.loadConversationService.getConversations(this.inbox,  {page: 0, docs: []}).subscribe(conversations => {
            this.conversations = this.loadConversationService.updateConversations(this.conversations, conversations);
            if (this.firstTime && (conversations.docs.length > 0)) {
                this.firstTime = false;
                if (conversations.docs.length > 0) {
                this.click(conversations.docs[0]);
            }
            }
        },
        error => { });
    }
    click(conversation) {
        this.conversation.emit(conversation);
        setTimeout(() => {
         this.loadConversationService.readConversation(this.conversations, conversation).subscribe(conversations =>{
             this.conversations = conversations;
         });
        }, 2000);
    }
    onScrollDown(ev) {
        if (this.loading === false) {
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
