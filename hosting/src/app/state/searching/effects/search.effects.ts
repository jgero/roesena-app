import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { withLatestFrom, tap, switchMap, mergeMap, takeUntil, map, catchError } from 'rxjs/operators';
import {
  SearchActionTypes,
  SearchActions,
  AddSearchString,
  RunSearch,
  SearchContentLoaded,
  ChangeDataType,
  SearchContentLoadFailed,
} from '../actions/search.actions';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { Router } from '@angular/router';
import { of, merge } from 'rxjs';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import 'firebase/firestore';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany as convertManyEvents } from '@utils/converters/event-documents';
import { convertMany as convertManyArticles } from '@utils/converters/article-documents';
import { convertMany as convertManyImages } from '@utils/converters/image-documents';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Injectable()
export class SearchEffects {
  @Effect()
  initSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.InitSearch),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      merge(
        ...(storeState.router.state.params.searchStrings.split(',') as string[]).map((searchString) =>
          of(new AddSearchString({ searchString }))
        ),
        of(new ChangeDataType({ dataType: storeState.router.state.params.type })),
        of(new RunSearch())
      )
    )
  );

  @Effect()
  runSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.RunSearch),
    withLatestFrom(this.store),
    tap(([action, storeState]) => {
      this.router.navigate(['search', storeState.search.dataType, storeState.search.searchStrings.join(',')]);
    }),
    // report to analytics
    tap(() => this.analytics.logEvent('search', { event_category: 'engagement' })),
    switchMap(([action, storeState]) => {
      // applies query
      const queryBuilder = (qFn: CollectionReference) => {
        let query: CollectionReference | Query = qFn;
        // filter by the search strings
        storeState.search.searchStrings.forEach((searchString) => (query = query.where(`tags.${searchString}`, '==', true)));
        // limit the results
        query = query.limit(storeState.search.limit);
        // only take public events if not logged in or user ist not confirmed
        if (storeState.search.dataType === 'events' && (!storeState.user.user || !storeState.user.user.isConfirmedMember)) {
          query = query.where('participants', '==', {});
        }
        return query;
      };
      switch (storeState.search.dataType) {
        case 'events':
          return this.firestore
            .collection('events', queryBuilder)
            .snapshotChanges()
            .pipe(
              takeUntil(this.subs.unsubscribe$),
              map(convertManyEvents),
              map((events) => new SearchContentLoaded({ events, articles: [], images: [] })),
              catchError((error) => of(new SearchContentLoadFailed({ error })))
            );
        case 'articles':
          return this.firestore
            .collection('articles', queryBuilder)
            .snapshotChanges()
            .pipe(
              takeUntil(this.subs.unsubscribe$),
              map(convertManyArticles),
              map((articles) => new SearchContentLoaded({ events: [], articles, images: [] })),
              catchError((error) => of(new SearchContentLoadFailed({ error })))
            );
        case 'images':
          return this.firestore
            .collection('images', queryBuilder)
            .snapshotChanges()
            .pipe(
              takeUntil(this.subs.unsubscribe$),
              map(convertManyImages),
              map((images) => new SearchContentLoaded({ events: [], articles: [], images })),
              catchError((error) => of(new SearchContentLoadFailed({ error })))
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
