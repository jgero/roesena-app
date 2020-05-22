import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, iif } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { State } from '@state/state.module';

@Injectable({
  providedIn: 'root',
})
export class UnauthenticatedGuard implements CanActivate {
  constructor(private store: Store<State>, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (
      this.store
        .select('user', 'user')
        // not sure if this actually works, because iif is very strange
        .pipe(switchMap((user) => iif(() => user === null, of(true), of(this.router.parseUrl('/auth/profile')))))
    );
  }
}
