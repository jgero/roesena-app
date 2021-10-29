import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Observable, of, combineLatest, merge } from 'rxjs';
import { Action } from '@ngrx/store';
import { maxResultsPerPage } from '../reducers/search.reducer';
import { SearchContentLoaded, SearchContentLoadFailed, SearchLengthLoaded } from '../actions/search.actions';
import { convertMany as convertManyEvents } from '@utils/converters/event-documents';
import { convertMany as convertManyArticles } from '@utils/converters/article-documents';
import { convertMany as convertManyImages } from '@utils/converters/image-documents';
import { map, takeUntil, catchError, switchMap, tap } from 'rxjs/operators';
import { sortByTags } from '@utils/converters/sort-by-tags';
import { StoreableArticle, AppArticle, AppElement, AppImage, StoreableEvent, StoreableImage, AppEvent } from '@utils/interfaces';
import { PageDirection } from './directionEnum';
import { MissingDocumentError } from '@utils/errors/missing-document-error';

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
    if (collection === 'events' && !isConfirmedMember) {
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
              return convertManyEvents(data as any) as AppEvent[];
            case 'articles':
              return convertManyArticles(data as any) as AppArticle[];
            case 'images':
            default:
              return convertManyImages(data as any) as AppImage[];
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

export function getDataObservableForArticlePage(
  refDoc: AppArticle,
  firestore: AngularFirestore,
  direction: PageDirection
): Observable<Action> {
  return merge(
    firestore
      .collection('meta')
      .doc('articles')
      .snapshotChanges()
      .pipe(
        map((doc, a) => {
          // if there is no connection an empty document is returned
          if (doc.payload.exists) {
            return new SearchLengthLoaded({ amount: (doc.payload.data() as any).amount });
          } else {
            return new SearchContentLoadFailed({ error: new MissingDocumentError('Document meta/articles does not exist') });
          }
        }),
        catchError((error) => of(new SearchContentLoadFailed({ error })))
      ),

    firestore
      .collection<StoreableArticle>('articles', (qFn) => {
        let query: Query | CollectionReference = qFn;
        // sort the data for pagination
        query = query.orderBy('created', 'desc');
        switch (direction) {
          case PageDirection.FORWARDS:
            // start after the reference document
            query = query.startAfter(refDoc.created);
            break;
          case PageDirection.BACKWARDS:
            // end before the reference document
            query = query.endBefore(refDoc.created);
            break;
          default:
            // default is just starting at the front which means no restriciton here
            break;
        }
        // only take the normal page limit amount on results
        query = query.limit(maxResultsPerPage);
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(convertManyArticles),
        map((articles) => new SearchContentLoaded({ events: [], articles, images: [] })),
        catchError((error) => of(new SearchContentLoadFailed({ error })))
      )
  );
}

export function getDataObservableForImagePage(
  refDoc: AppImage,
  firestore: AngularFirestore,
  direction: PageDirection
): Observable<Action> {
  return merge(
    firestore
      .collection('meta')
      .doc('images')
      .snapshotChanges()
      .pipe(
        map((doc) => {
          // if there is no connection an empty document is returned
          if (doc.payload.exists) {
            return new SearchLengthLoaded({ amount: (doc.payload.data() as any).amount });
          } else {
            return new SearchContentLoadFailed({ error: new MissingDocumentError('Document meta/images does not exist') });
          }
        }),
        catchError((error) => of(new SearchContentLoadFailed({ error })))
      ),

    firestore
      .collection<StoreableImage>('images', (qFn) => {
        let query: Query | CollectionReference = qFn;
        // sort the data for pagination
        query = query.orderBy('created', 'desc');
        switch (direction) {
          case PageDirection.FORWARDS:
            // start after the reference document
            query = query.startAfter(refDoc.created);
            break;
          case PageDirection.BACKWARDS:
            // end before the reference document
            query = query.endBefore(refDoc.created);
            break;
          default:
            // default is just starting at the front which means no restriciton here
            break;
        }
        // only take the normal page limit amount on results
        query = query.limit(maxResultsPerPage);
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(convertManyImages),
        map((images) => new SearchContentLoaded({ events: [], articles: [], images })),
        catchError((error) => of(new SearchContentLoadFailed({ error })))
      )
  );
}

export function getDataObservableForEventsPage(firestore: AngularFirestore, isConfirmedMember: boolean): Observable<Action> {
  return firestore
    .collection<StoreableEvent>('events', (qFn) => {
      let query: Query | CollectionReference = qFn;
      if (!isConfirmedMember) {
        query = query.where('participants', '==', {});
      }
      return query;
    })
    .snapshotChanges()
    .pipe(
      map(convertManyEvents),
      map(events => events.sort((eva, evb) => eva.date < evb.date ? 1 : -1)),
      switchMap((events) => [
        new SearchContentLoaded({ events, articles: [], images: [] }),
        new SearchLengthLoaded({ amount: events.length }),
      ]),
      catchError((error) => of(new SearchContentLoadFailed({ error })))
    );
}
