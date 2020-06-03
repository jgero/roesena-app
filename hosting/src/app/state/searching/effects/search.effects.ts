import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { withLatestFrom, tap } from 'rxjs/operators';
import { SearchActionTypes, SearchActions } from '../actions/search.actions';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { Router } from '@angular/router';

@Injectable()
export class SearchEffects {
  @Effect({ dispatch: false })
  runSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.RunSearch),
    withLatestFrom(this.store),
    tap(([action, storeState]) => {
      this.router.navigate(['search', action.payload.dataType, storeState.search.searchStrings.join(',')]);
    })
  );

  constructor(private actions$: Actions<SearchActions>, private store: Store<State>, private router: Router) {}
}
