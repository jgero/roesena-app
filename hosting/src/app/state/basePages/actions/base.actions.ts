import { Action } from '@ngrx/store';

export enum BaseActionTypes {
  LoadRespondablesSuccess = '[Base] respondable amount loaded',
  LoadRespondablesFailure = '[Base] respondable amount loading failed',
}

export class LoadRespondablesSuccess implements Action {
  readonly type = BaseActionTypes.LoadRespondablesSuccess;
  constructor(public payload: { amount: number }) {}
}

export class LoadRespondablesFailure implements Action {
  readonly type = BaseActionTypes.LoadRespondablesFailure;
  constructor(public payload: { error: any }) {}
}

export type BaseActions = LoadRespondablesSuccess | LoadRespondablesFailure;
