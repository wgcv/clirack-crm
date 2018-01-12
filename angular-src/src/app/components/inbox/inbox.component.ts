import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
    slug: String;
    conversation: any;
  constructor(private route: ActivatedRoute, private router: Router) {
    route.params.subscribe(val => {
        this.slug = this.route.snapshot.paramMap.get('slug');
      });
  }

  ngOnInit() {
  }
    updateConversation(conversation) {
        this.conversation = conversation;
        }
}
