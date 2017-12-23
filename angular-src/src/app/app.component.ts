import { Component, OnInit } from '@angular/core';
import { SidebarService } from './services/sidebar.service';
import { FlashMessageService } from './services/flash-message.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Clirack';
  showSlidebar = true;

  constructor(private sidebar: SidebarService, private flashMessageService: FlashMessageService, ) { 
  }
  ngOnInit() {
  }
}
