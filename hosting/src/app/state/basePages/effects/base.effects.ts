import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, tap, filter, withLatestFrom, takeUntil, mergeMap } from 'rxjs/operators';
import { EMPTY, of, merge } from 'rxjs';
import {
  BaseActionTypes,
  BaseActions,
  LoadRespondablesSuccess,
  LoadRespondablesFailure,
  LoadStartpageArticleSuccess,
  LoadStartpageEventSuccess,
  LoadStartpageArticleFailure,
  LoadStartpageEventFailure,
} from '../actions/base.actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers/base.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore, Query, CollectionReference } from '@angular/fire/firestore';
import { StoreableEvent, StoreableArticle } from '@utils/interfaces';

import 'firebase/firestore';
import { convertMany as convertManyEvents } from '@utils/converters/event-documents';
import { Router } from '@angular/router';
import { convertMany as convertManyArticles } from '@utils/converters/article-documents';
import { SubscriptionService } from '@services/subscription.service';

@Injectable()
export class BaseEffects {
  @Effect()
  loadBases$ = this.store.select('user', 'user').pipe(
    // request the events the user is invited to and has not responded
    switchMap((user) => {
      if (user !== null && user.isConfirmedMember) {
        return this.firestore
          .collection<StoreableEvent>(
            'events',
            (qFn) => qFn.where(`deadline`, '>=', new Date())
            // .where(`participants.${user.id}.amount`, '==', -1)
          )
          .snapshotChanges()
          .pipe(
            // convert
            map(convertManyEvents),
            // filter out events that are already responded
            map((vals) => vals.filter((val) => val.participants.find((paricipant) => paricipant.id === user.id).amount < 0)),
            // only return the amount of the events
            map((events) => events.length),
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
      } else {
        // of no user is logged in just return 0
        return of(new LoadRespondablesSuccess({ amount: 0 }));
      }
    })
  );

  @Effect({ dispatch: false })
  navigateToRespondables$ = this.actions$.pipe(
    ofType(BaseActionTypes.LoadRespondablesSuccess),
    // if there are respondables
    filter((action) => action.payload.amount > 0),
    // switch to snackbar action
    switchMap((action) =>
      this.snackbar.open(`Unbeantwortete Termine: ${action.payload.amount}`, 'ANTWORTEN', { duration: undefined }).onAction()
    ),
    // navigate when action is clicked
    tap(() => this.router.navigate(['auth', 'my-events']))
  );

  @Effect()
  loadStartpage$ = this.actions$.pipe(
    ofType(BaseActionTypes.LoadStartpageContent),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      // merge the queries, so both emits will be registered
      return merge(
        // get the articles
        this.firestore
          .collection<StoreableArticle>('articles', (qFn) => qFn.orderBy('created', 'desc').limit(1))
          .snapshotChanges()
          .pipe(
            map(convertManyArticles),
            map((articles) => new LoadStartpageArticleSuccess({ article: articles[0] })),
            catchError((error) => of(new LoadStartpageArticleFailure({ error }))),
            takeUntil(this.subs.unsubscribe$)
          ),
        this.firestore
          .collection<StoreableEvent>('events', (qFn) => {
            let query: Query | CollectionReference = qFn;
            query = query.orderBy('startDate').where('startDate', '>=', new Date());
            if (!storeState.user.user || !storeState.user.user.isConfirmedMember) {
              // if not logged in or not confirmed show public events
              query = query.where('participants', '==', {});
            }
            return query;
          })
          .snapshotChanges()
          .pipe(
            map(convertManyEvents),
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
              // apply limit
              events = events.slice(0, 1);
              return events;
            }),
            map((events) => new LoadStartpageEventSuccess({ event: events[0] })),
            catchError((error) => of(new LoadStartpageEventFailure({ error }))),
            takeUntil(this.subs.unsubscribe$)
          )
      );
    })
  );

  constructor(
    private actions$: Actions<BaseActions>,
    private store: Store<State>,
    private snackbar: MatSnackBar,
    private firestore: AngularFirestore,
    private router: Router,
    private subs: SubscriptionService
  ) {}
}
