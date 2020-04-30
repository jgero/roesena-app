import { Injectable, OnDestroy } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, from, of, BehaviorSubject, Subscription } from "rxjs";
import { map, switchMap, tap, take, catchError, filter, delay } from "rxjs/operators";

import { appPerson } from "../utils/interfaces";
import { PersonDalService } from "./DAL/person-dal.service";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  $user = new BehaviorSubject<appPerson | null>(undefined);
  private subs: Subscription[] = [];

  constructor(public auth: AngularFireAuth, private personDAO: PersonDalService, private snackbar: MatSnackBar) {
    this.subs.push(
      this.auth.authState.pipe(switchMap((user) => (!!user ? this.personDAO.getById(user.uid) : of(null)))).subscribe({
        next: (user) => {
          this.$user.next(user);
        },
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public login(email: string, password: string): Observable<null> {
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(
      // get the user from the credentials
      map((userCredentials) => userCredentials.user),
      // get the user data from the database
      switchMap((user) => (user ? this.personDAO.getById(user.uid) : of(null))),
      // hide the data from the caller
      map(() => null),
      catchError((err) => {
        this.snackbar.open(`Fehler beim Einloggen: ${err}`, "OK");
        return of(null);
      })
    );
  }

  public sendResetPasswordMail(email: string): Observable<null> {
    return from(this.auth.sendPasswordResetEmail(email)).pipe(
      map(() => null),
      tap(() => {
        this.snackbar.open(`Reset Mail wurde versendet`, "OK");
      }),
      catchError((err) => {
        this.snackbar.open(`Fehler beim senden der Mail: ${err}`, "OK");
        return of(null);
      })
    );
  }

  public changePasswordWithResetCode(pw: string, code: string): Observable<null> {
    return from(this.auth.confirmPasswordReset(code, pw)).pipe(
      map(() => null),
      tap(() => {
        this.snackbar.open(`Passwort geändert!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Fehler beim Passwort ändern: ${err}`, "OK");
        return of(null);
      })
    );
  }

  public logout(): Observable<boolean> {
    return from(this.auth.signOut()).pipe(
      map(() => true),
      catchError((err) => {
        this.snackbar.open(`Fehler beim Ausloggen: ${err}`, "OK");
        return of(false);
      })
    );
  }

  public register(email: string, password: string, name: string): Observable<null> {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      // wait until the person is created in the database
      switchMap((user) =>
        this.personDAO.getById(user.user.uid).pipe(
          filter((el) => !!el),
          take(1)
        )
      ),
      // update to the provided name
      switchMap((person) =>
        this.updateName({
          name,
          id: person.id,
          groups: person.groups,
          isConfirmedMember: person.isConfirmedMember,
        })
      ),
      // remove the data from the observable
      map(() => null),
      catchError((err) => {
        this.snackbar.open(`Fehler beim Registrieren: ${err}`, "OK");
        return of(null);
      })
    );
  }

  public updateName(person: appPerson): Observable<null> {
    return this.personDAO.update(person).pipe(
      // get the user data from the database
      switchMap((user) => (user ? this.personDAO.getById(person.id) : of(null))),
      tap((user: appPerson | null) => this.$user.next(user)),
      tap(() => {
        this.snackbar.open(`Name geändert!`, "OK", { duration: 2000 });
      }),
      map(() => null),
      catchError((err) => {
        this.snackbar.open(`Fehler beim Name ändern: ${err}`, "OK");
        return of(null);
      })
    );
  }
}
