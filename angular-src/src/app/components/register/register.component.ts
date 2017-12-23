import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessageService } from '../../services/flash-message.service';
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
    private flashMessageService: FlashMessageService) { }
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
       this.flashMessageService.alert('Please fill in all fields', 3000);
  		return false;
  	}
  	// Validate Email
  	if(!this.validateService.validateEmail(user.email)){
       this.flashMessageService.alert('Please valid email address',3000);
      		return false;
  	}
    // Register User
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
      this.flashMessageService.alert('You are now register and can log in',3000);
      this.router.navigate(['/login']);
      }else{
     this.flashMessageService.alert('Something went wrong',3000);
     this.router.navigate(['/register']);

      }
    });
    }
  ngOnInit() {
  }

}
