import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import {
  UpdateArticleSuccess,
  UpdateArticleFailure,
  CreateArticleSuccess,
  CreateArticleFailure,
  DeleteArticleSuccess,
  DeleteArticleFailure,
  ArticleActionTypes,
  ArticleActions,
} from '../actions/article.actions';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { toStorableArticle } from '@utils/converters/article-documents';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

@Injectable()
export class ArticleEditorEffects {
  @Effect()
  updateArticle$ = this.actions$.pipe(
    ofType(ArticleActionTypes.UpdateArticle),
    switchMap((action) =>
      from(
        this.firestore.collection('articles').doc(action.payload.article.id).update(toStorableArticle(action.payload.article))
      ).pipe(
        map(() => new UpdateArticleSuccess()),
        tap(() => this.snackbar.open('Gespeichert')),
        // report to analytics
        tap(() => this.analytics.logEvent('update_article', { event_category: 'engagement' })),
        catchError((error) => of(new UpdateArticleFailure({ error })))
      )
    )
  );

  @Effect()
  createArticle$ = this.actions$.pipe(
    ofType(ArticleActionTypes.CreateArticle),
    switchMap((action) =>
      from(this.firestore.collection('articles').add(toStorableArticle(action.payload.article))).pipe(
        tap((result) => this.router.navigate(['articles', 'edit', result.id])),
        map(() => new CreateArticleSuccess()),
        tap(() => this.snackbar.open('Gespeichert')),
        // report to analytics
        tap(() => this.analytics.logEvent('update_article', { event_category: 'engagement' })),
        catchError((error) => of(new CreateArticleFailure({ error })))
      )
    )
  );

  @Effect()
  deleteArticle$ = this.actions$.pipe(
    ofType(ArticleActionTypes.DeleteArticle),
    switchMap((action) =>
      from(this.firestore.collection('articles').doc(action.payload.article.id).delete()).pipe(
        tap(() => this.router.navigate(['search', 'articles'])),
        map(() => new DeleteArticleSuccess()),
        tap(() => this.snackbar.open('Gelöscht')),
        // report to analytics
        tap(() => this.analytics.logEvent('update_article', { event_category: 'engagement' })),
        catchError((error) => of(new DeleteArticleFailure({ error })))
      )
    )
  );

  constructor(
    private actions$: Actions<ArticleActions>,
    private firestore: AngularFirestore,
    private analytics: AngularFireAnalytics,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}
}
