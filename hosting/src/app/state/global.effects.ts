import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap, tap } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { BrowserService } from '@services/browser.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Router } from '@angular/router';

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
      } else if (action.payload.error.name === 'CodeInvalidError') {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Mit diesem Link ist nicht mehr gültig, bitte fordern Sie einen neuen an';
      } else if (action.payload.error.name === 'InvalidEmailError') {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Diese E-Mail ist ungültig, wahrscheinlich existiert bereits ein Account mit dieser E-Mail';
      } else if (action.payload.error.name === 'UserDisabledError') {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Dieser Account wurde gesperrt. Grund dafür könnten zu viele gescheiterte Login-Versuche sein';
      } else if (action.payload.error.name === 'UserNotFoundError') {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Es existiert kein Account mit der angegebenen E-Mail';
      } else if (action.payload.error.name === 'WrongPasswordError') {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Das eingegebene Passwort ist falsch';
      } else if (action.payload.error.name === 'EmailAlreadyInUseError') {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Es existiert bereits ein Account mit dieser E-Mail';
      } else if (action.payload.error.name === 'WeakPasswordError') {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Passwort ist zu schwach';
      } else if (action.payload.error.name === 'CloudFunctionCallError') {
        this.analytics.logEvent('exception', { fatal: true, description: action.payload.error.message });
        message =
          'Fehler beim Aufrufen der Cloud-Function, bitte melden Sie diesen Fehler wenn er reproduzierbar auftritt';
      } else if (action.payload.error.name === 'PermissionDeniedError') {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Zugriff nicht gestattet';
        this.router.navigate(['error', '403']);
      } else {
        this.analytics.logEvent('exception', { fatal: false, description: action.payload.error.message });
        message = 'Interner Fehler, versuchen sie es später erneut';
      }
      this.zone.run(() => {
        this.snackbar.open(message, 'Fehler melden', { duration: 5000 }).onAction().subscribe(() => {
          this.router.navigate(['contact']);
        });
      });
    })
  );

  constructor(
    private actions$: Actions<Action>,
    private snackbar: MatSnackBar,
    private swUpdate: SwUpdate,
    private analytics: AngularFireAnalytics,
    private browser: BrowserService,
    private router: Router,
    private zone: NgZone
  ) {}
}
