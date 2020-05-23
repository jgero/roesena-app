import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, tap, filter } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { BaseActionTypes, BaseActions, LoadRespondablesSuccess, LoadRespondablesFailure } from '../actions/base.actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers/base.reducer';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserService } from '@services/browser.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreableEvent, AppPerson, AppEvent } from '@utils/interfaces';

import 'firebase/firestore';
import { convertMany } from '@utils/converters/event-documents';
import { Router } from '@angular/router';

@Injectable()
export class BaseEffects {
  @Effect()
  loadBases$ = this.store.select('user', 'user').pipe(
    // request the events the user is invited to and has not responded
    switchMap((user) => {
      if (user !== null && user.isConfirmedMember) {
        return this.firestore
          .collection<StoreableEvent>('events', (qFn) =>
            qFn.where(`deadline`, '>=', new Date()).where('participantsArray', 'array-contains', user.id).orderBy('deadline')
          )
          .snapshotChanges()
          .pipe(
            // convert
            map(convertMany),
            // filter out events that are already responded
            map((vals) => vals.filter((val) => val.participants.find((paricipant) => paricipant.id === user.id).amount < 0)),
            // only return the amount of the events
            map((events) => events.length)
          );
      } else {
        // of no user is logged in just return 0
        return of(0);
      }
    }),
    tap((unresponded) => {
      if (unresponded > 0) {
        this.snackbar
          .open(`Unbeantwortete Termine: ${unresponded}`, 'ANTWORTEN')
          .onAction()
          .subscribe({ next: () => this.router.navigate(['auth', 'my-events']) });
      }
    }),
    map((amount) => new LoadRespondablesSuccess({ amount })),
    catchError((error) => of(new LoadRespondablesFailure({ error })))
  );

  @Effect({ dispatch: false })
  navigateToRespondables$ = this.actions$.pipe(
    ofType(BaseActionTypes.LoadRespondablesSuccess),
    // if there are respondables
    filter((action) => action.payload.amount > 0),
    // switch to snackbar action
    switchMap((action) => this.snackbar.open(`Unbeantwortete Termine: ${action.payload.amount}`, 'ANTWORTEN').onAction()),
    // navigate when action is clicked
    tap(() => this.router.navigate(['auth', 'my-events']))
  );

  @Effect({ dispatch: false })
  pushUpdate$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    // listen to service worker updates
    switchMap(() => this.swUpdate.available),
    // show snackbar if there is one and listen for actions
    switchMap(() => this.snackbar.open('Ein Update für die App ist bereit', 'UPDATE').onAction()),
    // reload the browser on action
    tap(() => this.browser.reload())
  );

  constructor(
    private actions$: Actions<BaseActions>,
    private store: Store<State>,
    private swUpdate: SwUpdate,
    private snackbar: MatSnackBar,
    private browser: BrowserService,
    private firestore: AngularFirestore,
    private router: Router
  ) {}
}
