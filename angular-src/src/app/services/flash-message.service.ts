import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

@Injectable()
export class FlashMessageService {
	showMessage = false;
	message = '';
	showButton:boolean;

	constructor() { 

  	Observable.fromEvent(window, 'online').subscribe(val => {
  		this.hidden();
  	});
  	  	Observable.fromEvent(window, 'offline').subscribe(val => {
  		this.alert('<b>Error de conexión</b> Verifica tu internet', -1);
  	});
	}
	
	alert(message, time = 2500, showButton = true, limit = false){
		
		if(message.length > 200 && limit){
			this.message = message.slice(0,200) + "...";
		}else{
			this.message = message;
		}
		this.show();
		this.showButton = showButton;
		if (time >0){
			setTimeout(() => this.hidden(), time);
		}
	}
	hidden(){
		this.showMessage = false;
	}
	show(){
		this.showMessage = true;
	}

}
