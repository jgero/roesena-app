import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { State } from '@state/state.module';

@Injectable({
  providedIn: 'root',
})
export class LoadUserGuard implements CanActivateChild {
  constructor(private store: Store<State>) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('persons', 'user').pipe(
      // delay until user is initialized
      //filter((user) => user != null),
      map(() => true)
    );
  }
}
