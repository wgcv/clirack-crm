import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router'
import { FlashMessageService } from '../../services/flash-message.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router, private sidebar: SidebarService, private flashMessageService: FlashMessageService) { }

  ngOnInit() {
  }
	onLogoutClick(){
		this.authService.logout();
  		this.flashMessageService.alert('You are logout, bye', 3000);
	
	this.router.navigate(['/login']);
	return false;
	}
}
