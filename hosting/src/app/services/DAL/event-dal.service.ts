import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  AngularFirestore,
  DocumentChangeAction,
  CollectionReference,
  Query,
  DocumentSnapshot,
  Action,
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentData,
} from "@angular/fire/firestore";
import { Observable, from, of, combineLatest } from "rxjs";
import { map, catchError, tap, delay, take, switchMap } from "rxjs/operators";
import * as fbs from "firebase/app";
import "firebase/firestore";

import { appEvent, appElementDAL } from "src/app/utils/interfaces";
import { AuthService } from "../auth.service";
import { arrayToMap, participantArrayToMap, mapToArray, participantMapToArray } from "src/app/utils/converters";

interface storeableEvent {
  ownerId: string;
  title: string;
  description: string;
  startDate: fbs.firestore.Timestamp;
  endDate: fbs.firestore.Timestamp;
  tags: { [key: string]: boolean };
  deadline: fbs.firestore.Timestamp;
  participants: { [key: string]: number };
  participantsArray: string[];
}

@Injectable({
  providedIn: "root",
})
export class EventDALService implements appElementDAL {
  constructor(private firestore: AngularFirestore, private snackbar: MatSnackBar, private auth: AuthService) {}

  getById(id: string): Observable<appEvent | null> {
    return this.firestore
      .collection<storeableEvent>("events")
      .doc<storeableEvent>(id)
      .snapshotChanges()
      .pipe(
        map(convertOne),
        catchError((err) => {
          this.snackbar.open(`Event konnte nicht geladen werden: ${err}`, "OK");
          return of(null);
        })
      );
  }

  getForMonth(year: number, month: number): Observable<appEvent[]> {
    let results: appEvent[] = [];
    const nextEvent = (last: QueryDocumentSnapshot<storeableEvent>) =>
      this.firestore
        .collection<storeableEvent>("events", (qFn) => qFn.orderBy("endDate").startAfter(last).limit(1))
        .get()
        .pipe(
          map((el: any) => el.docs[0]),
          switchMap((current) => {
            if (current && convertSnapshot(current).startDate.getTime() <= new Date(year, month + 1, 0).getTime()) {
              results.push(convertSnapshot(current));
              return nextEvent(current);
            } else {
              return of(results);
            }
          })
        );
    return this.firestore
      .collection<storeableEvent>("events", (qFn) => qFn.where("endDate", ">=", new Date(year, month, 1)).limit(1))
      .get()
      .pipe(
        map((el: any) => el.docs[0]),
        switchMap((current) => {
          if (current && convertSnapshot(current).startDate.getTime() <= new Date(year, month + 1, 0).getTime()) {
            results.push(convertSnapshot(current));
            return nextEvent(current);
          } else {
            return of(results);
          }
        })
      ) as Observable<appEvent[]>;
  }

  getByTags(tags: string[]): Observable<appEvent[]> {
    const user = this.auth.$user.getValue();
    let stream = this.firestore
      .collection<storeableEvent>("events", (qFn) => {
        let query: CollectionReference | Query = qFn;
        query = query.where(`participants`, "==", {});
        tags.forEach((tag) => {
          query = query.where(`tags.${tag}`, "==", true);
        });
        return query;
      })
      .snapshotChanges()
      .pipe(map(convertMany));
    if (user && user.isConfirmedMember) {
      stream = combineLatest(
        stream,
        // merge the public events with the events where the user is invited
        this.firestore
          .collection<storeableEvent>("events", (qFn) => {
            let query: CollectionReference | Query = qFn;
            query = query.where("participantsArray", "array-contains", user.id);
            tags.forEach((tag) => {
              query = query.where(`tags.${tag}`, "==", true);
            });
            return query;
          })
          .snapshotChanges()
          .pipe(map(convertMany))
      ).pipe(
        // merge the resulting arrays
        map((el) => [...el[0], ...el[1]])
      );
    }
    // add error handling and apply limit
    return stream.pipe(
      catchError((err) => {
        this.snackbar.open(`Events konnten nicht geladen werden: ${err}`, "OK");
        return of([]);
      })
    );
  }

  getAll(limit: number = undefined, cutoffDate: Date = new Date()): Observable<appEvent[]> {
    // only return events that are not already over here!
    const user = this.auth.$user.getValue();
    // query for the public events
    let stream: Observable<appEvent[]> = this.firestore
      .collection<storeableEvent>("events", (qFn) => {
        let query: CollectionReference | Query = qFn;
        query = query.where(`participants`, "==", {}).where("endDate", ">=", cutoffDate).orderBy("endDate");
        if (limit) {
          query = query.limit(limit);
        }
        return query;
      })
      .snapshotChanges()
      .pipe(map(convertMany));
    if (user && user.isConfirmedMember) {
      stream = combineLatest(
        stream,
        // merge the public events with the events where the user is invited
        this.firestore
          .collection<storeableEvent>("events", (qFn) => {
            let query: CollectionReference | Query = qFn;
            query = query
              .where("participantsArray", "array-contains", user.id)
              .where("endDate", ">=", new Date())
              .orderBy("endDate");
            if (limit) {
              query = query.limit(limit);
            }
            return query;
          })
          .snapshotChanges()
          .pipe(map(convertMany))
      ).pipe(
        // merge the resulting arrays
        map((el) => [...el[0], ...el[1]])
      );
    }
    // add error handling and apply limit
    return stream.pipe(
      map((events) => {
        // sort the events first, because after the merging of the observables order could be mixed up
        events.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
        if (limit) {
          // apply limit again
          events = events.slice(0, limit);
        }
        return events;
      }),
      catchError((err) => {
        this.snackbar.open(`Events konnten nicht geladen werden: ${err}`, "OK");
        return of([]);
      })
    );
  }

  getRespondables(): Observable<appEvent[]> {
    const user = this.auth.$user.getValue();
    // nothing to return if user is not logged in or is not confirmed yet
    if (!user || !user.isConfirmedMember) return of([]);
    return this.firestore
      .collection<storeableEvent>("events", (qFn) =>
        qFn.where(`deadline`, ">=", new Date()).where("participantsArray", "array-contains", user.id).orderBy("deadline")
      )
      .snapshotChanges()
      .pipe(
        map(convertMany),
        catchError((err) => {
          this.snackbar.open(`Events konnten nicht geladen werden: ${err}`, "OK");
          return of([]);
        })
      );
  }

  update(updated: appEvent): Observable<boolean> {
    const id = updated.id;
    return from(this.firestore.collection<storeableEvent>("events").doc(id).update(toStorableEvent(updated))).pipe(
      map(() => true),
      tap(() => {
        this.snackbar.open(`Gespeichert!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Event konnte nicht gespeichert werden: ${err}`, "OK");
        return of(false);
      })
    );
  }

  insert(newEv: appEvent): Observable<string | null> {
    return from(this.firestore.collection<storeableEvent>("events").add(toStorableEvent(newEv))).pipe(
      map((docRef) => docRef.id),
      tap(() => {
        this.snackbar.open(`Gespeichert!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Event konnte nicht hinzugefügt werden: ${err}`, "OK");
        return of(null);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return from(this.firestore.collection("events").doc(id).delete()).pipe(
      map(() => true),
      tap(() => {
        this.snackbar.open(`Gelöscht!`, "OK", { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Event konnte nicht gelöscht werden: ${err}`, "OK");
        return of(false);
      })
    );
  }
}

function toStorableEvent(app: appEvent): storeableEvent {
  const { title, description, ownerId } = app;
  return {
    title,
    description,
    ownerId,
    startDate: fbs.firestore.Timestamp.fromDate(app.startDate),
    endDate: fbs.firestore.Timestamp.fromDate(app.endDate),
    tags: arrayToMap(app.tags),
    deadline: app.deadline ? fbs.firestore.Timestamp.fromDate(app.deadline) : null,
    participants: participantArrayToMap(app.participants),
    participantsArray: app.participants.map((participant) => participant.id),
  };
}

function convertOne(action: Action<DocumentSnapshot<storeableEvent>>): appEvent | null {
  return convertSnapshot(action.payload);
}

function convertMany(action: DocumentChangeAction<storeableEvent>[]): appEvent[] {
  // convert all snapshots to data
  let result = action.map((action) => convertSnapshot(action.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

function convertSnapshot(snapshot: DocumentSnapshot<storeableEvent> | QueryDocumentSnapshot<storeableEvent>): appEvent | null {
  if (!snapshot.data()) return null;
  const { title, description, ownerId } = snapshot.data();
  return {
    title,
    description,
    ownerId,
    id: snapshot.id,
    startDate: new Date(snapshot.data().startDate.toDate()),
    endDate: new Date(snapshot.data().endDate.toDate()),
    deadline: snapshot.data().deadline ? new Date(snapshot.data().deadline.toDate()) : null,
    tags: mapToArray(snapshot.data().tags),
    participants: participantMapToArray(snapshot.data().participants),
  };
}
