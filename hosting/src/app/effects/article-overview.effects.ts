import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';

import { ArticleDalService } from '../services/DAL/article-dal.service';
import * as articleOverveiwActions from '../actions/article-overview.actions';

@Injectable()
export class ArticleOverviewEffects {
  loadAricles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(articleOverveiwActions.updateSearchStrings),
      mergeMap((action) =>
        this.articleDAO.getBySearchStrings(action.searchStrings).pipe(
          map((articles) => ({ type: '[Article DAL] articles loaded successfully', articles })),
          catchError((error) => of({ type: '[Article DAL] articles could not be loaded', error }))
        )
      ),
      tap((el) => console.log(el))
    )
  );

  constructor(private actions$: Actions, private articleDAO: ArticleDalService) {}
}
