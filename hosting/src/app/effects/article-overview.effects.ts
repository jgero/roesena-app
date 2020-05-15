import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, withLatestFrom, filter } from 'rxjs/operators';

import { ArticleDalService } from '../services/DAL/article-dal.service';
import * as articleOverveiwActions from '../actions/article-overview.actions';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { AppStore } from '../reducers';
import { Store } from '@ngrx/store';

@Injectable()
export class ArticleOverviewEffects {
  loadAricles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(articleOverveiwActions.search),
      withLatestFrom(this.store),
      mergeMap(([action, storeState]) =>
        this.articleDAO.getBySearchStrings(storeState.articleOverviewState.searchStrings).pipe(
          map((articles) => ({ type: '[Article DAL] articles loaded successfully', articles })),
          catchError((error) => of({ type: '[Article DAL] articles could not be loaded', error }))
        )
      )
    )
  );

  initPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType({ type: ROUTER_NAVIGATED } as any),
      filter((action) => action.payload.event.url.includes('/articles/overview')),
      map(() => ({ type: '[article-overview component] search' }))
    )
  );

  constructor(private actions$: Actions, private articleDAO: ArticleDalService, private store: Store<AppStore>) {}
}
