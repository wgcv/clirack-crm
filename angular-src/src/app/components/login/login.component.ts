import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'
import { FlashMessageService } from '../../services/flash-message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	username: String;
	password: String;
  constructor(private authService: AuthService, private router: Router, private flashMessageService: FlashMessageService) { }

  ngOnInit() {
    if(this.authService.loggedIn()){
      this.router.navigate(['/']);

    }
  }

  register(){
    this.router.navigate(['./register']);

  }
  onLoginSubmit(){
  	const user = {
  		username: this.username,
  		password: this.password
  	}
  	this.authService.authenticateUser(user).subscribe(data => {
  		if(data.success){
  			this.authService.storeUserData(data.token, data.user);
  			this.router.navigate(['/dashboard']);

  		}else{
  			this.flashMessageService.alert(data.msg, 5000);
  			this.router.navigate(['/login']);
  		}
  	});
  }
}
