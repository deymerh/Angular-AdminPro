import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent {

  public loginFormSubmitted:boolean = false;
  public loginForm = this.formBuilder.group({
    email: ['deymer@deymerh.co', [Validators.required, Validators.email]],
    password: ['1234567', Validators.required],
    remenberMe: [false]
  });

  constructor(
    private router: Router,
    private formBuilder:FormBuilder,
    private userService: UserService ) { }

  login() {
    this.loginFormSubmitted = true;
    this.userService.loginUser(this.loginForm.value)
      .subscribe((response)=>{
        console.log(response);
      }, ((err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error?.msg+'!',
        })
      }));
    // this.router.navigateByUrl('/');
  }

  fieldNoValid(field:string):boolean{
    if (this.loginForm.get(field).invalid && this.loginFormSubmitted) {
      return true;
    }else{
      return false;
    }
  }

}
