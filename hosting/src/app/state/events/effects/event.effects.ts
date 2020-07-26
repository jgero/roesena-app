import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, withLatestFrom, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { LoadEventFailure, LoadEventSuccess, EventActionTypes, EventActions } from '../actions/event.actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers/event.reducer';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { StoreableEvent } from '@utils/interfaces';
import { SubscriptionService } from '@services/subscription.service';
import { convertOne } from '@utils/converters/event-documents';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class EventEffects {
  @Effect()
  loadEvent$ = this.actions$.pipe(
    ofType(EventActionTypes.LoadEvent),
    withLatestFrom(this.store),
    // the case where there is no id param is missing -> return empty event
    switchMap(([action, storeState]) => {
      if (storeState.router.state.params.id) {
        return this.firestore
          .collection<StoreableEvent>('events')
          .doc(storeState.router.state.params.id)
          .snapshotChanges()
          .pipe(
            takeUntil(this.subs.unsubscribe$),
            map(convertOne),
            map((event) => new LoadEventSuccess({ event })),
            catchError((error) => of(new LoadEventFailure({ error })))
          );
      } else {
        {
          return of(
            new LoadEventSuccess({
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
