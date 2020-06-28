import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { tap } from 'rxjs/operators';
import { PageActionTypes, PageActions } from '../actions/page.actions';

@Injectable()
export class PageEffects {
  @Effect({ dispatch: false })
  loadPages$ = this.actions$.pipe(
    ofType(PageActionTypes.PageBackwards, PageActionTypes.PageForward),
    tap(() => {
      // console.log('scroll to top');
      // setTimeout(() => window.scrollTo(0, 0), 1000);
    })
  );

  constructor(private actions$: Actions<PageActions>) {}
}
