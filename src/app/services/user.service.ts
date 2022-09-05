import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment.prod';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient ) { }

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
}
