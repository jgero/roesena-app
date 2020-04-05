import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentSnapshot, DocumentData, DocumentChangeAction, Action } from "@angular/fire/firestore";
import { AngularFireFunctions } from "@angular/fire/functions";
import { Observable, of, from } from "rxjs";
import { map, tap, catchError, filter } from "rxjs/operators";
import "firebase/firestore";

import { appPerson } from "src/app/utils/interfaces";
import { TracingStateService } from "../tracing-state.service";
import { mapToArray, arrayToMap } from "src/app/utils/converters";

@Injectable({
  providedIn: "root",
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
        catchError((err) => {
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
        filter((el) => !!el),
        map((val: any) => {
          val.id = id;
          return val;
        }),
        tap(() => this.trace.completeLoading()),
        catchError((err) => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Fehler beim laden von Person: ${err}`);
          return of(null);
        })
      );
  }

  getPersonsStream(): Observable<appPerson[]> {
    this.trace.addLoading();
    return this.firestore
      .collection<{ name: string; groups: { [key: string]: boolean } }>("persons")
      .snapshotChanges()
      .pipe(
        map(convertPersonsFromChangeAction),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError((err) => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Fehler beim laden von Personen: ${err}`);
          return of([]);
        })
      );
  }

  update(id: string, updated: appPerson): Observable<boolean> {
    this.trace.addLoading();
    delete updated.id;
    if (updated.groups) (updated.groups as any) = arrayToMap(updated.groups);
    return from(this.firestore.collection("persons").doc(id).update(updated)).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError((err) => {
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
        catchError((err) => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Fehler beim Speichern der Anzahl, wahrscheinlich ist die Deadline vorbei: ${err}`);
          return of(false);
        })
      );
  }
}

function convertPersonFromDocument(docSnapshot: DocumentSnapshot<DocumentData>): appPerson | null {
  if (!docSnapshot.data()) return null;
  return {
    id: docSnapshot.id,
    name: docSnapshot.data().name,
    groups: mapToArray(docSnapshot.data().groups),
    isConfirmedMember: docSnapshot.data().isConfirmedMember,
  };
}

function convertPersonsFromChangeAction(
  snapshot: DocumentChangeAction<{ name: string; groups: { [key: string]: boolean }; isConfirmedMember: boolean }>[]
): appPerson[] {
  return snapshot.map((val) => ({
    name: val.payload.doc.data().name,
    id: val.payload.doc.id,
    groups: mapToArray(val.payload.doc.data().groups),
    isConfirmedMember: val.payload.doc.data().isConfirmedMember,
  }));
}
