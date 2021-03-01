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
import { AppElement } from '@utils/interfaces';

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
        // limit the results to something that would fit the page but at least 40
        query = query.limit(Math.max(40, storeState.search.limit));
        // only take public events if not logged in or user ist not confirmed
        if (storeState.search.dataType === 'events' && (!storeState.persons.user || !storeState.persons.user.isConfirmedMember)) {
          query = query.where('participants', '==', {});
        }
        return query;
      };
      // return empty arrays when searched without any search strings
      if (storeState.search.searchStrings.length === 0) {
        return of(new SearchContentLoaded({ events: [], articles: [], images: [] }));
      }
      switch (storeState.search.dataType) {
        case 'events':
          return this.firestore
            .collection('events', queryBuilder)
            .snapshotChanges()
            .pipe(
              takeUntil(this.subs.unsubscribe$),
              map(convertManyEvents),
              map(sortByTags),
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
              map(sortByTags),
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
              map(sortByTags),
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

function sortByTags<T extends AppElement>(originalArray: T[]): T[] {
  return originalArray.sort((aEl, bEl) => {
    // sort tags alphabetically and merge them afterwards
    // the "0" case of the sorting algorithm can be ignored here because an element cannot have two identical tags
    const tagStringA = aEl.tags.sort((a, b) => (a < b ? -1 : 1)).join('');
    const tagStringB = bEl.tags.sort((a, b) => (a < b ? -1 : 1)).join('');
    // compare the tag strings of the elements
    if (tagStringA > tagStringB) {
      return -1;
    }
    if (tagStringA < tagStringB) {
      return 1;
    }
    // here they have identical tags
    return 0;
  });
}
