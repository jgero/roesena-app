import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, switchMap, takeUntil, filter, tap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { ImageActionTypes, ImageActions, LoadStartPageFailure, LoadStartPageSuccess } from '../actions/image.actions';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { Store } from '@ngrx/store';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { SubscriptionService } from '@services/subscription.service';
import { State } from '@state/state.module';
import undefined from 'firebase/compat/firestore';
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
  {
    heading: 'Die Minigarde',
    subheading: 'Tanzgruppe',
    filterTags: ['Minigarde'],
    pageLink: '/static-articles/groups/garden/minigarde',
  },
  {
    heading: 'Die Kindergarde',
    subheading: 'Tanzgruppe',
    filterTags: ['Kindergarde'],
    pageLink: '/static-articles/groups/garden/kindergarde',
  },
  {
    heading: 'Die Jungendgarde',
    subheading: 'Tanzgruppe',
    filterTags: ['Jugendgarde'],
    pageLink: '/static-articles/groups/garden/jugendgarde',
  },
  {
    heading: 'Die Prinzengarde',
    subheading: 'Tanzgruppe',
    filterTags: ['Prinzengarde'],
    pageLink: '/static-articles/groups/garden/prinzengarde',
  },
  {
    heading: 'Die Erste Garde',
    subheading: 'Tanzgruppe',
    filterTags: ['Erste Garde'],
    pageLink: '/static-articles/groups/garden/erste-garde',
  },
  { heading: 'Die Büttenredner', subheading: 'Sprechbeiträge', filterTags: ['Bütt'], pageLink: '/search/images/Bütt' },
  { heading: 'Die Prinzenpaare', subheading: '', filterTags: ['Prinzenpaar'], pageLink: '/static-articles/archive/royals' },
  {
    heading: 'Die Kinderprinzenpaare',
    subheading: '',
    filterTags: ['Kinderprinzenpaar'],
    pageLink: '/static-articles/archive/mini-royals',
  },
];

@Injectable()
export class ImageMultiEffects {
  @Effect()
  loadStartpage$ = this.actions$.pipe(
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
      ).pipe(takeUntil(this.subs.unsubscribe$))
    ),
    map((data) => new LoadStartPageSuccess({ tiles: data })),
    catchError((error) => of(new LoadStartPageFailure({ error })))
  );

  constructor(
    private actions$: Actions<ImageActions | PageActions>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService,
    private urlLoader: UrlLoaderService
  ) {}
}
