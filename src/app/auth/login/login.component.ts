import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('loginGoogle') loginGoogle: ElementRef;
  public loginFormSubmitted: boolean = false;
  public loginForm = this.formBuilder.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['1234567', Validators.required],
    remenberMe: [false]
  });

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: '770488381019-note6ugdkf2puq74lm9f15qo7d9ksbec.apps.googleusercontent.com',
      callback: this.handleCredentialResponse
    });
    google.accounts.id.renderButton(
      // document.getElementById("loginGoogle"),
      this.loginGoogle.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }

  handleCredentialResponse(response: any) {
    console.log("Encoded JWT ID token: " + response.credential);
  }

  login() {
    this.loginFormSubmitted = true;
    this.userService.loginUser(this.loginForm.value)
      .subscribe((response) => {
        if (this.loginForm.get('remenberMe').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
      }, ((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error?.msg + '!',
        })
      }));
    // this.router.navigateByUrl('/');
  }

  fieldNoValid(field: string): boolean {
    if (this.loginForm.get(field).invalid && this.loginFormSubmitted) {
      return true;
    } else {
      return false;
    }
  }

}
