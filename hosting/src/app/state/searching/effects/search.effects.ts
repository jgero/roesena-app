import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { withLatestFrom, tap, switchMap, takeUntil, map } from 'rxjs/operators';
import {
  SearchActionTypes,
  SearchActions,
  RunSearch,
  SearchContentLoadFailed,
  SearchContentLoaded,
} from '../actions/search.actions';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { SubscriptionService } from '@services/subscription.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import {
  getDataObservableForSearchTags,
  getDataObservableForArticlePage,
  getDataObservableForEventsPage,
  getDataObservableForImagePage,
} from './dataFetchingObservables';
import { of } from 'rxjs';
import { PageDirection } from './directionEnum';
import { PageActionTypes } from '@state/pagination/actions/page.actions';

// VERY IMPORANT TO SAVE MUCH FRUSTRATION
// the takeUntil with unsubscribe has to be put in the pipe of the data observables and not directly on the effects
// if you put them on the effect it will unsubscribe from the effect and the page only works on the first visit.....

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
  nextPage$ = this.actions$.pipe(
    ofType(PageActionTypes.PageForward),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      switch (storeState.search.dataTypes[0]) {
        case 'articles':
          return getDataObservableForArticlePage(
            storeState.search.articles[storeState.search.articles.length - 1],
            this.firestore,
            PageDirection.FORWARDS
          ).pipe(takeUntil(this.subs.unsubscribe$));
        case 'images':
          return getDataObservableForImagePage(
            storeState.search.images[storeState.search.images.length - 1],
            this.firestore,
            PageDirection.FORWARDS
          ).pipe(takeUntil(this.subs.unsubscribe$));
      }
    })
  );

  @Effect()
  previousPage$ = this.actions$.pipe(
    ofType(PageActionTypes.PageBackwards),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      switch (storeState.search.dataTypes[0]) {
        case 'articles':
          return getDataObservableForArticlePage(storeState.search.articles[0], this.firestore, PageDirection.BACKWARDS).pipe(
            takeUntil(this.subs.unsubscribe$)
          );
        case 'images':
          return getDataObservableForImagePage(storeState.search.images[0], this.firestore, PageDirection.BACKWARDS).pipe(
            takeUntil(this.subs.unsubscribe$)
          );
      }
    })
  );

  @Effect()
  runSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.RunSearch),
    withLatestFrom(this.store),
    tap(([action, storeState]) => {
      if (storeState.search.searchStrings.length > 0) {
        this.router.navigate(['search', storeState.search.dataTypes.join(','), storeState.search.searchStrings.join(',')]);
      } else {
        this.router.navigate(['search', storeState.search.dataTypes.join(',')]);
      }
    }),
    // report to analytics
    tap(() => this.analytics.logEvent('search', { event_category: 'engagement' })),
    switchMap(([action, storeState]) => {
      if (storeState.search.searchStrings.length > 0) {
        // if there are search strings run filter query
        return getDataObservableForSearchTags(
          storeState.search.searchStrings,
          storeState.search.dataTypes,
          !!storeState.persons.user?.isConfirmedMember,
          this.firestore
        ).pipe(takeUntil(this.subs.unsubscribe$));
      }
      if (storeState.search.dataTypes.length > 1) {
        // query with multiple data types and no tag is not supported
        return of(new SearchContentLoaded({ articles: [], events: [], images: [] }));
      }
      // only the case of one data type without search string remains
      switch (storeState.search.dataTypes[0]) {
        case 'articles':
          return getDataObservableForArticlePage(null, this.firestore, PageDirection.INIT).pipe(
            takeUntil(this.subs.unsubscribe$)
          );
        case 'images':
          return getDataObservableForImagePage(null, this.firestore, PageDirection.INIT).pipe(takeUntil(this.subs.unsubscribe$));
        case 'events':
          return getDataObservableForEventsPage(this.firestore, !!storeState.persons.user?.isConfirmedMember).pipe(
            takeUntil(this.subs.unsubscribe$)
          );
      }
    })
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
