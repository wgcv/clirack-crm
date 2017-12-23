import { Component, OnInit } from '@angular/core';
import { SidebarService } from './services/sidebar.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';

import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Clirack';
  showSlidebar = true;
  online$: Observable<boolean>;

  constructor(private sidebar: SidebarService) { this.online$ = Observable.merge(
    Observable.of(navigator.onLine),
    Observable.fromEvent(window, 'online').mapTo(true),
    Observable.fromEvent(window, 'offline').mapTo(false)
  )
}
  ngOnInit() {
  }
}
