import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, takeUntil, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  EventActionTypes,
  EventActions,
  UpdateUnrespondedEventAmount,
  LoadEventsForMonthSuccess,
  LoadEventsForMonthFailure,
  LoadUpcomingEventsSuccess,
  LoadUpcomingEventsFailure,
} from '../actions/event.actions';
import { SubscriptionService } from '@services/subscription.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { convertMany } from '@utils/converters/event-documents';
import { Query, CollectionReference } from '@angular/fire/firestore/interfaces';
import { AppEvent } from '@utils/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class EventMultiEffects {
  @Effect()
  loadEvents$ = this.actions$.pipe(
    ofType(EventActionTypes.LoadUpcomingEvents),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('events', (qFn) => {
          let query: Query | CollectionReference = qFn;
          // only take events that are not already over
          query = query.where('startDate', '>=', new Date()).orderBy('startDate');
          // if user is not logged in or not confirmed only get public events
          if (!storeState.persons.user || !storeState.persons.user.isConfirmedMember) {
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
            if (!state.persons.user || !state.persons.user.isConfirmedMember) {
              return events;
            } else {
              // keep the events where there are no participants or the user is participant
              return events.filter(
                (ev) => ev.participants.length === 0 || ev.participants.findIndex((el) => el.id === state.persons.user.id) > -1
              );
            }
          }),
          map((events) => new LoadUpcomingEventsSuccess({ events })),
          catchError((error) => of(new LoadUpcomingEventsFailure({ error })))
        )
    )
  );

  @Effect()
  checkForUnrespondedEvents$ = this.actions$.pipe(
    ofType(EventActionTypes.LoadUpcomingEventsSuccess),
    withLatestFrom(this.store),
    map(([action, storeState]) => {
      const user = storeState.persons.user;
      const events = action.payload.events;
      if (!user || !user.isConfirmedMember || !events || events.length === 0) {
        // if user is not confirmed or there are no events, return
        return [];
      }
      return events.filter((ev) => {
        if (ev.participants.length === 0 || ev.deadline < new Date()) {
          // if there are no participants or deadline is already over event does not count
          return false;
        }
        if (!ev.participants.find((participant) => participant.id === user.id && participant.amount >= 0)) {
          // if user is NOT participant and has NOT responded already event does not count
          return false;
        }
        // otherwise event counts
        return true;
      });
    }),
    tap((unresponded) => {
      if (unresponded.length > 0) {
        this.snackbar
          .open(`Unbeantwortete Termine: ${unresponded.length}`, 'ANTWORTEN', { duration: undefined })
          .onAction()
          .subscribe({ next: () => this.router.navigate(['auth', 'my-events']) });
      }
    }),
    map((unresponded) => new UpdateUnrespondedEventAmount({ unrespondedEvents: unresponded }))
  );

  @Effect()
  loadEventsFoMonth$ = this.actions$.pipe(
    ofType(EventActionTypes.LoadEventsForMonth),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('events', (qFn) => {
          let query: Query | CollectionReference = qFn;
          // get date from router path
          const paramDate = new Date(storeState.router.state.params.date);
          // start date after first day of paramDate month
          query = query.where('startDate', '>=', new Date(paramDate.getFullYear(), paramDate.getMonth(), 1));
          // start date before last day of paramDate month
          query = query.where('startDate', '<=', new Date(paramDate.getFullYear(), paramDate.getMonth() + 1, 0));
          // only public events if not logged in or not confirmed
          const user = storeState.persons.user;
          if (!user || !user.isConfirmedMember) {
            query = query.where('participants', '==', {});
          }
          return query;
        })
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((events) => {
            const currentDate = new Date(storeState.router.state.params.date);
            const value: AppEvent[][] = new Array(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
            ).fill([]);
            const days = value.map((_, index) => {
              const eventsForDay: AppEvent[] = [];
              const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1, 0, 0).getTime();
              const endDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1, 24, 0).getTime();
              events.forEach((event) => {
                if (event.date.getTime() <= endDay && event.date.getTime() >= startDay) {
                  eventsForDay.push(event);
                }
              });
              return eventsForDay;
            });
            return new LoadEventsForMonthSuccess({ days });
          }),
          catchError((error) => of(new LoadEventsForMonthFailure({ error })))
        )
    )
  );

  constructor(
    private actions$: Actions<EventActions>,
    private store: Store<State>,
    private subs: SubscriptionService,
    private firestore: AngularFirestore,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}
}
