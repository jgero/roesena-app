import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, from, of, BehaviorSubject } from "rxjs";
import { map, switchMap, filter, tap, take, catchError } from "rxjs/operators";

import { appPerson } from "../utils/interfaces";
import { PersonDalService } from "./DAL/person-dal.service";
import { TracingStateService } from "./tracing-state.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  $user = new BehaviorSubject<appPerson | null>(null);

  constructor(public auth: AngularFireAuth, private personDAO: PersonDalService, private trace: TracingStateService) {
    this.auth.authState.pipe(switchMap(user => (user ? this.personDAO.getPersonById(user.uid) : of(null)))).subscribe({
      next: user => {
        this.$user.next(user);
      }
    });
  }

  public login(email: string, password: string): Observable<null> {
    this.trace.addLoading();
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(
      // get the user from the credentials
      map(userCredentials => userCredentials.user),
      // get the user data from the database
      switchMap(user => (user ? this.personDAO.getPersonById(user.uid) : of(null))),
      // hide the data from the caller
      map(() => null),
      tap(() => {
        this.trace.completeLoading();
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Fehler beim Einloggen: ${err}`);
        return of(false);
      })
    );
  }

  public sendResetPasswordMail(email: string): Observable<null> {
    this.trace.addLoading();
    return from(this.auth.sendPasswordResetEmail(email)).pipe(
      map(() => null),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Reset Mail wurde versendet`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Fehler beim senden der Mail: ${err}`);
        return of(null);
      })
    );
  }

  public changePasswordWithResetCode(pw: string, code: string): Observable<null> {
    this.trace.addLoading();
    return from(this.auth.confirmPasswordReset(code, pw)).pipe(
      map(() => null),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Passwort geändert!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Fehler beim Passwort ändern: ${err}`);
        return of(null);
      })
    );
  }

  public logout(): Observable<boolean> {
    this.trace.addLoading();
    return from(this.auth.signOut()).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Fehler beim Ausloggen: ${err}`);
        return of(false);
      })
    );
  }

  public register(email: string, password: string, name: string): Observable<null> {
    this.trace.addLoading();
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      // wait until the person is created in the database
      switchMap(user => this.personDAO.getPersonStreamById(user.user.uid).pipe(take(1))),
      // update to the provided name
      switchMap(person => this.updateName(person.id, name)),
      // then sign in the newly registered user
      switchMap(() => from(this.auth.signInWithEmailAndPassword(email, password))),
      // remove the data from the observable
      map(() => null),
      tap(() => {
        this.trace.completeLoading();
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Fehler beim Registrieren: ${err}`);
        return of(null);
      })
    );
  }

  public updateName(id: string, name: string): Observable<null> {
    // this.trace.completeLoading();
    return this.personDAO.update(id, { name }).pipe(
      // get the user data from the database
      switchMap(user => (user ? this.personDAO.getPersonById(id) : of(null))),
      tap((user: appPerson | null) => this.$user.next(user)),
      map(() => null)
    );
  }

  public updateAuthLevel(id: string, authLevel: number): Observable<null> {
    return this.personDAO.update(id, { authLevel }).pipe(map(() => null));
  }

  getAuthLevelText(level: number): string {
    switch (level) {
      case 0:
        return "Gast";
      case 1:
        return "Mitglied";
      case 2:
        return "Gruppenleiter/Elferrat";
      case 3:
        return "Präsidium";
      case 4:
        return "Admin";
      default:
        return "Fehler";
    }
  }
}
