import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { withLatestFrom, tap } from 'rxjs/operators';
import { AppStore } from '../reducers';
import * as searchActions from '../actions/search.actions';

@Injectable()
export class SearchEffects {
  runSearch$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(searchActions.search),
        withLatestFrom(this.store),
        tap(([action, storeState]) => {
          // split the current route into its parts and only keep the base
          // first element is always the empty string because of the leading / in the route
          // so only keep element 1 to 3
          const routeParts = (storeState.router.state.url as string).split('/').slice(1, 3);
          if (storeState.search.searchStrings.length > 0) {
            this.router.navigate([...routeParts, storeState.search.searchStrings.join(',')]);
          } else {
            this.router.navigate([...routeParts]);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<AppStore>, private router: Router) {}
}
