import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { Person } from 'src/app/interfaces';
import { MeGQL } from 'src/app/GraphQL/query-services/me-gql.service';
import { LoginGQL } from '../../GraphQL/mutation-services/login-gql.service';
import { LogoutGQL } from 'src/app/GraphQL/mutation-services/logout-gql.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnDestroy {

  // complete info about the currently logged-in user
  public user = new BehaviorSubject<Person>(undefined);
  // apollo subscriptions
  private subs: Subscription[] = [];

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.user.getValue()) {
      // logged in
      if (next.routeConfig.path === 'edit') {
        // when going to settings check for level 5 too
        return this.user.getValue().authorityLevel && (this.user.getValue().authorityLevel >= 4);
      } else {
        // if route is not to settings, being logged in is enough
        return true;
      }
    } else {
      // not logged in
      return this.router.createUrlTree(['login']);
    }
  }

  constructor(
    private router: Router,
    private meGQL: MeGQL,
    private loginGQL: LoginGQL,
    private logoutGQL: LogoutGQL
  ) {
    // get infos about currently logged-in user
    this.subs.push(
      this.meGQL.watch().valueChanges.subscribe({
        next: result => this.user.next(result.data.me)
      })
    );
  }

  public login(username: string, password: string): Observable<Person> {
    // mutation with the username and password returns a person
    return this.loginGQL.mutate({ username, password })
      .pipe(
        // map the result to only the data that was returned
        map((result) => result.data.login),
        // snatch the user taht is now logged in
        tap({ next: user => this.user.next(user) })
      );
  }

  public logout(): Observable<boolean> {
    // mutation that logs out the current active user
    return this.logoutGQL.mutate({ _id: this.user.getValue()._id })
      .pipe(
        map(result => result.data.logout),
        tap({ next: () => this.user.next(undefined) })
      );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
