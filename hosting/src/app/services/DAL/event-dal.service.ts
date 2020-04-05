import { Injectable } from "@angular/core";
import { AngularFirestore, QuerySnapshot, DocumentData, DocumentSnapshot, DocumentChangeAction } from "@angular/fire/firestore";
import { Observable, from, of, combineLatest } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import "firebase/firestore";

import { appEvent } from "src/app/utils/interfaces";
import { TracingStateService } from "../tracing-state.service";
import { AuthService } from "../auth.service";
import { arrayToMap, participantArrayToMap, mapToArray, participantMapToArray } from "src/app/utils/converters";

@Injectable({
  providedIn: "root",
})
export class EventDALService {
  constructor(private firestore: AngularFirestore, private trace: TracingStateService, private auth: AuthService) {}

  getById(id: string): Observable<appEvent> {
    this.trace.addLoading();
    return this.firestore
      .collection("events")
      .doc(id)
      .get()
      .pipe(
        map(convertEventFromDocument),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError((err) => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Event konnte nicht geladen werden: ${err}`);
          return of(null);
        })
      );
  }

  getNextPublicEvents(): Observable<appEvent[]> {
    this.trace.addLoading();
    return this.firestore
      .collection("events", (qFn) =>
        qFn.where(`participants`, "==", {}).where("endDate", ">=", new Date()).orderBy("endDate").limit(3)
      )
      .get()
      .pipe(
        map(convertEventsFromDocuments),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError((err) => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Event konnte nicht geladen werden: ${err}`);
          return of(null);
        })
      );
  }

  getAllEvents(): Observable<appEvent[]> {
    const user = this.auth.$user.getValue();
    let obs: Observable<appEvent[]> = this.firestore
      .collection("events", (qFn) => qFn.where(`participants`, "==", {}))
      .snapshotChanges()
      .pipe(map(convertEventFromChangeActions));
    if (user) {
      obs = combineLatest(
        obs,
        // merge the public events with the events where the user is invited
        this.firestore
          .collection("events", (qFn) => qFn.where(`participants.${user.id}`, ">=", -1))
          .snapshotChanges()
          .pipe(map(convertEventFromChangeActions))
      ).pipe(
        // merge the resulting arrays
        map((el) => [...el[0], ...el[1]])
      );
    }
    // add loading and error handling
    this.trace.addLoading();
    return obs.pipe(
      tap(() => {
        this.trace.completeLoading();
      }),
      catchError((err) => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Events konnten nicht geladen werden: ${err}`);
        return of([]);
      })
    );
  }

  getRespondables(): Observable<appEvent[]> {
    this.trace.addLoading();
    const user = this.auth.$user.getValue();
    if (!user) return of([]);
    return this.firestore
      .collection<appEvent>("events", (qFn) => qFn.where(`deadline`, ">=", new Date()).orderBy("deadline"))
      .get()
      .pipe(
        // map documents to events
        map(convertEventsFromDocuments),
        // only use events where the currently logged-in user is invited
        map((events) => events.filter((ev) => ev.participants.findIndex((participant) => participant.id === user.id) >= 0)),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError((err) => {
          console.log(err);
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Events konnten nicht geladen werden: ${err}`);
          return of([]);
        })
      );
  }

  update(updated: appEvent): Observable<boolean> {
    this.trace.addLoading();
    const id = updated.id;
    (updated.tags as any) = arrayToMap(updated.tags);
    (updated.participants as any) = participantArrayToMap(updated.participants);
    delete updated.id;
    return from(this.firestore.collection("events").doc(id).update(updated)).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError((err) => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Event konnte nicht gespeichert werden: ${err}`);
        return of(false);
      })
    );
  }

  insert(newEv: appEvent): Observable<boolean> {
    this.trace.addLoading();
    (newEv.tags as any) = arrayToMap(newEv.tags);
    (newEv.participants as any) = participantArrayToMap(newEv.participants);
    delete newEv.id;
    return from(this.firestore.collection("events").add(newEv)).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError((err) => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Event konnte nicht hinzugefügt werden: ${err}`);
        return of(false);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    this.trace.addLoading();
    return from(this.firestore.collection("events").doc(id).delete()).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gelöscht!`);
      }),
      catchError((err) => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Event konnte nicht gelöscht werden: ${err}`);
        return of(false);
      })
    );
  }
}

function convertEventsFromDocuments(snapshot: QuerySnapshot<DocumentData[]>): appEvent[] {
  let data: any[] = snapshot.docs.map((doc) => {
    let data: any = doc.data();
    data.id = doc.id;
    data.startDate = new Date(data.startDate.toDate());
    data.endDate = new Date(data.endDate.toDate());
    data.deadline = data.deadline ? new Date(data.deadline.toDate()) : null;
    data.tags = mapToArray(data.tags);
    data.participants = participantMapToArray(data.participants);
    return data;
  });
  return data;
}

function convertEventFromDocument(snapshot: DocumentSnapshot<DocumentData>): appEvent {
  let data = snapshot.data();
  data.id = snapshot.id;
  data.startDate = new Date(data.startDate.toDate());
  data.endDate = new Date(data.endDate.toDate());
  data.deadline = data.deadline ? new Date(data.deadline.toDate()) : null;
  data.tags = mapToArray(data.tags);
  data.participants = participantMapToArray(data.participants);
  return data as appEvent;
}

function convertEventFromChangeActions(snapshot: DocumentChangeAction<appEvent>[]): appEvent[] {
  return snapshot.map((action) => {
    let data: any = action.payload.doc.data();
    data.id = action.payload.doc.id;
    data.startDate = new Date(data.startDate.toDate());
    data.endDate = new Date(data.endDate.toDate());
    data.deadline = data.deadline ? new Date(data.deadline.toDate()) : null;
    data.tags = mapToArray(data.tags);
    data.participants = participantMapToArray(data.participants);
    return data;
  });
}
