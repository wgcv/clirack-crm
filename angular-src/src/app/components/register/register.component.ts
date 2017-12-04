import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'ngx-flash-messages';
import { Router } from '@angular/router'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	name: String;
	username: String;
  company: String;
	email: String;
	password: String;
  constructor(private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService) { }
  onRegisterSubmit(){
  	const user = {
  		name : this.name,
  		email: this.email,
      company: this.company,
  		username: this.username,
  		password: this.password
  	}
  	// Requiered Fields
  	if(!this.validateService.validateRegister(user)){
       this.flashMessagesService.show('Please fill in all fields', {
      classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
      timeout: 5000, // Default is 3000
    });
  		return false;
  	}
  	// Validate Email
  	if(!this.validateService.validateEmail(user.email)){
       this.flashMessagesService.show('Please valid email address', {
      classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
    });
      		return false;
  	}
    // Register User
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
      this.flashMessagesService.show('You are now register and can log in', {
      classes: ['alert', 'alert-success'], // You can pass as many classes as you need
      timeout: 5000, // Default is 3000
    });
      this.router.navigate(['/login']);
      }else{
     this.flashMessagesService.show('Something went wrong', {
      classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
    });
     this.router.navigate(['/register']);

      }
    });
    }
  ngOnInit() {
  }

}
