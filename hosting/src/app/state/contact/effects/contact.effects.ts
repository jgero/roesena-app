import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { ContactActionTypes, ContactActions, SendContactMailSuccess, SendContactMailFailure } from '../actions/contact.actions';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudFunctionCallError } from '@utils/errors/cloud-function-call-error';

@Injectable()
export class ContactEffects {
  @Effect()
  loadContacts$ = this.actions$.pipe(
    ofType(ContactActionTypes.SendContactMail),
    switchMap((action) =>
      this.fns
        .httpsCallable('sendContactMail')(action.payload)
        .pipe(
          map(() => new SendContactMailSuccess()),
          // report to analytics
          tap(() => this.analytics.logEvent('send_contact_mail', { event_category: 'engagement' })),
          tap(() => this.snackbar.open('Kontakt E-Mail wurde versendet')),
          catchError((error) => of(new SendContactMailFailure({ error: new CloudFunctionCallError(error.error) })))
        )
    )
  );

  constructor(
    private actions$: Actions<ContactActions>,
    private snackbar: MatSnackBar,
    private fns: AngularFireFunctions,
    private analytics: AngularFireAnalytics
  ) {}
}
