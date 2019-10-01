import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // complete info about the currently logged-in user
  public user = new BehaviorSubject<{ name: string, authorityLevel: number, _id: string }>(undefined);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.user.getValue()) {
      // logged in
      if (next.routeConfig.path === 'edit') {
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
    this.http.get<{ name: string, authorityLevel: number, _id: string }>('/api/restore').subscribe({
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
  }

  public login(username: string, password: string) {
    const body = {
      username,
      password
    };
    return this.http.post<{ name: string, authorityLevel: number, _id: string }>('/api/login', body)
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
