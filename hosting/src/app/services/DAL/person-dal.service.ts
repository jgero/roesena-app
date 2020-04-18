import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AngularFireFunctions } from "@angular/fire/functions";
import {
  AngularFirestore,
  DocumentSnapshot,
  DocumentChangeAction,
  Action,
  QueryDocumentSnapshot,
  CollectionReference,
  Query,
} from "@angular/fire/firestore";
import { Observable, of, from } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import "firebase/firestore";

import { appPerson } from "src/app/utils/interfaces";
import { mapToArray, arrayToMap } from "src/app/utils/converters";

interface storeablePerson {
  groups: { [key: string]: boolean };
  isConfirmedMember: boolean;
  name: string;
}

@Injectable({
  providedIn: "root",
})
export class PersonDalService {
  constructor(private firestore: AngularFirestore, private fns: AngularFireFunctions, private snackbar: MatSnackBar) {}

  getPersonById(id: string): Observable<appPerson | null> {
    return this.firestore
      .collection<storeablePerson>("persons")
      .doc<storeablePerson>(id)
      .snapshotChanges()
      .pipe(
        map(convertOne),
        catchError((err) => {
          this.snackbar.open(`Fehler beim laden von Person: ${err}`, "OK");
          return of(null);
        })
      );
  }

  getPersons(onlyConfirmed?: boolean): Observable<appPerson[]> {
    return this.firestore
      .collection<storeablePerson>("persons", (qFn) => {
        let query: CollectionReference | Query = qFn;
        if (onlyConfirmed === true) {
          query = query.where("isConfirmedMember", "==", true);
        }
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(convertMany),
        catchError((err) => {
          this.snackbar.open(`Fehler beim laden von Personen: ${err}`, "OK");
          return of([]);
        })
      );
  }

  update(updated: appPerson): Observable<boolean> {
    return from(
      this.firestore.collection<storeablePerson>("persons").doc<storeablePerson>(updated.id).update(toStorablePerson(updated))
    ).pipe(
      map(() => true),
      catchError((err) => {
        this.snackbar.open(`Fehler beim speichern von Person: ${err}`, "OK");
        return of(false);
      })
    );
  }

  respondToEvent(id: string, amount: number): Observable<boolean> {
    return this.fns
      .httpsCallable("respondToEvent")({ id, amount })
      .pipe(
        map(() => true),
        tap(() => {
          this.snackbar.open(`Gespeichert!`, "OK", { duration: 2000 });
        }),
        catchError((err) => {
          this.snackbar.open(`Fehler beim Speichern der Anzahl, wahrscheinlich ist die Deadline vorbei: ${err}`, "OK");
          return of(false);
        })
      );
  }
}

function toStorablePerson(app: appPerson): storeablePerson {
  const { isConfirmedMember, name } = app;
  return {
    isConfirmedMember,
    name,
    groups: arrayToMap(app.groups),
  };
}

function convertOne(action: Action<DocumentSnapshot<storeablePerson>>): appPerson | null {
  return convertSnapshot(action.payload);
}

function convertMany(action: DocumentChangeAction<storeablePerson>[]): appPerson[] {
  // convert all snapshots to data
  let result = action.map((action) => convertSnapshot(action.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

function convertSnapshot(snapshot: DocumentSnapshot<storeablePerson> | QueryDocumentSnapshot<storeablePerson>): appPerson | null {
  if (!snapshot.data()) return null;
  const { isConfirmedMember, name } = snapshot.data();
  return {
    isConfirmedMember,
    name,
    id: snapshot.id,
    groups: mapToArray(snapshot.data().groups),
  };
}
