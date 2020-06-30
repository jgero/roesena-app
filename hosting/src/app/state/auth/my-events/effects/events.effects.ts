import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  EventsActionTypes,
  EventsActions,
  LoadEventsSuccess,
  LoadEventsFailure,
  RespondToEventSuccess,
  RespondToEventFailure,
} from '../actions/events.actions';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { switchMap, withLatestFrom, takeUntil, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../reducers/events.reducer';
import { StoreableEvent } from '@utils/interfaces';
import { SubscriptionService } from '@services/subscription.service';
import { convertMany } from '@utils/converters/event-documents';
import { AngularFireFunctions } from '@angular/fire/functions';
import { of } from 'rxjs';

@Injectable()
export class EventsEffects {
  @Effect()
  loadEvents$ = this.actions$.pipe(
    ofType(EventsActionTypes.LoadEvents),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection<StoreableEvent>('events', (qFn) => qFn.orderBy('startDate').where('startDate', '>=', new Date()))
        .snapshotChanges()
        .pipe(
          map(convertMany),
          map((events) => {
            // filter out events where the user is not invited
            events = events.filter((ev) => {
              if (ev.participants.length === 0) {
                return true;
              } else {
                // if event has participants only keep the ones where the user is invited
                return ev.participants.findIndex((part) => part.id === storeState.user.user.id) > -1;
              }
            });
            return events;
          }),
          takeUntil(this.subs.unsubscribe$),
          map((events) => new LoadEventsSuccess({ events })),
          catchError((error) => of(new LoadEventsFailure({ error })))
        )
    )
  );

  @Effect()
  respondToEvent$ = this.actions$.pipe(
    ofType(EventsActionTypes.RespondToEvent),
    switchMap((action) =>
      this.fns
        .httpsCallable('respondToEvent')({ id: action.payload.id, amount: action.payload.amount })
        .pipe(
          map(() => new RespondToEventSuccess()),
          catchError((error) => of(new RespondToEventFailure({ error })))
        )
    )
  );

  constructor(
    private actions$: Actions<EventsActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private fns: AngularFireFunctions,
    private subs: SubscriptionService
  ) {}
}
