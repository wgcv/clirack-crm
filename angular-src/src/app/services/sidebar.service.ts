import { Injectable } from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class SidebarService {
	visible: boolean;
	constructor() {
		if(window.screen.width>575){
			this.visible = true;
		}else{
			this.visible = false;
		}

	}
	toggle(){
		this.visible = !this.visible;
	}
	isVisible(){
		if (tokenNotExpired('id_token')){
			return this.visible;
		}
		else
		{
			return false;
		}
	}

}
