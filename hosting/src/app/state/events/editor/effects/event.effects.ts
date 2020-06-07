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
  LoadPersonsSuccess,
  LoadPersonsFailure,
} from '../actions/event.actions';
import { switchMap, map, catchError, tap, withLatestFrom, takeUntil } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { toStorableEvent } from '@utils/converters/event-documents';
import { of, from } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers/event.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany } from '@utils/converters/person-documents';

@Injectable()
export class EventEffects {
  @Effect()
  loadPersons$ = this.actions$.pipe(
    ofType(EventActionTypes.LoadPersons),
    switchMap(() =>
      this.firestore
        .collection('persons', (qFn) => qFn.where('isConfirmedMember', '==', true))
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((persons) => new LoadPersonsSuccess({ persons })),
          catchError((error) => of(new LoadPersonsFailure({ error })))
        )
    )
  );

  @Effect()
  updateEvent$ = this.actions$.pipe(
    ofType(EventActionTypes.UpdateEvent),
    switchMap((action) =>
      from(this.firestore.collection('events').doc(action.payload.event.id).update(toStorableEvent(action.payload.event))).pipe(
        map(() => new UpdateEventSuccess()),
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
        map(() => new DeleteEventSuccess()),
        catchError((error) => of(new DeleteEventFailure({ error })))
      )
    )
  );

  constructor(
    private actions$: Actions<EventActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private router: Router,
    private subs: SubscriptionService
  ) {}
}
