import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { withLatestFrom, tap } from 'rxjs/operators';
import { SearchActionTypes, SearchActions } from '../actions/search.actions';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { Router } from '@angular/router';

@Injectable()
export class SearchEffects {
  // add effect here that inits the serch strings everytime a route with "searchSting" param was navigated to

  @Effect({ dispatch: false })
  runSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.RunSearch),
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
  );

  constructor(private actions$: Actions<SearchActions>, private store: Store<State>, private router: Router) {}
}
