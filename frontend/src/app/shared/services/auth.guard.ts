import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { Person } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnDestroy {

  // name of the currently logged-in user
  public username = new BehaviorSubject<string>(undefined);
  // complete info about the currently logged-in user
  private user = new BehaviorSubject<Person>(undefined);
  // apollo subscriptions
  private subs: Subscription[] = [];

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

  constructor(private router: Router, private apollo: Apollo) {
    // get infos about currently logged-in user
    this.subs.push(this.apollo.watchQuery<{ me: Person }>({
      query: gql`
      query GetSelf {
        me {
          _id
          name
          authorityLevel
        }
      }`
    }).valueChanges.subscribe({
      next: result => {
        if (!result.errors && result.data) {
          // this.src.next(result.data.image.image);
          this.user.next(result.data.me);
        }
      }
    }));

    // keep the public BehaviorSubject updated
    this.subs.push(this.user.subscribe({
      next: user => {
        this.username.next((user ? user.name : undefined));
      }
    }));
  }

  public login(username: string, password: string): Observable<Person> {
    // mutation with the username and password returns a person
    const loginMutation = gql`
      mutation Login {
        login(name: "${username}", password: "${password}") {
          _id
          name
          authorityLevel
        }
      }
    `;
    // return the Observable of the mutation
    return this.apollo.mutate<{ login: Person }>({ mutation: loginMutation })
      .pipe(
        // map the result to only the data that was returned
        map((result) => result.data.login),
        // snatch the user taht is now logged in
        tap({ next: user => this.user.next(user) })
      );
  }

  public logout(): Observable<boolean> {
    // mutation to log out a specific person
    const logoutMutation = gql`
    mutation Logout {
      logout(_id: "${this.user.getValue()._id}")
    }
    `;
    // return the Observable of the mutation
    return this.apollo.mutate<{ logout: boolean }>({ mutation: logoutMutation })
      .pipe(
        map((result) => result.data.logout),
        tap({ next: () => this.user.next(undefined) })
      );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
