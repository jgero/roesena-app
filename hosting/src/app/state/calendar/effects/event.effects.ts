import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, withLatestFrom, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import {
  LoadEventsFailure,
  LoadEventsSuccess,
  EventActionTypes,
  EventActions,
  DateLoaded,
  LoadEvents,
} from '../actions/event.actions';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { State } from '../reducers/event.reducer';
import { convertMany } from '@utils/converters/event-documents';
import { Query, CollectionReference } from '@angular/fire/firestore/interfaces';
import { Router } from '@angular/router';
import { SubscriptionService } from '@services/subscription.service';

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
          const paramDate = new Date(storeState.router.state.params.date);
          // start date after first day of paramDate month
          query = query.where('startDate', '>=', new Date(paramDate.getFullYear(), paramDate.getMonth(), 1));
          // start date before last day of paramDate month
          query = query.where('startDate', '<=', new Date(paramDate.getFullYear(), paramDate.getMonth() + 1, 0));
          // only public events if not logged in or not confirmed
          const user = storeState.user.user;
          if (!user || !user.isConfirmedMember) {
            query = query.where('participants', '==', {});
          }
          return query;
        })
        .snapshotChanges()
        .pipe(
          takeUntil(this.subs.unsubscribe$),
          map(convertMany),
          map((events) => new LoadEventsSuccess({ events })),
          catchError((error) => of(new LoadEventsFailure({ error })))
        )
    )
  );

  @Effect()
  loadDate$ = this.actions$.pipe(
    ofType(EventActionTypes.LoadEvents),
    withLatestFrom(this.store),
    map(([action, storeState]) => new DateLoaded({ currentDate: new Date(storeState.router.state.params.date) }))
  );

  @Effect()
  navigateNext$ = this.actions$.pipe(
    ofType(EventActionTypes.GoNextMonth),
    withLatestFrom(this.store),
    tap(([action, storeState]) => {
      const d = new Date(storeState.router.state.params.date);
      this.router.navigate(['calendar', new Date(d.getFullYear(), d.getMonth() + 1).toISOString()]);
    }),
    map(() => new LoadEvents())
  );

  @Effect()
  navigatePrevious$ = this.actions$.pipe(
    ofType(EventActionTypes.GoPreviousMonth),
    withLatestFrom(this.store),
    tap(([action, storeState]) => {
      const d = new Date(storeState.router.state.params.date);
      this.router.navigate(['calendar', new Date(d.getFullYear(), d.getMonth() - 1).toISOString()]);
    }),
    map(() => new LoadEvents())
  );

  constructor(
    private actions$: Actions<EventActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService,
    private router: Router
  ) {}
}
