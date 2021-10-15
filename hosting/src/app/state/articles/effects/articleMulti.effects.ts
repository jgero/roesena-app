import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PageActions } from '@state/pagination/actions/page.actions';
import { switchMap, map, takeUntil, catchError } from 'rxjs/operators';
import undefined from 'firebase/compat/firestore';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany } from '@utils/converters/article-documents';
import { Query, CollectionReference } from '@angular/fire/compat/firestore/interfaces';
import { of } from 'rxjs';
import {
  ArticleActionTypes,
  ArticleActions,
  LoadArticleSelectionSuccess,
  LoadArticleSelectionFailure,
} from '../actions/article.actions';
import { sortByTags } from '@utils/converters/sort-by-tags';

@Injectable()
export class ArticleMultiEffects {
  @Effect()
  articleSelection$ = this.actions$.pipe(
    ofType(ArticleActionTypes.LoadArticleSelection),
    switchMap((action) =>
      this.firestore
        .collection('articles', (qFn) => {
          let query: CollectionReference | Query = qFn;
          // filter by the search strings
          action.payload.tags.forEach((searchString) => (query = query.where(`tags.${searchString}`, '==', true)));
          return query;
        })
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map(sortByTags),
          map((articles) => articles.slice(0, action.payload.limit)),
          map((articles) => new LoadArticleSelectionSuccess({ articles })),
          catchError((error) => of(new LoadArticleSelectionFailure({ error })))
        )
    )
  );

  constructor(
    private actions$: Actions<ArticleActions | PageActions>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService
  ) {}
}
