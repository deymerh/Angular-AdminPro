import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public registerFormSubmitted:boolean = false;
  public registerForm = this.formBuilder.group({
    name: ['Deymer', [Validators.required, Validators.minLength(3)]],
    email: ['deymer@deymerh.co', [Validators.required, Validators.email]],
    password: ['1234567', [Validators.required, Validators.minLength(6)]],
    password2: ['1234567', [Validators.required, Validators.minLength(6)]],
    terms: [false, Validators.required]
  },{validators: this.passwordsEquals('password', 'password2')});

  constructor(
    private formBuilder:UntypedFormBuilder,
    private userService:UserService,
    private router:Router
    ) { }

  createUser(){
    this.registerFormSubmitted = true;
    if(this.registerForm.valid && this.registerForm.get('terms').value === true){
      this.userService.createUser(this.registerForm.value)
      .subscribe(()=>{
        this.router.navigateByUrl('/')
      }, ((err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error?.msg+'!',
        })
      }));
    }
  }

  fieldNoValid(field:string):boolean{
    if (this.registerForm.get(field).invalid && this.registerFormSubmitted) {
      return true;
    }else{
      return false;
    }
  }

  acceptTerms():boolean{
    return !this.registerForm.get('terms').value && this.registerFormSubmitted;
  }

  passwordsInvalid(){
    const password = this.registerForm.get('password').value;
    const password2 = this.registerForm.get('password2').value;
    if ((password !== password2) && this.registerFormSubmitted ) {
      return true;
    }else{
      return false;
    }
  }

  passwordsEquals(password:string, password2:string){
    return (formGroup:UntypedFormGroup)=>{
      const passwordControl = formGroup.get(password); 
      const password2Control = formGroup.get(password2); 
      if(passwordControl.value === password2Control.value){
        password2Control.setErrors(null);
      }else{
        password2Control.setErrors({nonIsEqual: true});
      }
    }
  }
}
