import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { withLatestFrom, tap, switchMap, takeUntil, map, catchError } from 'rxjs/operators';
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
import { of, merge, combineLatest } from 'rxjs';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import 'firebase/firestore';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany as convertManyEvents } from '@utils/converters/event-documents';
import { convertMany as convertManyArticles } from '@utils/converters/article-documents';
import { convertMany as convertManyImages } from '@utils/converters/image-documents';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { sortByTags } from '@utils/converters/sort-by-tags';

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
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      merge(
        ...(storeState.router.state.params.searchStrings.split(',') as string[]).map((searchString) =>
          of(new AddSearchString({ searchString }))
        ),
        of(new ChangeDataType({ dataTypes: storeState.router.state.params.type.split(',') })),
        of(new RunSearch())
      )
    )
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
    switchMap(([action, storeState]) => {
      // applies query
      const queryBuilder = (qFn: CollectionReference, collection: string) => {
        let query: CollectionReference | Query = qFn;
        // filter by the search strings
        storeState.search.searchStrings.forEach((searchString) => (query = query.where(`tags.${searchString}`, '==', true)));
        // if there are multiple data types limit the searches to 2 elements
        query = query.limit(storeState.search.dataTypes.length === 1 ? 40 : 2);
        // only take public events if not logged in or user ist not confirmed
        if (collection === 'events' && (!storeState.persons.user || !storeState.persons.user.isConfirmedMember)) {
          query = query.where('participants', '==', {});
        }
        return query;
      };
      // return empty arrays when searched without any search strings
      if (storeState.search.searchStrings.length === 0) {
        return of(new SearchContentLoaded({ events: [], articles: [], images: [] }));
      }
      const dataObservables = storeState.search.dataTypes.map((collection) =>
        this.firestore
          .collection(collection, (qFn) => queryBuilder(qFn, collection))
          .snapshotChanges()
          .pipe(
            map((data) => {
              switch (collection) {
                case 'events':
                  return convertManyEvents(data as any);
                case 'articles':
                  return convertManyArticles(data as any);
                case 'images':
                  return convertManyImages(data as any);
              }
            }),
            map(sortByTags),
            map((value) => ({ [collection]: value }))
          )
      );
      return combineLatest(dataObservables).pipe(
        takeUntil(this.subs.unsubscribe$),
        map((dataArray) => new SearchContentLoaded(Object.assign({ events: [], articles: [], images: [] }, ...dataArray))),
        catchError((error) => of(new SearchContentLoadFailed({ error })))
      );
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
