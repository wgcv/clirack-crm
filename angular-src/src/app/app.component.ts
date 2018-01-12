import { Component, OnInit } from '@angular/core';
import { SidebarService } from './services/sidebar.service';
import { FlashMessageService } from './services/flash-message.service';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Clirack';
  showSlidebar = true;
  socket;

  constructor(private sidebar: SidebarService,  private authService: AuthService, private flashMessageService: FlashMessageService, ) { 

  }
  ngOnInit() {
  }
}
