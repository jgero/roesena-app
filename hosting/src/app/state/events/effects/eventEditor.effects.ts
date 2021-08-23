import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  EventActionTypes,
  EventActions,
  UpdateEventSuccess,
  UpdateEventFailure,
  CreateEventSuccess,
  CreateEventFailure,
  DeleteEventSuccess,
  DeleteEventFailure,
} from '../actions/event.actions';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { toStorableEvent } from '@utils/converters/event-documents';
import { of, from } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Injectable()
export class EventEditorEffects {
  @Effect()
  updateEvent$ = this.actions$.pipe(
    ofType(EventActionTypes.UpdateEvent),
    switchMap((action) =>
      from(this.firestore.collection('events').doc(action.payload.event.id).update(toStorableEvent(action.payload.event))).pipe(
        map(() => new UpdateEventSuccess()),
        tap(() => this.snackbar.open('Gespeichert')),
        // report to analytics
        tap(() => this.analytics.logEvent('update_event', { event_category: 'engagement' })),
        catchError((error) => of(new UpdateEventFailure({ error })))
      )
    )
  );

  @Effect()
  createEvent$ = this.actions$.pipe(
    ofType(EventActionTypes.CreateEvent),
    switchMap((action) =>
      from(this.firestore.collection('events').add(toStorableEvent(action.payload.event))).pipe(
        tap((insert) => this.router.navigate(['events', 'edit', insert.id])),
        map(() => new CreateEventSuccess()),
        // report to analytics
        tap(() => this.analytics.logEvent('update_event', { event_category: 'engagement' })),
        tap(() => this.snackbar.open('Gespeichert')),
        catchError((error) => of(new CreateEventFailure({ error })))
      )
    )
  );

  @Effect()
  deleteEvent$ = this.actions$.pipe(
    ofType(EventActionTypes.DeleteEvent),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      from(this.firestore.collection('events').doc(storeState.router.state.params.id).delete()).pipe(
        tap(() => this.router.navigate(['search', 'events'])),
        map(() => new DeleteEventSuccess()),
        // report to analytics
        tap(() => this.analytics.logEvent('update_event', { event_category: 'engagement' })),
        tap(() => this.snackbar.open('Gelöscht')),
        catchError((error) => of(new DeleteEventFailure({ error })))
      )
    )
  );

  constructor(
    private actions$: Actions<EventActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private analytics: AngularFireAnalytics,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}
}
