import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap, switchMap, takeUntil, withLatestFrom, tap, filter } from 'rxjs/operators';
import { EMPTY, of, merge, from } from 'rxjs';
import {
  LoadPersonsFailure,
  LoadPersonsSuccess,
  PersonActionTypes,
  PersonActions,
  LoadPersonLengthSuccess,
  LoadPersonLengthFailure,
  UpdatePersonSuccess,
  UpdatePersonFailure,
} from '../actions/person.actions';
import { SubscriptionService } from '@services/subscription.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { convertMany, toStorablePerson } from '@utils/converters/person-documents';
import { Store } from '@ngrx/store';
import { State } from '../reducers/person.reducer';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { StoreablePerson } from '@utils/interfaces';

@Injectable()
export class PersonEffects {
  @Effect()
  loadPersons$ = this.actions$.pipe(
    ofType(PersonActionTypes.LoadPersons),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) =>
      merge(
        this.firestore
          .collection('persons', (qFn) => qFn.orderBy('name').limit(storeState.person.limit))
          .snapshotChanges()
          .pipe(
            map(convertMany),
            map((persons) => new LoadPersonsSuccess({ persons })),
            catchError((error) => of(new LoadPersonsFailure({ error }))),
            takeUntil(this.subs.unsubscribe$)
          ),
        this.firestore
          .collection('meta')
          .doc('persons')
          .snapshotChanges()
          .pipe(
            map((docSnapshot) => (docSnapshot.payload.data() as any).amount),
            map((length) => new LoadPersonLengthSuccess({ length })),
            catchError((error) => of(new LoadPersonLengthFailure({ error }))),
            takeUntil(this.subs.unsubscribe$)
          )
      )
    )
  );

  @Effect()
  movePageForward$ = this.actions$.pipe(
    ofType(PageActionTypes.PageForward),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('auth/group-manager')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('persons', (qFn) =>
          qFn.orderBy('name').startAfter(storeState.person.pageLast.name).limit(storeState.person.limit)
        )
        .snapshotChanges()
        .pipe(
          map(convertMany),
          map((persons) => new LoadPersonsSuccess({ persons })),
          catchError((error) => of(new LoadPersonsFailure({ error }))),
          takeUntil(this.subs.unsubscribe$)
        )
    )
  );

  @Effect()
  movePageBackwards$ = this.actions$.pipe(
    ofType(PageActionTypes.PageBackwards),
    withLatestFrom(this.store),
    filter(([action, storeState]) => storeState.router.state.url.includes('auth/group-manager')),
    switchMap(([action, storeState]) =>
      this.firestore
        .collection('persons', (qFn) =>
          qFn.orderBy('name').endBefore(storeState.person.pageFirst.name).limitToLast(storeState.person.limit)
        )
        .snapshotChanges()
        .pipe(
          map(convertMany),
          takeUntil(this.subs.unsubscribe$),
          map((persons) => new LoadPersonsSuccess({ persons })),
          catchError((error) => of(new LoadPersonsFailure({ error })))
        )
    )
  );

  @Effect()
  updatePerson$ = this.actions$.pipe(
    ofType(PersonActionTypes.UpdatePerson),
    switchMap((action) =>
      from(
        this.firestore
          .collection<StoreablePerson>('persons')
          .doc(action.payload.person.id)
          .update(toStorablePerson(action.payload.person))
      ).pipe(
        map(() => new UpdatePersonSuccess()),
        catchError((error) => of(new UpdatePersonFailure({ error })))
      )
    )
  );

  constructor(
    private actions$: Actions<PersonActions | PageActions>,
    private subs: SubscriptionService,
    private firestore: AngularFirestore,
    private store: Store<State>
  ) {}
}
