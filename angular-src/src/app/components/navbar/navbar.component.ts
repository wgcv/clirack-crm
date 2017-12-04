import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';

import { Router } from '@angular/router'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    title = 'Clirack';
    constructor(private authService: AuthService, private router: Router, private sidebar: SidebarService) { }
    ngOnInit() {
    }
}
