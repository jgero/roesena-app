import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { switchMap, map, catchError, tap, withLatestFrom, take, filter, takeUntil, skip } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';
import {
  AuthActionTypes,
  AuthActions,
  LoginLoaded,
  LoginFailed,
  LogoutLoaded,
  LogoutFailed,
  ChangeNameLoaded,
  ChangeNameFailed,
  ResetLoaded,
  ResetFailed,
  ChangePasswordWithCodeLoaded,
  ChangePasswordWithCodeFailed,
  DoRegister,
  RegisterLoaded,
  RegisterFailed,
} from '../actions/auth.actions';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BrowserService } from '@services/browser.service';
import { AngularFirestore, Action, DocumentSnapshot } from '@angular/fire/firestore';

import 'firebase/firestore';
import { State } from '../reducers/auth.reducer';
import { Store } from '@ngrx/store';
import { StoreablePerson } from '@utils/interfaces';
import { toStorablePerson, convertOne } from '@utils/converters/person-documents';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireFunctions } from '@angular/fire/functions';
import { SubscriptionService } from '@services/subscription.service';
import { CodeInvalidError } from '@utils/errors/code-invalid-error';
import { InvalidEmailError } from '@utils/errors/invalid-email-error';
import { UserDisabledError } from '@utils/errors/user-disabled-error';
import { UserNotFoundError } from '@utils/errors/user-not-found-error';
import { WrongPasswordError } from '@utils/errors/wrong-password-error';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.DoLogin),
    switchMap((action) =>
      from(this.auth.signInWithEmailAndPassword(action.payload.email, action.payload.password)).pipe(
        map(() => new LoginLoaded()),
        catchError((error) => {
          if (error.code === 'auth/invalid-email') {
            return of(new LoginFailed({ error: new InvalidEmailError(error.message) }));
          } else if (error.code === 'auth/user-disabled') {
            return of(new LoginFailed({ error: new UserDisabledError(error.message) }));
          } else if (error.code === 'auth/user-not-found') {
            return of(new LoginFailed({ error: new UserNotFoundError(error.message) }));
          } else if (error.code === 'auth/wrong-password') {
            return of(new LoginFailed({ error: new WrongPasswordError(error.message) }));
          } else {
            return of(new LoginFailed({ error }));
          }
        })
      )
    )
  );

  @Effect({ dispatch: false })
  redirectAfterLogin$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginLoaded),
    // after login is success full wait until the user is loaded, otherwise redirect won't work
    switchMap(() => this.store.select('user', 'user')),
    // skip the first emit of the select
    // this first emit would always be null because no user was logged in and new one is not loaded yet
    skip(1),
    // to prevent redirects when user gets emitted again only take the first
    take(1),
    // now the user is loaded and the redirect can be started
    tap(() => setTimeout(() => this.router.navigate(['auth', 'profile'])))
  );

  @Effect()
  logout$ = this.actions$.pipe(
    ofType(AuthActionTypes.DoLogout),
    switchMap(() =>
      from(this.auth.signOut()).pipe(
        map(() => new LogoutLoaded()),
        catchError((error) => of(new LogoutFailed({ error })))
      )
    )
  );

  @Effect({ dispatch: false })
  redirectAfterLogout$ = this.actions$.pipe(
    ofType(AuthActionTypes.LogoutLoaded),
    // location reload will automatically navigate to the right pages
    tap(() => this.browser.reload())
  );

  @Effect()
  registerUser$ = this.actions$.pipe(
    ofType(AuthActionTypes.DoRegister),
    // create new user in firebase auth
    switchMap((action) => from(this.auth.createUserWithEmailAndPassword(action.payload.email, action.payload.password))),
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
          map(() => new RegisterLoaded()),
          catchError((error) => of(new RegisterFailed({ error })))
        )
    )
  );

  @Effect()
  changeName$ = this.actions$.pipe(
    ofType(AuthActionTypes.DoChangeName),
    switchMap((action) =>
      this.fns
        .httpsCallable(`updatePersonName/${action.payload.id}`)({ name: action.payload.newName })
        .pipe(
          map(() => new ChangeNameLoaded()),
          tap(() => this.snackbar.open('Name gespeichert')),
          catchError((error) => of(new ChangeNameFailed({ error }))),
          takeUntil(this.subs.unsubscribe$)
        )
    )
  );

  @Effect()
  sendChangePasswordMail$ = this.actions$.pipe(
    ofType(AuthActionTypes.DoReset),
    switchMap((action) =>
      from(this.auth.sendPasswordResetEmail(action.payload.email)).pipe(
        tap(() => this.snackbar.open('Reset E-Mail wurde versendet')),
        map(() => new ResetLoaded()),
        catchError((error) => of(new ResetFailed({ error })))
      )
    )
  );

  @Effect()
  changePasswordWithCode$ = this.actions$.pipe(
    ofType(AuthActionTypes.DoChangePasswordWithCode),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      from(this.auth.confirmPasswordReset(storeState.router.state.queryParams.oobCode, action.payload.password)).pipe(
        tap(() => this.snackbar.open('Password geändert')),
        tap(() => this.router.navigate(['auth', 'login'])),
        map(() => new ChangePasswordWithCodeLoaded()),
        catchError((error) => {
          if (error.code === 'auth/invalid-action-code') {
            return of(new ChangePasswordWithCodeFailed({ error: new CodeInvalidError(error.message) }));
          }
          return of(error);
        })
      )
    )
  );

  constructor(
    private actions$: Actions<AuthActions>,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private fns: AngularFireFunctions,
    private subs: SubscriptionService,
    private location: Location,
    private router: Router,
    private browser: BrowserService,
    private store: Store<State>,
    private snackbar: MatSnackBar
  ) {}
}
