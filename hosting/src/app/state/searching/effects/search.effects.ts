import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { withLatestFrom, tap, switchMap, takeUntil, map } from 'rxjs/operators';
import { SearchActionTypes, SearchActions, RunSearch } from '../actions/search.actions';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { SubscriptionService } from '@services/subscription.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { getDataObservableForSearchTags } from './dataFetchingObservables';

@Injectable()
export class SearchEffects {
  @Effect()
  searchOnTagChange$ = this.actions$.pipe(
    ofType(SearchActionTypes.AddSearchString, SearchActionTypes.RemoveSearchString),
    map(() => new RunSearch())
  );

  @Effect()
  initSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.InitSearch),
    map(() => new RunSearch())
  );

  @Effect()
  runSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.RunSearch),
    withLatestFrom(this.store),
    tap(([action, storeState]) => {
      this.router.navigate(['search', storeState.search.dataTypes.join(','), storeState.search.searchStrings.join(',')]);
    }),
    // report to analytics
    tap(() => this.analytics.logEvent('search', { event_category: 'engagement' })),
    switchMap(([action, storeState]) =>
      getDataObservableForSearchTags(
        storeState.search.searchStrings,
        storeState.search.dataTypes,
        !!storeState.persons.user?.isConfirmedMember,
        this.firestore
      ).pipe(takeUntil(this.subs.unsubscribe$))
    )
  );

  constructor(
    private actions$: Actions<SearchActions>,
    private store: Store<State>,
    private router: Router,
    private firestore: AngularFirestore,
    private analytics: AngularFireAnalytics,
    private subs: SubscriptionService
  ) {}
}
