import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable, from, of } from "rxjs";
import { map, switchMap, filter, tap, take } from "rxjs/operators";
import "firebase/firestore";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public $user = new BehaviorSubject<{ id: string; name: string; authLevel: number }>(null);

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) {}

  public getUserFromServer(): Observable<{ id: string; name: string; authLevel: number } | null> {
    return from(this.auth.currentUser).pipe(
      switchMap(user =>
        user
          ? this.firestore
              .collection("persons")
              .doc(user.uid)
              .get()
              .pipe(map(userDoc => ({ id: userDoc.id, name: userDoc.data().name, authLevel: userDoc.data().authLevel })))
          : of(null)
      ),
      tap(user => this.$user.next(user))
    );
  }

  public login(email: string, password: string): Observable<null> {
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(
      // get the user from the credentials
      map(userCredentials => userCredentials.user),
      // get the user data from the database
      switchMap(user =>
        user
          ? this.firestore
              .collection("persons")
              .doc(user.uid)
              .get()
              .pipe(map(userDoc => ({ id: userDoc.id, name: userDoc.data().name, authLevel: userDoc.data().authLevel })))
          : of(null)
      ),
      // save it to the observable
      tap(user => this.$user.next(user)),
      // hide the data from the caller
      map(_ => null)
    );
  }

  public logout(): Observable<void> {
    return from(this.auth.signOut()).pipe(tap(() => this.$user.next(null)));
  }

  public register(email: string, password: string, name: string): Observable<null> {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      // wait until the person is created in the database
      switchMap(user =>
        this.firestore
          .collection("persons")
          .doc(user.user.uid)
          .valueChanges()
          .pipe(
            // filter out the updates without names
            filter((el: any) => el && !!el.name),
            map(val => {
              val.id = user.user.uid;
              return val;
            }),
            take(1)
          )
      ),
      tap(el => console.log(el)),
      // save it to the observable
      tap(user => this.$user.next(user)),
      // update to the provided name
      switchMap(() => this.updateOwnName(name)),
      // then sign in the newly registered user
      switchMap(() => from(this.auth.signInWithEmailAndPassword(email, password))),
      // get the user from the credentials
      map(userCredentials => userCredentials.user),
      // get the user data from the database
      switchMap(user =>
        user
          ? this.firestore
              .collection("persons")
              .doc(user.uid)
              .get()
              .pipe(map(userDoc => ({ id: userDoc.id, name: userDoc.data().name, authLevel: userDoc.data().authLevel })))
          : of(null)
      ),
      // save it to the observable
      tap(user => this.$user.next(user)),
      // remove the data from the observable
      map(() => null)
    );
  }

  public updateOwnName(name: string): Observable<void> {
    return from(
      this.firestore
        .collection("persons")
        .doc(this.$user.getValue().id)
        .update({ name })
    ).pipe(
      tap(() => {
        const old = this.$user.getValue();
        this.$user.next({ id: old.id, authLevel: old.authLevel, name });
      })
    );
  }

  public updateAuthLevel(id: string, authLevel: number): Observable<null> {
    return from(
      this.firestore
        .collection("persons")
        .doc(id)
        .update({ authLevel })
    ).pipe(map(() => null));
  }

  getAuthLevelText(): string {
    const user = this.$user.getValue();
    if (user) {
      switch (user.authLevel) {
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
    } else {
      return "";
    }
  }
}
