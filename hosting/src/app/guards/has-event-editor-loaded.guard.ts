import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@state/events/editor/reducers/event.reducer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HasEventEditorLoadedGuard implements CanDeactivate<unknown> {
  constructor(private store: Store<State>) {}

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // can navigate away if not loading
    return this.store.select('eventEditor', 'isLoading').pipe(map((el) => !el));
  }
}
