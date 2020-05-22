import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { concatMap, withLatestFrom, map, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { CardActionTypes, CardActions, NavigateToSearch } from '../actions/card.actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers/card.reducer';
import { AddSearchString } from '@state/searching/actions/search.actions';
import { Router } from '@angular/router';

@Injectable()
export class CardEffects {
  @Effect()
  loadCards$ = this.actions$.pipe(
    ofType(CardActionTypes.TagClick),
    withLatestFrom(this.store),
    map(([action, stateSnapshot]) => {
      if (stateSnapshot.router.state.url.includes('overview')) {
        // emit add search string event here
        return new AddSearchString({ searchString: action.payload.tag });
      } else {
        // navigate to overview with that tag as search string
        return new NavigateToSearch({ searchString: action.payload.tag });
      }
    })
  );

  @Effect({ dispatch: false })
  navigateToSearch$ = this.actions$.pipe(
    ofType(CardActionTypes.NavigateToSearch),
    withLatestFrom(this.store),
    tap(([action, storeState]) => {
      // split the current route into its parts and only keep the base
      // first element is always the empty string because of the leading / in the route
      // so only keep element 1 to 3
      const routeParts = (storeState.router.state.url as string).split('/').slice(1, 3);
      this.router.navigate([...routeParts, action.payload.searchString]);
    })
  );

  constructor(private actions$: Actions<CardActions>, private store: Store<State>, private router: Router) {}
}
