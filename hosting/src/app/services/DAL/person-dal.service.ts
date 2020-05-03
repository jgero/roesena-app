import { Injectable, ChangeDetectorRef, NgZone } from "@angular/core";
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
  QuerySnapshot,
  DocumentData,
} from "@angular/fire/firestore";
import { Observable, of, from, BehaviorSubject, Subject, combineLatest } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import "firebase/firestore";

import { appPerson, paginatedDAL } from "src/app/utils/interfaces";
import { mapToArray, arrayToMap } from "src/app/utils/converters";
import { Direction } from "src/app/utils/enums";

interface storeablePerson {
  groups: { [key: string]: boolean };
  isConfirmedMember: boolean;
  name: string;
}

@Injectable({
  providedIn: "root",
})
export class PersonDalService implements paginatedDAL {
  private pageFirst: QueryDocumentSnapshot<storeablePerson>;
  private pageLast: QueryDocumentSnapshot<storeablePerson>;
  constructor(
    private firestore: AngularFirestore,
    private fns: AngularFireFunctions,
    private snackbar: MatSnackBar,
    private ngZone: NgZone
  ) {}

  getById(id: string): Observable<appPerson | null> {
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

  getAll(): Observable<appPerson[]> {
    return this.firestore
      .collection<storeablePerson>("persons")
      .snapshotChanges()
      .pipe(
        map(convertMany),
        catchError((err) => {
          this.snackbar.open(`Fehler beim laden von Personen: ${err}`, "OK");
          return of([]);
        })
      );
  }

  getBySearchStrings(searchStrings: string[], limit?: number, onlyConfirmed?: boolean): Observable<appPerson[]> {
    return this.firestore
      .collection<storeablePerson>("persons", (qFn) => {
        let query: CollectionReference | Query = qFn;
        searchStrings.forEach((s) => {
          query = query.where("name", "==", s);
        });
        if (onlyConfirmed && onlyConfirmed === true) {
          query = query.where("isConfirmedMember", "==", true);
        }
        if (limit) {
          query = query.limit(limit);
        }
        return query;
      })
      .get()
      .pipe(
        map((el) => el.docs.map((doc) => convertSnapshot(doc as any))),
        catchError((err) => {
          this.snackbar.open(`Fehler beim laden von Personen: ${err}`, "OK");
          return of([]);
        })
      );
  }

  getDocCount(): Observable<number> {
    return this.firestore
      .collection("meta")
      .doc("persons")
      .snapshotChanges()
      .pipe(
        map((el) => (el.payload.data() as { amount: number }).amount),
        catchError((err) => {
          this.snackbar.open(`Fehler beim laden der Personenzahl: ${err}`, "OK");
          return of(0);
        })
      );
  }

  getPage(limit: number, dir: Direction): Observable<appPerson[]> {
    return this.firestore
      .collection<storeablePerson>("persons", (qFn) => {
        let query: CollectionReference | Query = qFn;
        switch (dir) {
          case Direction.initial:
            query = query.orderBy("name").limit(limit);
            break;
          case Direction.forward:
            query = query.orderBy("name").startAfter(this.pageLast).limit(limit);
            break;
          case Direction.back:
            query = query.orderBy("name").endBefore(this.pageFirst).limitToLast(limit);
            break;
        }
        return query;
      })
      .snapshotChanges()
      .pipe(
        tap((el) => {
          if (el.length === 0) throw new Error("empty result");
          this.pageFirst = el[0].payload.doc;
          this.pageLast = el[el.length - 1].payload.doc;
        }),
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
          // this callback is outside of the angular zone, because of that the ngZone stuff is needed to align the snackbar correctly
          this.ngZone.run(() => {
            setTimeout(() => {
              this.snackbar.open("Gespeichert!", "OK", { duration: 2000 });
            }, 0);
          });
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
