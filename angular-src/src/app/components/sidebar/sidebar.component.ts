import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router'
import {FlashMessagesService } from 'ngx-flash-messages';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router, private sidebar: SidebarService, private flashMessages: FlashMessagesService) { }

  ngOnInit() {
  }
	onLogoutClick(){
		this.authService.logout();
  		this.flashMessages.show('You are logout, bye', {classes:['alert','alert-success'],timeout: 3000});
	
	this.router.navigate(['/login']);
	return false;
	}
}
