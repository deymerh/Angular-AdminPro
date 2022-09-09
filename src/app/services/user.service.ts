import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from '../../environments/environment.prod';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

declare const google:any 
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private router:Router,
    private ngZone:NgZone
    ) { }

  createUser(formData:RegisterForm){
    return this.http.post(`${base_url}/users`, formData)
                .pipe(
                  tap((res:any)=>{
                    localStorage.setItem('token', res.token)
                  })
                )
  }

  loginUser(formData:LoginForm){
    console.log('Login user');
    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap((res:any)=>{
                    localStorage.setItem('token', res.token)
                  })
                )
  }

  loginWithGoogle(token:string){
    return this.http.post(`${base_url}/login/google`, {token})
                .pipe(
                  tap((res:any)=>{
                    localStorage.setItem('token', res.token)
                  })
                )
  }

  renewToken():Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`, {
      headers:{
        'x-token': token
      }}).pipe(
          tap((res:any)=>{
            localStorage.setItem('token', res.token)
          }),
          map(()=> true),
          catchError(()=>of(false))
        );
  }

  logout(){
    localStorage.removeItem('token');
    google.accounts.id.revoke('deyer1227@gmail.com',()=>{
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      })
    })
  }

}
