import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { tap, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userSercices: UserService,
    private router: Router,
    ){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('Pasó por el canActivate del Guard');
      console.log({userSercicesrenewToken: this.userSercices.renewToken()})
    return this.userSercices.renewToken()
               .pipe(
                tap((userAuthenticated)=>{
                  if(!userAuthenticated){
                    this.router.navigateByUrl('/login')
                  }
                })
               )
  }
  
}
