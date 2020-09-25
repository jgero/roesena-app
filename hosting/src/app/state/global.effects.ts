import { Injectable } from '@angular/core';
import { Effect, Actions, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap, tap } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { BrowserService } from '@services/browser.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

interface ErrorAction extends Action {
  payload: { error: Error };
}

@Injectable()
export class GlobalEffects {
  @Effect({ dispatch: false })
  pushUpdate$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    // listen to service worker updates
    switchMap(() => this.swUpdate.available),
    // show snackbar if there is one and listen for actions
    switchMap(() => this.snackbar.open('Ein Update für die App ist bereit', 'UPDATE', { duration: undefined }).onAction()),
    // side effects when triggering the update
    tap(async () => {
      // log analytics event, that app has been updated by snackbar klick
      await this.analytics.logEvent('update_version_by_popup');
      // reload the browser
      this.browser.reload();
    })
  );

  @Effect({ dispatch: false })
  globalErrorHandler$ = this.actions$.pipe(
    filter((action) => new RegExp('.*((error)|(Failure)|(failure)|(failed)).*').test(action.type.toLowerCase())),
    tap((action: ErrorAction) => {
      let message: string;
      if (!action.payload.error) {
        return;
      }
      if (action.payload.error.name === 'FirebaseError') {
        this.analytics.logEvent('exception', { fatal: true, description: action.payload.error.message });
        message = 'Firebase-Fehler, versuchen sie es später erneut oder kontaktieren sie webmaster@roesena.de';
      } else if (action.payload.error.name === 'MissingDocumentError') {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Daten konnten nicht abgerufen werden, möglicherweise besteht keine Verbindung zur Datenbank';
      } else {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Interner Fehler, versuchen sie es später erneut';
      }
      this.snackbar.open(message, 'OK', { duration: undefined });
    })
  );

  constructor(
    private actions$: Actions<Action>,
    private snackbar: MatSnackBar,
    private swUpdate: SwUpdate,
    private analytics: AngularFireAnalytics,
    private browser: BrowserService
  ) {}
}
