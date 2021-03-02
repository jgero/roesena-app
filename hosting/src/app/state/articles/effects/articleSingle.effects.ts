import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ArticleActionTypes,
  ArticleActions,
  LoadSingleArticleSuccess,
  LoadSingleArticleFailure,
} from '../actions/article.actions';
import { Store } from '@ngrx/store';
import { convertOne as convertOneArticle, convertMany } from '@utils/converters/article-documents';
import { StoreableArticle } from '@utils/interfaces';
import { AngularFirestore, Query, CollectionReference } from '@angular/fire/firestore';
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';
import { MissingDocumentError } from '@utils/errors/missing-document-error';

@Injectable()
export class ArticleSingleEffects {
  @Effect()
  loadArticle$ = this.actions$.pipe(
    ofType(ArticleActionTypes.LoadSingleArticle),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      const id = storeState.router.state.params.id;
      if (id) {
        // first get the article
        return this.firestore
          .collection<StoreableArticle>('articles')
          .doc(id)
          .snapshotChanges()
          .pipe(
            map(convertOneArticle),
            map((article) => new LoadSingleArticleSuccess({ article })),
            catchError((error) => of(new LoadSingleArticleFailure({ error }))),
            // only listen until the module gets changed
            takeUntil(this.subs.unsubscribe$)
          );
      } else if (action.payload?.tags) {
        return this.firestore
          .collection('articles', (qFn) => {
            let query: Query | CollectionReference = qFn;
            // filter to only take articles with the requested tags
            action.payload.tags.forEach((tag) => (query = query.where(`tags.${tag}`, '==', true)));
            // only take one
            query = query.limit(1);
            return query;
          })
          .snapshotChanges()
          .pipe(
            takeUntil(this.subs.unsubscribe$),
            map(convertMany),
            map((articles) =>
              articles.length > 0
                ? new LoadSingleArticleSuccess({ article: articles[0] })
                : new LoadSingleArticleFailure({ error: new MissingDocumentError('no article with these tags') })
            ),
            catchError((error) => of(new LoadSingleArticleFailure({ error })))
          );
      } else {
        return of(
          new LoadSingleArticleSuccess({
            article: {
              id: '',
              ownerId: storeState.persons.user.id,
              ownerName: storeState.persons.user.name,
              tags: [],
              title: '',
              content: '',
              created: new Date(),
            },
          })
        );
      }
    })
  );

  constructor(
    private actions$: Actions<ArticleActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService
  ) {}
}
