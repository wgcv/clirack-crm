import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-gmail-inbox-personal',
  templateUrl: './add-gmail-inbox-personal.component.html',
  styleUrls: ['./add-gmail-inbox-personal.component.css']
})
export class AddGmailInboxPersonalComponent implements OnInit {
  gmail: string;
  constructor() { }

  ngOnInit() {
  }
 update(value) {
     this.gmail = value;
     console.log(this.gmail);
  }

}
