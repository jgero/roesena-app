import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, takeUntil, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EventActionTypes, EventActions, LoadAllEventsSuccess, LoadAllEventsFailure } from '../actions/event.actions';
import { SubscriptionService } from '@services/subscription.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Store } from '@ngrx/store';
import { State } from '../reducers/event.reducer';
import { convertMany } from '@utils/converters/event-documents';
import { Query, CollectionReference } from '@angular/fire/firestore/interfaces';
import { AppEvent } from '@utils/interfaces';

@Injectable()
export class EventMultiEffects {
  @Effect()
  loadEvents$ = this.actions$.pipe(
    ofType(EventActionTypes.LoadAllEvents),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('events', (qFn) => {
          let query: Query | CollectionReference = qFn;
          // only take events that are not already over
          query = query.where('startDate', '>=', new Date()).orderBy('startDate');
          // if user is not logged in or not confirmed only get public events
          if (!storeState.user.user || !storeState.user.user.isConfirmedMember) {
            query = query.where('participants', '==', {});
          }
          return query;
        })
        .snapshotChanges()
        .pipe(
          map(convertMany),
          map((res) => [res, storeState]),
          takeUntil(this.subs.unsubscribe$),
          map(([events, state]: [AppEvent[], State]) => {
            // if user is not logged in or not confirmed no filtering is needed
            if (!state.user.user || !state.user.user.isConfirmedMember) {
              return events;
            } else {
              // keep the events where there are no participants or the user is participant
              return events.filter(
                (ev) => ev.participants.length === 0 || ev.participants.findIndex((el) => el.id === state.user.user.id) > -1
              );
            }
          }),
          map((events) => new LoadAllEventsSuccess({ events })),
          catchError((error) => of(new LoadAllEventsFailure({ error })))
        )
    )
  );

  constructor(
    private actions$: Actions<EventActions>,
    private store: Store<State>,
    private subs: SubscriptionService,
    private firestore: AngularFirestore
  ) {}
}
