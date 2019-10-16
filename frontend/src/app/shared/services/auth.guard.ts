import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, BehaviorSubject, of, pipe } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Person } from 'src/app/interfaces';
import { ApolloQueryResult } from 'apollo-client';
import { FetchResult } from 'apollo-link';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // name of the currently logged-in user
  public username = new BehaviorSubject<string>(undefined);
  // complete info about the currently logged-in user
  private user = new BehaviorSubject<Person>(undefined);
  // the observable of the init http-request
  // private init: Observable<any>;

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

  constructor(private http: HttpClient, private router: Router, private apollo: Apollo) {
    // get infos about currently logged-in user
    this.apollo.watchQuery({
      query: gql`
      query GetSelf {
        me {
          _id
          name
          authorityLevel
        }
      }`
    }).valueChanges.subscribe({
      next: (result: any) => {
        if (!result.errors && result.data) {
          // this.src.next(result.data.image.image);
          this.user.next(result.data.me);
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
    return this.apollo.mutate<any>({ mutation: loginMutation })
      .pipe(
        // map the result to only the data that was returned
        map((result) => result.data.login),
        // snatch the user taht is now logged in
        tap({ next: user => { this.user.next(user); console.log(user) } })
      );
  }

  public logout() {
    // mutation to log out a specific person
    const logoutMutation = gql`
    mutation Logout {
      logout(_id: "${this.user.getValue()._id}")
    }
    `;
    return this.apollo.mutate<any>({ mutation: logoutMutation })
      .pipe(
        map((result) => result.data.logout),
        tap({ next: () => this.user.next(undefined) })
      );
  }
}
