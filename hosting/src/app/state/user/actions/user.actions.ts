import { Action } from '@ngrx/store';
import { AppPerson } from '@utils/interfaces';

export enum UserActionTypes {
  LoadUserSuccess = '[User] Load User Success',
  LoadUserFailure = '[User] Load User Failure',
}

export class LoadUserSuccess implements Action {
  readonly type = UserActionTypes.LoadUserSuccess;
  constructor(public payload: { user: AppPerson }) {}
}

export class LoadUserFailure implements Action {
  readonly type = UserActionTypes.LoadUserFailure;
  constructor(public payload: { error: any }) {}
}

export type UserActions = LoadUserSuccess | LoadUserFailure;
