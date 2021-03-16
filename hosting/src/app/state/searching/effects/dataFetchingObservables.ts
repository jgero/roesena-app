import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { Observable, of, combineLatest } from 'rxjs';
import { Action } from '@ngrx/store';
import { maxResultsPerPage } from '../reducers/search.reducer';
import { SearchContentLoaded, SearchContentLoadFailed } from '../actions/search.actions';
import { convertMany as convertManyEvents } from '@utils/converters/event-documents';
import { convertMany as convertManyArticles } from '@utils/converters/article-documents';
import { convertMany as convertManyImages } from '@utils/converters/image-documents';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { sortByTags } from '@utils/converters/sort-by-tags';

export function getDataObservableForSearchTags(
  tags: string[],
  dataTypes: string[],
  isConfirmedMember: boolean,
  firestore: AngularFirestore
): Observable<Action> {
  // applies query
  const queryBuilder = (qFn: CollectionReference, collection: string) => {
    let query: CollectionReference | Query = qFn;
    // filter by the search strings
    tags.forEach((searchString) => (query = query.where(`tags.${searchString}`, '==', true)));
    // if there are multiple data types limit the searches to 2 elements
    query = query.limit(dataTypes.length === 1 ? maxResultsPerPage : 2);
    // only take public events if not logged in or user ist not confirmed
    if (collection === 'events' && isConfirmedMember) {
      query = query.where('participants', '==', {});
    }
    return query;
  };
  // return empty arrays when searched without any search strings
  if (tags.length === 0) {
    return of(new SearchContentLoaded({ events: [], articles: [], images: [] }));
  }
  const dataObservables = dataTypes.map((collection) =>
    firestore
      .collection(collection, (qFn: any) => queryBuilder(qFn, collection))
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
    map((dataArray) => new SearchContentLoaded(Object.assign({ events: [], articles: [], images: [] }, ...dataArray))),
    catchError((error) => of(new SearchContentLoadFailed({ error })))
  );
}
