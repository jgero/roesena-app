import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentSnapshot, DocumentData, DocumentChangeAction, Action } from "@angular/fire/firestore";
import { AngularFireFunctions } from "@angular/fire/functions";
import { Observable, of, from } from "rxjs";
import { map, tap, catchError, filter } from "rxjs/operators";
import "firebase/firestore";

import { appPerson } from "src/app/utils/interfaces";
import { TracingStateService } from "../tracing-state.service";

@Injectable({
  providedIn: "root"
})
export class PersonDalService {
  constructor(private firestore: AngularFirestore, private trace: TracingStateService, private fns: AngularFireFunctions) {}

  getPersonById(id: string): Observable<appPerson | null> {
    this.trace.addLoading();
    return this.firestore
      .collection("persons")
      .doc(id)
      .get()
      .pipe(
        map(convertPersonFromDocument),
        tap(() => this.trace.completeLoading()),
        catchError(err => {
          this.trace.completeLoading();
          console.error(err);
          this.trace.$snackbarMessage.next(`Fehler beim laden von Person: ${err}`);
          return of(null);
        })
      );
  }

  getPersonStreamById(id: string): Observable<appPerson> {
    this.trace.addLoading();
    return this.firestore
      .collection("persons")
      .doc(id)
      .valueChanges()
      .pipe(
        filter(el => !!el),
        map((val: any) => {
          val.id = id;
          return val;
        }),
        tap(() => this.trace.completeLoading()),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Fehler beim laden von Person: ${err}`);
          return of(null);
        })
      );
  }

  getPersonsStream(): Observable<appPerson[]> {
    this.trace.addLoading();
    return this.firestore
      .collection<{ name: string; authLevel: number }>("persons")
      .snapshotChanges()
      .pipe(
        map(convertPersonsFromChangeAction),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Fehler beim laden von Personen: ${err}`);
          return of([]);
        })
      );
  }

  update(id: string, updated: any): Observable<boolean> {
    this.trace.addLoading();
    return from(
      this.firestore
        .collection("persons")
        .doc(id)
        .update(updated)
    ).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Fehler beim speichern von Person: ${err}`);
        return of(false);
      })
    );
  }

  respondToEvent(id: string, amount: number): Observable<boolean> {
    this.trace.addLoading();
    return this.fns
      .httpsCallable("respondToEvent")({ id, amount })
      .pipe(
        map(() => true),
        tap(() => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Gespeichert!`);
        }),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Fehler beim Speichern der Anzahl: ${err}`);
          return of(false);
        })
      );
  }
}

function convertPersonFromDocument(docSnapshot: DocumentSnapshot<DocumentData>): appPerson | null {
  if (!docSnapshot.data()) return null;
  return { id: docSnapshot.id, name: docSnapshot.data().name, authLevel: docSnapshot.data().authLevel };
}

function convertPersonsFromChangeAction(snapshot: DocumentChangeAction<{ name: string; authLevel: number }>[]): appPerson[] {
  return snapshot.map(val => ({
    name: val.payload.doc.data().name,
    id: val.payload.doc.id,
    authLevel: val.payload.doc.data().authLevel
  }));
}
