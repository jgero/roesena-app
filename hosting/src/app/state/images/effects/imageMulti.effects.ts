import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, switchMap, takeUntil, filter, tap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import {
  ImageActionTypes,
  ImageActions,
  LoadImagePageSuccess,
  LoadImagePageFailure,
  LoadImageAmountSuccess,
  LoadImageAmountFailure,
  LoadImageAmount,
  LoadStartPageFailure,
  LoadStartPageSuccess,
} from '../actions/image.actions';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { Store } from '@ngrx/store';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { SubscriptionService } from '@services/subscription.service';
import { State } from '@state/state.module';
import 'firebase/firestore';
import { convertMany } from '@utils/converters/image-documents';
import { MissingDocumentError } from '@utils/errors/missing-document-error';
import { UrlLoaderService } from '@services/url-loader.service';

const STARTPAGE_TILE_OPTIONS = [
  { heading: 'Der Elferrat', subheading: '', filterTags: ['Elferrat'], pageLink: '' },
  {
    heading: 'Die Sechtafeger',
    subheading: 'Kostümgruppe',
    filterTags: ['Sechtafeger'],
    pageLink: '/static-articles/groups/sechtafeger',
  },
  {
    heading: 'Die Brandjoggala',
    subheading: 'Maskengruppe',
    filterTags: ['Brandjoggala'],
    pageLink: '/static-articles/groups/brandjoggala',
  },
  {
    heading: 'Das Wilde Heer',
    subheading: 'Maskengruppe',
    filterTags: ['Das Wilde Heer'],
    pageLink: '/static-articles/groups/wildes-heer',
  },
  {
    heading: 'Das Männerballett',
    subheading: 'Tanzgruppe',
    filterTags: ['Männerballett'],
    pageLink: '/static-articles/groups/maennerballett',
  },
  {
    heading: 'Die Röhling Stones',
    subheading: 'Guggenmusik',
    filterTags: ['Röhling Stones'],
    pageLink: '/static-articles/groups/roehling-stones',
  },
  // { heading: 'Das Technik Team', subheading: 'lorem ipsum dolor', filterTags: ['Technik'], pageLink: '' },
  { heading: 'Die Minigarde', subheading: 'Garde', filterTags: ['Minigarde'], pageLink: '' },
  { heading: 'Die Kindergarde', subheading: 'Garde', filterTags: ['Kindergarde'], pageLink: '' },
  { heading: 'Die Jungendgarde', subheading: 'Garde', filterTags: ['Jugendgarde'], pageLink: '' },
  { heading: 'Die Prinzengarde', subheading: 'Garde', filterTags: ['Prinzengarde'], pageLink: '' },
  { heading: 'Die Erste Garde', subheading: 'Garde', filterTags: ['Erste Garde'], pageLink: '' },
  { heading: 'Die Büttenredner', subheading: 'Sprechbeiträge', filterTags: ['Bütt'], pageLink: '' },
  { heading: 'Die Prinzenpaare', subheading: '', filterTags: ['Prinzenpaar'], pageLink: '' },
  { heading: 'Die Kinderprinzenpaare', subheading: '', filterTags: ['Kinderprinzenpaar'], pageLink: '' },
];

@Injectable()
export class ImageMultiEffects {
  @Effect()
  loadImages$ = this.actions$.pipe(
    ofType(ImageActionTypes.LoadImagePage),
    switchMap((action) =>
      this.firestore
        .collection('images', (qFn) => qFn.orderBy('created', 'desc').limit(action.payload.limit))
        .snapshotChanges()
        .pipe(
          map(convertMany),
          // dispatch loaded event and start loading the image amount
          switchMap((images) => [new LoadImagePageSuccess({ images }), new LoadImageAmount()]),
          takeUntil(this.subs.unsubscribe$),
          catchError((error) => of(new LoadImagePageFailure({ error })))
        )
    )
  );

  @Effect()
  loadImageAmount$ = this.actions$.pipe(
    ofType(ImageActionTypes.LoadImageAmount),
    switchMap(() =>
      this.firestore
        .collection('meta')
        .doc('images')
        .snapshotChanges()
        .pipe(
          map((doc) => {
            // if there is no connection an empty document is returned
            if (doc.payload.exists) {
              return new LoadImageAmountSuccess({ amount: (doc.payload.data() as any).amount });
            } else {
              return new LoadImageAmountFailure({ error: new MissingDocumentError('Document meta/images does not exist') });
            }
          }),
          takeUntil(this.subs.unsubscribe$),
          catchError((error) => of(new LoadImageAmountFailure({ error })))
        )
    )
  );

  @Effect()
  pageForward$ = this.actions$.pipe(
    ofType(PageActionTypes.PageForward),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('images/overview')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('images', (qFn) =>
          qFn.orderBy('created', 'desc').startAfter(storeState.images.pageLast.created).limit(storeState.images.pageLimit)
        )
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((images) => new LoadImagePageSuccess({ images })),
          catchError((error) => of(new LoadImagePageFailure({ error })))
        )
    )
  );

  @Effect()
  pageBackwards$ = this.actions$.pipe(
    ofType(PageActionTypes.PageBackwards),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('images/overview')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('images', (qFn) =>
          qFn.orderBy('created', 'desc').endBefore(storeState.images.pageFirst.created).limitToLast(storeState.images.pageLimit)
        )
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((images) => new LoadImagePageSuccess({ images })),
          catchError((error) => of(new LoadImagePageFailure({ error })))
        )
    )
  );

  @Effect()
  loadStartpage = this.actions$.pipe(
    ofType(ImageActionTypes.LoadStartPage),
    // randomly select some groups from the list of options
    map((action) => {
      const optionLimit = action.payload.tileAmount;
      const remainingOptions = STARTPAGE_TILE_OPTIONS;
      const selectedOptions = [];
      for (let i = 0; i < optionLimit; i++) {
        const index = Math.round(Math.random() * 1000) % remainingOptions.length;
        selectedOptions.push(remainingOptions.splice(index, 1)[0]);
      }
      return selectedOptions;
    }),
    switchMap((options) =>
      combineLatest(
        // map options to the image document fetch observables
        options.map((element) =>
          this.firestore
            .collection('images', (qFn) => {
              let query: CollectionReference | Query = qFn;
              element.filterTags.forEach((searchString: string) => (query = query.where(`tags.${searchString}`, '==', true)));
              query = query.limit(5);
              return query;
            })
            .snapshotChanges()
            .pipe(
              map(convertMany),
              // select two random images
              map((images) => {
                const selectedImages = [];
                const remainingImages = images;
                for (let i = 0; i < 2; i++) {
                  const index = Math.round(Math.random() * 1000) % remainingImages.length;
                  selectedImages.push(remainingImages.splice(index, 1)[0]);
                }
                return selectedImages;
              }),
              // when image docs arrive map to urls
              switchMap((images) => combineLatest(images.map((image) => this.urlLoader.getImageURL(image.id, false)))),
              map((urls) => ({
                heading: element.heading,
                subheading: element.subheading,
                imageUrls: urls,
                pageLink: element.pageLink,
              }))
            )
        )
      )
    ),
    map((data) => new LoadStartPageSuccess({ tiles: data })),
    catchError((error) => of(new LoadStartPageFailure({ error })))
  );

  constructor(
    private actions$: Actions<ImageActions | PageActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService,
    private urlLoader: UrlLoaderService
  ) {}
}
