import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AngularFirestore,
  DocumentChangeAction,
  CollectionReference,
  Query,
  DocumentSnapshot,
  Action,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { Observable, from, of, combineLatest, concat } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import * as fbs from 'firebase/app';
import 'firebase/firestore';

import { AppEvent, AppElementDAL } from 'src/app/utils/interfaces';
import { Direction } from 'src/app/utils/enums';
import { participantArrayToMap, participantMapToArray } from '@utils/converters/participants';
import { arrayToMap, mapToArray } from '@utils/converters/map-array-general';

interface StoreableEvent {
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  startDate: fbs.firestore.Timestamp;
  endDate: fbs.firestore.Timestamp;
  months: { year: number; month: number }[];
  tags: { [key: string]: boolean };
  deadline: fbs.firestore.Timestamp;
  participants: { [key: string]: { amount: number; name: string; hasUnseenChanges: boolean | null } };
  participantsArray: string[];
}

@Injectable({
  providedIn: 'root',
})
export class EventDALService implements AppElementDAL {
  private pageFirst: QueryDocumentSnapshot<StoreableEvent>;
  private pageLast: QueryDocumentSnapshot<StoreableEvent>;
  constructor(private firestore: AngularFirestore, private snackbar: MatSnackBar) {}

  getById(id: string): Observable<AppEvent | null> {
    return this.firestore
      .collection<StoreableEvent>('events')
      .doc<StoreableEvent>(id)
      .snapshotChanges()
      .pipe(
        map(convertOne),
        catchError((err) => {
          this.snackbar.open(`Event konnte nicht geladen werden: ${err}`, 'OK');
          return of(null);
        })
      );
  }

  getForMonth(year: number, month: number): Observable<AppEvent[]> {
    const user = this.auth.$user.getValue();
    return this.firestore
      .collection<StoreableEvent>('events', (qFn) => {
        let query: CollectionReference | Query = qFn;
        // only query for public events when user is not logged in or confirmed, otherwise all events can be seen
        if (!user || !user.isConfirmedMember) {
          query = query.where(`participants`, '==', {});
        }
        query = query.where('months', 'array-contains', { year, month });
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(convertMany),
        // keep public events and the ones where the user is invited
        map(
          (evs) => evs.filter((ev) => ev.participants.length === 0 || !!ev.participants.find((part) => part.id === user.id)),
          catchError((err) => {
            this.snackbar.open(`Events konnten nicht geladen werden: ${err}`, 'OK');
            return of([]);
          })
        )
      );
  }

  getBySearchStrings(tags: string[], limit = 20): Observable<AppEvent[]> {
    const user = this.auth.$user.getValue();
    let stream = this.firestore
      .collection<StoreableEvent>('events', (qFn) => {
        let query: CollectionReference | Query = qFn;
        query = query.where(`participants`, '==', {});
        query = query.limit(limit);
        tags.forEach((tag) => {
          query = query.where(`tags.${tag}`, '==', true);
        });
        return query;
      })
      .snapshotChanges()
      .pipe(map(convertMany));
    if (user && user.isConfirmedMember) {
      stream = combineLatest([
        stream,
        // merge the public events with the events where the user is invited
        this.firestore
          .collection<StoreableEvent>('events', (qFn) => {
            let query: CollectionReference | Query = qFn;
            query = query.where('participantsArray', 'array-contains', user.id);
            tags.forEach((tag) => {
              query = query.where(`tags.${tag}`, '==', true);
            });
            return query;
          })
          .snapshotChanges()
          .pipe(map(convertMany)),
      ]).pipe(
        // merge the resulting arrays
        map((el) => [...el[0], ...el[1]])
      );
    }
    // add error handling and apply limit
    return stream.pipe(
      catchError((err) => {
        this.snackbar.open(`Events konnten nicht geladen werden: ${err}`, 'OK');
        return of([]);
      })
    );
  }

  // getPage(limit: number, dir: Direction, cutoffDate: Date = new Date()): Observable<AppEvent[]> {
  //   return this.firestore
  //     .collection<StoreableEvent>('articles', (qFn) => {
  //       let query: CollectionReference | Query = qFn;
  //       // always order by creation date
  //       query = query.orderBy('created', 'desc');
  //       // paginate the data
  //       switch (dir) {
  //         case Direction.initial:
  //           query = query.limit(limit);
  //           break;
  //         case Direction.forward:
  //           query = query.startAfter(this.pageLast).limit(limit);
  //           break;
  //         case Direction.back:
  //           query = query.endBefore(this.pageFirst).limitToLast(limit);
  //           break;
  //       }
  //       return query;
  //     })
  //     .snapshotChanges()
  //     .pipe(
  //       tap((el) => {
  //         if (el.length === 0) {
  //           throw new Error('empty result');
  //         }
  //         this.pageFirst = el[0].payload.doc;
  //         this.pageLast = el[el.length - 1].payload.doc;
  //       }),
  //       map(convertMany),
  //       catchError((err) => {
  //         this.snackbar.open(`Fehler beim laden von Artikeln: ${err}`, 'OK');
  //         return of([]);
  //       })
  //     );
  // }

  getAll(limit?: number, cutoffDate: Date = new Date()): Observable<AppEvent[]> {
    // only return events that are not already over here!
    const user = this.auth.$user.getValue();
    // query for the public events
    let stream: Observable<AppEvent[]> = this.firestore
      .collection<StoreableEvent>('events', (qFn) => {
        let query: CollectionReference | Query = qFn;
        query = query.where(`participants`, '==', {}).where('endDate', '>=', cutoffDate).orderBy('endDate');
        if (limit) {
          query = query.limit(limit);
        }
        return query;
      })
      .snapshotChanges()
      .pipe(map(convertMany));
    if (user && user.isConfirmedMember) {
      stream = combineLatest([
        stream,
        // merge the public events with the events where the user is invited
        this.firestore
          .collection<StoreableEvent>('events', (qFn) => {
            let query: CollectionReference | Query = qFn;
            query = query
              .where('participantsArray', 'array-contains', user.id)
              .where('endDate', '>=', new Date())
              .orderBy('endDate');
            if (limit) {
              query = query.limit(limit);
            }
            return query;
          })
          .snapshotChanges()
          .pipe(map(convertMany)),
      ]).pipe(
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
        this.snackbar.open(`Events konnten nicht geladen werden: ${err}`, 'OK');
        return of([]);
      })
    );
  }

  getRespondables(): Observable<AppEvent[]> {
    const user = this.auth.$user.getValue();
    // nothing to return if user is not logged in or is not confirmed yet
    if (!user || !user.isConfirmedMember) {
      return of([]);
    }
    return this.firestore
      .collection<StoreableEvent>('events', (qFn) =>
        qFn.where(`deadline`, '>=', new Date()).where('participantsArray', 'array-contains', user.id).orderBy('deadline')
      )
      .snapshotChanges()
      .pipe(
        map(convertMany),
        catchError((err) => {
          this.snackbar.open(`Events konnten nicht geladen werden: ${err}`, 'OK');
          return of([]);
        })
      );
  }

  update(updated: AppEvent): Observable<boolean> {
    const id = updated.id;
    return from(this.firestore.collection<StoreableEvent>('events').doc(id).update(toStorableEvent(updated))).pipe(
      map(() => true),
      tap(() => {
        this.snackbar.open(`Gespeichert!`, 'OK', { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Event konnte nicht gespeichert werden: ${err}`, 'OK');
        return of(false);
      })
    );
  }

  insert(newEv: AppEvent): Observable<string | null> {
    return from(this.firestore.collection<StoreableEvent>('events').add(toStorableEvent(newEv))).pipe(
      map((docRef) => docRef.id),
      tap(() => {
        this.snackbar.open(`Gespeichert!`, 'OK', { duration: 2000 });
      }),
      catchError((err) => {
        this.snackbar.open(`Event konnte nicht hinzugefügt werden: ${err}`, 'OK');
        return of(null);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return this.snackbar
      .open('Sind Sie sich sicher?', 'LÖSCHEN', { duration: 5000 })
      .afterDismissed()
      .pipe(
        // true if dismissed on click on action button, false if dismissed otherwise (by function call or timeout)
        map((el) => el.dismissedByAction),
        // switch to actual deletion if dismissed by button click
        switchMap((dismissedByAction) => {
          if (dismissedByAction) {
            // because the void observable of the delete operation will never emit
            // merge it with an observable, which just emits true to trigger the snackbar
            return concat<boolean>(from(this.firestore.collection('events').doc(id).delete()), of(true));
          } else {
            return of(false);
          }
        }),
        // on success show message
        tap((success) => {
          if (success) {
            this.snackbar.open(`Gelöscht!`, 'OK', { duration: 2000 });
          }
        }),
        // on error show message and return false
        catchError((err) => {
          this.snackbar.open(`Event konnte nicht gelöscht werden: ${err}`, 'OK');
          return of(false);
        })
      );
  }
}

function toStorableEvent(app: AppEvent): StoreableEvent {
  const { title, description, ownerId, ownerName, startDate, endDate } = app;
  // create the array with the month and year numbers for calendar month queries
  const months: { year: number; month: number }[] = [];
  let month = startDate.getMonth();
  let year = startDate.getFullYear();
  months.push({ year, month });
  while (year !== endDate.getFullYear() || month !== endDate.getMonth()) {
    if (month === 11) {
      month = 0;
      year += 1;
    } else {
      month += 1;
    }
    months.push({ year, month });
  }
  return {
    title,
    description,
    ownerId,
    ownerName,
    startDate: fbs.firestore.Timestamp.fromDate(app.startDate),
    endDate: fbs.firestore.Timestamp.fromDate(app.endDate),
    months,
    tags: arrayToMap(app.tags),
    deadline: app.deadline ? fbs.firestore.Timestamp.fromDate(app.deadline) : null,
    participants: participantArrayToMap(app.participants),
    participantsArray: app.participants.map((participant) => participant.id),
  };
}

function convertOne(action: Action<DocumentSnapshot<StoreableEvent>>): AppEvent | null {
  return convertSnapshot(action.payload);
}

function convertMany(action: DocumentChangeAction<StoreableEvent>[]): AppEvent[] {
  // convert all snapshots to data
  let result = action.map((a) => convertSnapshot(a.payload.doc));
  // filter out the 'null' elements if there are some
  result = result.filter((val) => !!val);
  return result;
}

function convertSnapshot(snapshot: DocumentSnapshot<StoreableEvent> | QueryDocumentSnapshot<StoreableEvent>): AppEvent | null {
  if (!snapshot.data()) {
    return null;
  }
  const { title, description, ownerId, ownerName } = snapshot.data();
  return {
    title,
    description,
    ownerId,
    ownerName,
    id: snapshot.id,
    startDate: new Date(snapshot.data().startDate.toDate()),
    endDate: new Date(snapshot.data().endDate.toDate()),
    deadline: snapshot.data().deadline ? new Date(snapshot.data().deadline.toDate()) : null,
    tags: mapToArray(snapshot.data().tags),
    participants: participantMapToArray(snapshot.data().participants),
  };
}
