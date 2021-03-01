import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { switchMap, map, catchError, tap, withLatestFrom, take, filter, takeUntil, skip } from 'rxjs/operators';
import { of, from } from 'rxjs';
import {
  PersonActionTypes,
  PersonActions,
  LoginSuccess,
  LoginFailure,
  LogoutSuccess,
  LogoutFailure,
  ChangeNameSuccess,
  ChangeNameFailure,
  ResetSuccess,
  ResetFailure,
  ChangePasswordWithCodeSuccess,
  ChangePasswordWithCodeFailure,
  RegisterSuccess,
  RegisterFailure,
  LoadUser,
} from '../actions/person.actions';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BrowserService } from '@services/browser.service';
import { AngularFirestore } from '@angular/fire/firestore';

import 'firebase/firestore';
import { State } from '@state/state.module';
import { Store } from '@ngrx/store';
import { StoreablePerson } from '@utils/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireFunctions } from '@angular/fire/functions';
import { SubscriptionService } from '@services/subscription.service';
import { CodeInvalidError } from '@utils/errors/code-invalid-error';
import { InvalidEmailError } from '@utils/errors/invalid-email-error';
import { UserDisabledError } from '@utils/errors/user-disabled-error';
import { UserNotFoundError } from '@utils/errors/user-not-found-error';
import { WrongPasswordError } from '@utils/errors/wrong-password-error';
import { EmailAlreadyInUseError } from '@utils/errors/email-already-in-use-error';
import { OperationNotAllowedError } from '@utils/errors/operation-not-allowed-error';
import { WeakPasswordError } from '@utils/errors/weak-password-error';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { CloudFunctionCallError } from '@utils/errors/cloud-function-call-error';

@Injectable()
export class PersonAuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(PersonActionTypes.Login),
    switchMap((action) =>
      from(this.auth.signInWithEmailAndPassword(action.payload.email, action.payload.password)).pipe(
        // emit the finished login and start loading the document for the user
        switchMap((user) => [new LoginSuccess(), new LoadUser({ id: user.user.uid })]),
        catchError((error) => {
          if (error.code === 'auth/invalid-email') {
            return of(new LoginFailure({ error: new InvalidEmailError(error.message) }));
          } else if (error.code === 'auth/user-disabled') {
            return of(new LoginFailure({ error: new UserDisabledError(error.message) }));
          } else if (error.code === 'auth/user-not-found') {
            return of(new LoginFailure({ error: new UserNotFoundError(error.message) }));
          } else if (error.code === 'auth/wrong-password') {
            return of(new LoginFailure({ error: new WrongPasswordError(error.message) }));
          } else {
            return of(new LoginFailure({ error }));
          }
        })
      )
    )
  );

  @Effect({ dispatch: false })
  redirectAfterLogin$ = this.actions$.pipe(
    ofType(PersonActionTypes.LoginSuccess),
    // after login is success full wait until the user is loaded, otherwise redirect won't work
    switchMap(() => this.store.select('persons', 'user')),
    // skip the first emit of the select
    // this first emit would always be null because no user was logged in and new one is not loaded yet
    skip(1),
    // to prevent redirects when user gets emitted again only take the first
    take(1),
    // now the user is loaded and the redirect can be started
    tap(() => this.router.navigate(['auth', 'profile'])),
    // report login to analytics
    tap(() => this.analytics.logEvent('login'))
  );

  @Effect()
  logout$ = this.actions$.pipe(
    ofType(PersonActionTypes.Logout),
    switchMap(() =>
      from(this.auth.signOut()).pipe(
        map(() => new LogoutSuccess()),
        catchError((error) => of(new LogoutFailure({ error })))
      )
    )
  );

  @Effect({ dispatch: false })
  redirectAfterLogout$ = this.actions$.pipe(
    ofType(PersonActionTypes.LogoutSuccess),
    // location reload will automatically navigate to the right pages
    tap(() => this.browser.reload()),
    // report logout to analytics
    tap(() => this.analytics.logEvent('logout', { event_category: 'engagement' }))
  );

  @Effect()
  registerUser$ = this.actions$.pipe(
    ofType(PersonActionTypes.Register),
    // create new user in firebase auth
    switchMap((action) =>
      from(this.auth.createUserWithEmailAndPassword(action.payload.email, action.payload.password)).pipe(
        // wait until user doc is created via cloud function
        switchMap((userCredential) =>
          this.firestore
            .collection('persons')
            .doc<StoreablePerson>(userCredential.user.uid)
            .snapshotChanges()
            .pipe(
              filter((el) => el.payload.exists),
              take(1),
              tap(() => this.snackbar.open('Registrierung erfolgreich')),
              map(() => new RegisterSuccess())
            )
        ),
        // report register to analytics
        tap(() => this.analytics.logEvent('sign_up')),
        catchError((error) => {
          console.log(error.code);
          if (error.code === 'auth/email-already-in-use') {
            return of(new RegisterFailure({ error: new EmailAlreadyInUseError(error.message) }));
          } else if (error.code === 'auth/invalid-email') {
            return of(new RegisterFailure({ error: new InvalidEmailError(error.message) }));
          } else if (error.code === 'auth/operation-not-allowed') {
            return of(new RegisterFailure({ error: new OperationNotAllowedError(error.message) }));
          } else if (error.code === 'auth/weak-password') {
            return of(new RegisterFailure({ error: new WeakPasswordError(error.message) }));
          } else {
            return of(new RegisterFailure({ error }));
          }
        })
      )
    )
  );

  @Effect()
  changeName$ = this.actions$.pipe(
    ofType(PersonActionTypes.ChangeName),
    switchMap((action) =>
      this.fns
        .httpsCallable(`updatePersonName/${action.payload.id}`)({ name: action.payload.newName })
        .pipe(
          map(() => new ChangeNameSuccess()),
          tap(() => this.snackbar.open('Name gespeichert')),
          // report to analytics
          tap(() => this.analytics.logEvent('username_changed', { event_category: 'engagement' })),
          catchError((error) => of(new ChangeNameFailure({ error: new CloudFunctionCallError(error.error) }))),
          takeUntil(this.subs.unsubscribe$)
        )
    )
  );

  @Effect()
  sendChangePasswordMail$ = this.actions$.pipe(
    ofType(PersonActionTypes.Reset),
    switchMap((action) =>
      from(this.auth.sendPasswordResetEmail(action.payload.email)).pipe(
        tap(() => this.snackbar.open('Reset E-Mail wurde versendet')),
        map(() => new ResetSuccess()),
        catchError((error) => {
          if (error.code === 'auth/invalid-email') {
            return of(new ResetFailure({ error: new InvalidEmailError(error.message) }));
          } else if (error.code === 'auth/user-not-found') {
            return of(new ResetFailure({ error: new UserNotFoundError(error.message) }));
          } else {
            return of(new ResetFailure({ error }));
          }
        })
      )
    )
  );

  @Effect()
  changePasswordWithCode$ = this.actions$.pipe(
    ofType(PersonActionTypes.ChangePasswordWithCode),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      from(this.auth.confirmPasswordReset(storeState.router.state.queryParams.oobCode, action.payload.password)).pipe(
        tap(() => this.snackbar.open('Password geändert')),
        tap(() => this.router.navigate(['auth', 'login'])),
        map(() => new ChangePasswordWithCodeSuccess()),
        catchError((error) => {
          if (error.code === 'auth/invalid-action-code') {
            return of(new ChangePasswordWithCodeFailure({ error: new CodeInvalidError(error.message) }));
          }
          return of(error);
        })
      )
    )
  );

  constructor(
    private actions$: Actions<PersonActions>,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private fns: AngularFireFunctions,
    private subs: SubscriptionService,
    private analytics: AngularFireAnalytics,
    private router: Router,
    private browser: BrowserService,
    private store: Store<State>,
    private snackbar: MatSnackBar
  ) {}
}
