import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import { appEvent } from "src/app/utils/interfaces";
import {
  convertEventFromDocument,
  convertEventsFromDocuments,
  convertEventFromChangeActions
} from "src/app/utils/eventConverter";
import { TracingStateService } from "../tracing-state.service";

@Injectable({
  providedIn: "root"
})
export class EventDALService {
  constructor(private firestore: AngularFirestore, private trace: TracingStateService) {}

  getById(id: string): Observable<appEvent> {
    this.trace.$isLoading.next(true);
    return this.firestore
      .collection("events")
      .doc(id)
      .get()
      .pipe(
        map(convertEventFromDocument),
        tap(() => {
          this.trace.$isLoading.next(false);
        }),
        catchError(err => {
          this.trace.$isLoading.next(false);
          this.trace.$snackbarMessage.next(`Event konnte nicht geladen werden: ${err}`);
          return of(null);
        })
      );
  }

  getByAuthLevel(level: number): Observable<appEvent[]> {
    this.trace.$isLoading.next(true);
    return this.firestore
      .collection<appEvent>("events", qFn => qFn.where(`authLevel`, "<=", level))
      .get()
      .pipe(
        // map documents to events
        map(convertEventsFromDocuments),
        tap(() => {
          this.trace.$isLoading.next(false);
        }),
        catchError(err => {
          this.trace.$isLoading.next(false);
          this.trace.$snackbarMessage.next(`Events konnten nicht geladen werden: ${err}`);
          return of([]);
        })
      );
  }

  getStreamByAuthLevel(level: number): Observable<appEvent[]> {
    this.trace.$isLoading.next(true);
    return this.firestore
      .collection<appEvent>("events", qFn => qFn.where(`authLevel`, "<=", level))
      .snapshotChanges()
      .pipe(
        map(convertEventFromChangeActions),
        tap(() => {
          this.trace.$isLoading.next(false);
        }),
        catchError(err => {
          this.trace.$isLoading.next(false);
          this.trace.$snackbarMessage.next(`Events konnten nicht geladen werden: ${err}`);
          return of([]);
        })
      );
  }

  update(updated: appEvent): Observable<boolean> {
    this.trace.$isLoading.next(true);
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
        this.trace.$isLoading.next(false);
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError(err => {
        this.trace.$isLoading.next(false);
        this.trace.$snackbarMessage.next(`Event konnte nicht gespeichert werden: ${err}`);
        return of(false);
      })
    );
  }

  insert(newEv: appEvent): Observable<boolean> {
    this.trace.$isLoading.next(true);
    delete newEv.id;
    return from(this.firestore.collection("events").add(newEv)).pipe(
      map(() => true),
      tap(() => {
        this.trace.$isLoading.next(false);
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError(err => {
        this.trace.$isLoading.next(false);
        this.trace.$snackbarMessage.next(`Event konnte nicht hinzugefügt werden: ${err}`);
        return of(false);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    this.trace.$isLoading.next(true);
    return from(
      this.firestore
        .collection("events")
        .doc(id)
        .delete()
    ).pipe(
      map(() => true),
      tap(() => {
        this.trace.$isLoading.next(false);
        this.trace.$snackbarMessage.next(`Gelöscht!`);
      }),
      catchError(err => {
        this.trace.$isLoading.next(false);
        this.trace.$snackbarMessage.next(`Event konnte nicht gelöscht werden: ${err}`);
        return of(false);
      })
    );
  }
}
