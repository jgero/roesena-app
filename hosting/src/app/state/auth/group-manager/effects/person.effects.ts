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
  DeletePersonSuccess,
  DeletePersonFailure,
  AddGroupSuccess,
  AddGroupFailure,
  RemoveGroupSuccess,
  RemoveGroupFailure,
} from '../actions/person.actions';
import { SubscriptionService } from '@services/subscription.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { convertMany, toStorablePerson } from '@utils/converters/person-documents';
import { Store } from '@ngrx/store';
import { State } from '../reducers/person.reducer';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';
import { StoreablePerson } from '@utils/interfaces';
import { AngularFireFunctions } from '@angular/fire/functions';
import { DeleteArticleFailure } from '@state/articles/editor/actions/editor.actions';

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

  @Effect({ dispatch: false })
  confirmPerson$ = this.actions$.pipe(
    ofType(PersonActionTypes.ConfirmPerson),
    switchMap((action) =>
      this.fns
        .httpsCallable(`confirmPerson/${action.payload.id}`)({})
        .pipe(
          catchError((err) => {
            console.log(err);
            return of(null);
          })
        )
    )
  );

  @Effect({ dispatch: false })
  deletePerson$ = this.actions$.pipe(
    ofType(PersonActionTypes.DeletePerson),
    switchMap((action) =>
      this.fns
        .httpsCallable(`deletePerson/${action.payload.id}`)({})
        .pipe(
          map(convertMany),
          takeUntil(this.subs.unsubscribe$),
          map(() => new DeletePersonSuccess()),
          catchError((error) => of(new DeletePersonFailure({ error })))
        )
    )
  );

  @Effect({ dispatch: false })
  addGroup$ = this.actions$.pipe(
    ofType(PersonActionTypes.AddGroup),
    switchMap((action) =>
      this.fns
        .httpsCallable(`editGroups/addGroup`)({ id: action.payload.id, group: action.payload.group })
        .pipe(
          map(convertMany),
          takeUntil(this.subs.unsubscribe$),
          map(() => new AddGroupSuccess()),
          catchError((error) => of(new AddGroupFailure({ error })))
        )
    )
  );

  @Effect({ dispatch: false })
  removeGroup$ = this.actions$.pipe(
    ofType(PersonActionTypes.RemoveGroup),
    switchMap((action) =>
      this.fns
        .httpsCallable(`editGroups/removeGroup`)({ id: action.payload.id, group: action.payload.group })
        .pipe(
          map(convertMany),
          takeUntil(this.subs.unsubscribe$),
          map(() => new RemoveGroupSuccess()),
          catchError((error) => of(new RemoveGroupFailure({ error })))
        )
    )
  );

  constructor(
    private actions$: Actions<PersonActions | PageActions>,
    private subs: SubscriptionService,
    private firestore: AngularFirestore,
    private fns: AngularFireFunctions,
    private store: Store<State>
  ) {}
}
