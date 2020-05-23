import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  EditorActionTypes,
  EditorActions,
  UpdateArticleSuccess,
  UpdateArticleFailure,
  CreateArticleSuccess,
  CreateArticleFailure,
  DeleteArticleSuccess,
  DeleteArticleFailure,
} from '../actions/editor.actions';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { toStorableArticle } from '@utils/converters/article-documents';
import { Router } from '@angular/router';

@Injectable()
export class EditorEffects {
  @Effect()
  updateArticle$ = this.actions$.pipe(
    ofType(EditorActionTypes.UpdateArticle),
    switchMap((action) =>
      this.firestore.collection('articles').doc(action.payload.article.id).update(toStorableArticle(action.payload.article))
    ),
    map(() => new UpdateArticleSuccess()),
    catchError((error) => of(new UpdateArticleFailure({ error })))
  );

  @Effect()
  createArticle$ = this.actions$.pipe(
    ofType(EditorActionTypes.CreateArticle),
    switchMap((action) => this.firestore.collection('articles').add(toStorableArticle(action.payload.article))),
    tap((result) => this.router.navigate(['articles', 'edit', result.id])),
    map(() => new CreateArticleSuccess()),
    catchError((error) => of(new CreateArticleFailure({ error })))
  );

  @Effect()
  deleteArticle$ = this.actions$.pipe(
    ofType(EditorActionTypes.DeleteArticle),
    switchMap((action) => this.firestore.collection('articles').doc(action.payload.article.id).delete()),
    tap(() => this.router.navigate(['articles', 'overview'])),
    map(() => new DeleteArticleSuccess()),
    catchError((error) => of(new DeleteArticleFailure({ error })))
  );

  constructor(private actions$: Actions<EditorActions>, private firestore: AngularFirestore, private router: Router) {}
}
