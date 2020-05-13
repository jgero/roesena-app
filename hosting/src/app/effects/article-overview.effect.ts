import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { ArticleDalService } from '../services/DAL/article-dal.service';

import * as ArticleActions from '../actions/article-overview.actions';

@Injectable()
export class ArticleEffects {
  loadAricles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleActions.updateSearchStrings),
      mergeMap((action) =>
        this.articleDAO.getBySearchStrings(action.searchStrings).pipe(
          map((articles) => ({ type: '[Article DAL] articles loaded successfully', articles })),
          catchError(() => of({ type: '[Article DAL] articles could not be loaded' }))
        )
      ),
      tap((el) => console.log(el))
    )
  );

  constructor(private actions$: Actions, private articleDAO: ArticleDalService) {}
}
