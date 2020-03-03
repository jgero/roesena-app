import { Injectable, OnDestroy } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Subscription, Observable, from, of } from "rxjs";
import { map, switchMap, filter, tap } from "rxjs/operators";
import "firebase/firestore";

@Injectable({
  providedIn: "root"
})
export class AuthService implements OnDestroy {
  public $user = new BehaviorSubject<{ id: string; name: string; authLevel: number }>(null);
  private subs: Subscription[] = [];

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) {
    this.subs.push(
      // watch which user is currently logged-in
      auth.user.subscribe(user => {
        if (user) {
          this.subs.push(
            // get the name of the user from the database
            this.firestore
              .collection("persons")
              .doc(user.uid)
              .get()
              .subscribe(docRef => {
                // update the BehaviourSubject with the user
                if (docRef.data()) {
                  this.$user.next({ name: docRef.data().name, id: user.uid, authLevel: docRef.data().authLevel });
                } else {
                  this.$user.next(null);
                }
              })
          );
        } else {
          this.$user.next(null);
        }
      })
    );
  }

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
      )
    );
  }

  public login(email: string, password: string): Observable<null> {
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(map(_ => null));
  }

  public logout(): Observable<void> {
    return from(this.auth.signOut());
  }

  public register(email: string, password: string): Observable<null> {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      // wait until the person is created in the database
      switchMap(user =>
        this.firestore
          .collection("persons")
          .doc(user.user.uid)
          .valueChanges()
          .pipe(
            // filter out the updates without names
            filter((el: any) => el && !!el.name)
          )
      ),
      // then sign in the newly registered user
      switchMap(_ => from(this.auth.signInWithEmailAndPassword(email, password))),
      // remove the data from the observable
      map(_ => null)
    );
  }

  public updateName(name: string): Observable<void> {
    return from(
      this.firestore
        .collection("persons")
        .doc(this.$user.getValue().id)
        .update({ name })
    ).pipe(
      tap(_ => {
        const old = this.$user.getValue();
        this.$user.next({ id: old.id, authLevel: old.authLevel, name });
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(el => el.unsubscribe());
  }
}
