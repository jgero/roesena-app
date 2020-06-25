import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, tap } from 'rxjs/operators';

@Injectable()
export class GlobalEffects {
  @Effect({ dispatch: false })
  globalErrorHandler$ = this.actions$.pipe(
    filter((action) => new RegExp('.*((error)|(failure)|(failed)).*').test(action.type.toLowerCase())),
    tap((action) => this.snackbar.open(((action as any).payload.error as Error).message, 'OK'))
  );

  constructor(private actions$: Actions<Action>, private snackbar: MatSnackBar) {}
}
