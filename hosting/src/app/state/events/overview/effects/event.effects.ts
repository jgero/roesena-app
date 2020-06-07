import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, withLatestFrom, takeUntil, switchMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { LoadEventsFailure, LoadEventsSuccess, EventActionTypes, EventActions } from '../actions/event.actions';
import { SubscriptionService } from '@services/subscription.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Store } from '@ngrx/store';
import { State } from '../reducers/event.reducer';
import { convertMany } from '@utils/converters/event-documents';
import { Query, CollectionReference } from '@angular/fire/firestore/interfaces';
import { AppEvent } from '@utils/interfaces';

@Injectable()
export class EventEffects {
  @Effect()
  loadEvents$ = this.actions$.pipe(
    ofType(EventActionTypes.LoadEvents),
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
          map(([events, storeState]: [AppEvent[], State]) => {
            // if user is not logged in or not confirmed no filtering is needed
            if (!storeState.user.user || !storeState.user.user.isConfirmedMember) {
              return events;
            } else {
              // keep the events where there are no participants or the user is participant
              return events.filter(
                (ev) => ev.participants.length === 0 || ev.participants.findIndex((el) => el.id === storeState.user.user.id) > -1
              );
            }
          }),
          map((events) => new LoadEventsSuccess({ events })),
          catchError((error) => of(new LoadEventsFailure({ error })))
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
