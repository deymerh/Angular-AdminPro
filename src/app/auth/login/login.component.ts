import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
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
    email: [localStorage.getItem('email') || 'tiago@gmail.com', [Validators.required, Validators.email]],
    password: ['holamundo', Validators.required],
    remenberMe: [false]
  });

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private ngZone: NgZone
    ) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: '770488381019-note6ugdkf2puq74lm9f15qo7d9ksbec.apps.googleusercontent.com',
      callback: (response:any)=>this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      this.loginGoogle.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }

  handleCredentialResponse(response: any) {
    this.userService.loginWithGoogle(response.credential)
      .subscribe((): void=>{
        this.router.navigateByUrl('/');
      })
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
        this.ngZone.run(()=>{
          this.router.navigateByUrl('/');
        })
      }, ((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error?.msg + '!',
        })
      }));
  }

  fieldNoValid(field: string): boolean {
    if (this.loginForm.get(field).invalid && this.loginFormSubmitted) {
      return true;
    } else {
      return false;
    }
  }

}
