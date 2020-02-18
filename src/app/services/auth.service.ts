import { Injectable, OnDestroy } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Subscription } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService implements OnDestroy {
  public $user = new BehaviorSubject<{ id: string; name: string }>(null);
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
                this.$user.next({ name: docRef.data().name, id: user.uid });
              })
          );
        } else {
          this.$user.next(null);
        }
      })
    );
  }

  public login(username: string, password: string): void {
    this.auth.signInWithEmailAndPassword(username, password);
  }

  public logout(): void {
    this.auth.signOut();
  }

  public register(email: string, password: string, displayedName: string): void {
    this.auth.createUserWithEmailAndPassword(email, password).then(el =>
      this.firestore
        .collection("persons")
        .doc(el.user.uid)
        .set({ name: displayedName })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(el => el.unsubscribe());
  }
}