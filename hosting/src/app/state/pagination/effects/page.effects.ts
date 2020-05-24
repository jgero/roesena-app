import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { concatMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { PageActionTypes, PageActions } from '../actions/page.actions';

@Injectable()
export class PageEffects {
  // @Effect()
  // loadPages$ = this.actions$.pipe(
  //   ofType(PageActionTypes.LoadPages),
  //   /** An EMPTY observable only emits completion. Replace with your own observable API request */
  //   concatMap(() => EMPTY)
  // );

  constructor(private actions$: Actions<PageActions>) {}
}
