import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // name of the currently logged-in user
  public username = new BehaviorSubject<string>(undefined);
  // complete info about the currently logged-in user
  private user = new BehaviorSubject<any>(undefined);
  // the observable of the init http-request
  private init: Observable<any>;

  private defaultOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.user.getValue()) {
      // logged in
      if (next.routeConfig.path === 'settings') {
        // when going to settings check for level 5 too
        return this.user.getValue().authorityLevel && (this.user.getValue().authorityLevel >= 5);
      } else {
        // if route is not to settings, being logged in is enough
        return true;
      }
    } else {
      // not logged in
      return this.router.createUrlTree(['login']);
    }
  }

  constructor(private http: HttpClient, private router: Router) {
    // restore previous sessions
    this.init = this.http.get('/api/restore');
    this.init.subscribe({
      next: (val) => {
        this.user.next(val);
      },
      error: (err) => {
        if (err.status === 401) {
          console.log('no session id left');
        } else if (err.status === 404) {
          console.log('no cookie left');
        } else {
          console.log('something bad happened');
        }
      }
    });

    // keep the public BehaviorSubject updated
    this.user.subscribe({
      next: user => {
        this.username.next((user ? user.name : undefined));
      }
    });
  }

  public login(username: string, password: string) {
    const body = {
      username,
      password
    };
    return this.http.post('/api/login', JSON.stringify(body), this.defaultOptions)
      .pipe(tap(user => {
        this.user.next(user);
      }));
  }

  public logout() {
    return this.http.post(`/api/logout/${this.user.getValue().name}`, undefined)
      .pipe(tap(_ => {
        this.user.next(undefined);
      }));
  }

}
