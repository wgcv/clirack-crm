import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-facebook-page-personal',
  templateUrl: './add-facebook-page-personal.component.html',
  styleUrls: ['./add-facebook-page-personal.component.css']
})
export class AddFacebookPagePersonalComponent implements OnInit {
	fbPage: string;
  constructor() { }

  ngOnInit() {
  }
 update(value) {
 	this.fbPage = value;
  }
 
}
