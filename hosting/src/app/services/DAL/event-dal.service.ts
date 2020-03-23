import { Injectable } from "@angular/core";
import { AngularFirestore, QuerySnapshot, DocumentData, DocumentSnapshot, DocumentChangeAction } from "@angular/fire/firestore";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import { appEvent } from "src/app/utils/interfaces";
import { TracingStateService } from "../tracing-state.service";

import "firebase/firestore";

@Injectable({
  providedIn: "root"
})
export class EventDALService {
  constructor(private firestore: AngularFirestore, private trace: TracingStateService) {}

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
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Event konnte nicht geladen werden: ${err}`);
          return of(null);
        })
      );
  }

  getByAuthLevel(level: number): Observable<appEvent[]> {
    this.trace.addLoading();
    return this.firestore
      .collection<appEvent>("events", qFn => qFn.where(`authLevel`, "<=", level))
      .get()
      .pipe(
        // map documents to events
        map(convertEventsFromDocuments),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Events konnten nicht geladen werden: ${err}`);
          return of([]);
        })
      );
  }

  getStreamByAuthLevel(level: number): Observable<appEvent[]> {
    this.trace.addLoading();
    return this.firestore
      .collection<appEvent>("events", qFn => qFn.where(`authLevel`, "<=", level))
      .snapshotChanges()
      .pipe(
        map(convertEventFromChangeActions),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Events konnten nicht geladen werden: ${err}`);
          return of([]);
        })
      );
  }

  update(updated: appEvent): Observable<boolean> {
    this.trace.addLoading();
    const id = updated.id;
    delete updated.id;
    return from(
      this.firestore
        .collection("events")
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
        this.trace.$snackbarMessage.next(`Event konnte nicht gespeichert werden: ${err}`);
        return of(false);
      })
    );
  }

  insert(newEv: appEvent): Observable<boolean> {
    this.trace.addLoading();
    delete newEv.id;
    return from(this.firestore.collection("events").add(newEv)).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Event konnte nicht hinzugefügt werden: ${err}`);
        return of(false);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    this.trace.addLoading();
    return from(
      this.firestore
        .collection("events")
        .doc(id)
        .delete()
    ).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gelöscht!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Event konnte nicht gelöscht werden: ${err}`);
        return of(false);
      })
    );
  }
}

function convertEventsFromDocuments(snapshot: QuerySnapshot<DocumentData[]>): appEvent[] {
  let data: any[] = snapshot.docs.map(doc => {
    let data: any = doc.data();
    data.id = doc.id;
    data.startDate = new Date(data.startDate.toDate());
    data.endDate = new Date(data.endDate.toDate());
    return data;
  });
  return data;
}

function convertEventFromDocument(snapshot: DocumentSnapshot<DocumentData>): appEvent {
  let data = snapshot.data();
  data.id = snapshot.id;
  data.startDate = new Date(data.startDate.toDate());
  data.endDate = new Date(data.endDate.toDate());
  return data as appEvent;
}

function convertEventFromChangeActions(snapshot: DocumentChangeAction<appEvent>[]): appEvent[] {
  return snapshot.map(action => {
    let data: any = action.payload.doc.data();
    data.id = action.payload.doc.id;
    data.startDate = new Date(data.startDate.toDate());
    data.endDate = new Date(data.endDate.toDate());
    return data;
  });
}
