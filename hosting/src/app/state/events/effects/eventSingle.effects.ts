import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { EventActionTypes, EventActions, LoadSingleEventSuccess, LoadSingleEventFailure } from '../actions/event.actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers/event.reducer';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { StoreableEvent } from '@utils/interfaces';
import { SubscriptionService } from '@services/subscription.service';
import { convertOne } from '@utils/converters/event-documents';
import { AngularFireFunctions } from '@angular/fire/functions';
import { PermissionDeniedError } from '@utils/errors/permission-denied-error';

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
                ownerId: storeState.user.user.id,
                ownerName: storeState.user.user.name,
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
          catchError((err) => {
            console.log(err);
            return of(null);
          })
        )
    )
  );

  constructor(
    private actions$: Actions<EventActions>,
    private store: Store<State>,
    private firestore: AngularFirestore,
    private subs: SubscriptionService,
    private fns: AngularFireFunctions
  ) {}
}
