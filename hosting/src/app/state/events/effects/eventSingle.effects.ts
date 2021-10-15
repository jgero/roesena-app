import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  EventActionTypes,
  EventActions,
  LoadSingleEventSuccess,
  LoadSingleEventFailure,
  RespondToEventSuccess,
  RespondToEventFailure,
} from '../actions/event.actions';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import undefined from 'firebase/compat/firestore';
import { StoreableEvent } from '@utils/interfaces';
import { SubscriptionService } from '@services/subscription.service';
import { convertOne } from '@utils/converters/event-documents';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { PermissionDeniedError } from '@utils/errors/permission-denied-error';
import { CloudFunctionCallError } from '@utils/errors/cloud-function-call-error';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

@Injectable()
export class EventSingleEffects {
  @Effect()
  loadEvent$ = this.actions$.pipe(
    ofType(EventActionTypes.LoadSingleEvent),
    withLatestFrom(this.store),
    // the case where there is no id param is missing -> return empty event
    switchMap(([action, storeState]) => {
      const id = action.payload.loadFromRoute ? storeState.router.state.params.id : action.payload.id;
      if (id) {
        return this.firestore
          .collection<StoreableEvent>('events')
          .doc(id)
          .snapshotChanges()
          .pipe(
            takeUntil(this.subs.unsubscribe$),
            map(convertOne),
            map((event) => new LoadSingleEventSuccess({ event })),
            catchError((error) => {
              if (error.code === 'permission-denied') {
                return of(new LoadSingleEventFailure({ error: new PermissionDeniedError(error.message) }));
              } else {
                return of(new LoadSingleEventFailure({ error }));
              }
            })
          );
      } else {
        {
          return of(
            new LoadSingleEventSuccess({
              event: {
                id: '',
                ownerId: storeState.persons.user.id,
                ownerName: storeState.persons.user.name,
                tags: [],
                description: '',
                deadline: null,
                date: new Date(),
                title: '',
                participants: [],
              },
            })
          );
        }
      }
    })
  );

  @Effect({ dispatch: false })
  markEventAsSeen$ = this.actions$.pipe(
    ofType(EventActionTypes.MarkEventAsSeen),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      this.fns
        .httpsCallable('changeSeenMarker')({ id: storeState.router.state.params.id })
        .pipe(
          // report to analytics
          tap(() => this.analytics.logEvent('event_marked_seen', { event_category: 'engagement' })),
          catchError((error) => of(new RespondToEventFailure({ error: new CloudFunctionCallError(error.error) })))
        )
    )
  );

  @Effect()
  respondToEvent$ = this.actions$.pipe(
    ofType(EventActionTypes.RespondToEvent),
    switchMap((action) =>
      this.fns
        .httpsCallable('respondToEvent')({ id: action.payload.id, amount: action.payload.amount })
        .pipe(
          map(() => new RespondToEventSuccess()),
          // report to analytics
          tap(() => this.analytics.logEvent('respond_to_event', { event_category: 'engagement' })),
          catchError((error) => of(new RespondToEventFailure({ error: new CloudFunctionCallError(error.error) })))
        )
    )
  );

  constructor(
    private actions$: Actions<EventActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService,
    private fns: AngularFireFunctions,
    private analytics: AngularFireAnalytics
  ) {}
}
