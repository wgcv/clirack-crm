import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-add-facebook-page-team',
	templateUrl: './add-facebook-page-team.component.html',
	styleUrls: ['./add-facebook-page-team.component.css']
})
export class AddFacebookPageTeamComponent implements OnInit {
	fbPage: string;
	constructor() {}

	ngOnInit() {
		
	}
	update(value) {
		this.fbPage = value;
		console.log(this.fbPage);
	}

}
