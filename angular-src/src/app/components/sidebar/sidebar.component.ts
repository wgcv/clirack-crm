import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { FlashMessageService } from '../../services/flash-message.service';
import { InboxService } from '../../services/inbox.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  personalInboxes: Array<any>= [];
  teamInboxes: Array<any>= [];
  socket: any;
  constructor(private authService: AuthService, private router: Router,
  private inboxService: InboxService, private sidebar: SidebarService, private flashMessageService: FlashMessageService) { }

  ngOnInit() {
    this.authService.loadUser();
    this.socket = io.connect();
    this.socket = this.inboxService.getInboxIO().subscribe(inbox => {
      if (inbox['team']) {
        this.teamInboxes.push(inbox);
      }else {
        this.personalInboxes.push(inbox);
   }    });

    this.inboxService.getInboxes().subscribe(inboxes => {
      for (let i = 0; i < inboxes.length; i++) {
        if (inboxes[i].team) {
          this.teamInboxes.push(inboxes[i]);
        }else {
          this.personalInboxes.push(inboxes[i]);
        }
      }
    });


  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessageService.alert('You are logout, bye', 3000);
    this.router.navigate(['/login']);
    return false;
  }
}
