import { Action } from '@ngrx/store';
import { AppPerson } from '@utils/interfaces';

export enum PersonActionTypes {
  LoadPersons = '[Person] Load Persons',
  LoadPersonsSuccess = '[Person] Load Persons Success',
  LoadPersonsFailure = '[Person] Load Persons Failure',
  LoadPersonLengthSuccess = '[Person] Load Person length success',
  LoadPersonLengthFailure = '[Person] Load Person length failure',
  UpdatePerson = '[Person] update Persons',
  UpdatePersonSuccess = '[Person] update Person Success',
  UpdatePersonFailure = '[Person] update Person Failure',
}

export class UpdatePerson implements Action {
  readonly type = PersonActionTypes.UpdatePerson;
  constructor(public payload: { person: AppPerson }) {}
}

export class UpdatePersonSuccess implements Action {
  readonly type = PersonActionTypes.UpdatePersonSuccess;
}

export class UpdatePersonFailure implements Action {
  readonly type = PersonActionTypes.UpdatePersonFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadPersons implements Action {
  readonly type = PersonActionTypes.LoadPersons;
  constructor(public payload: { limit: number }) {}
}

export class LoadPersonsSuccess implements Action {
  readonly type = PersonActionTypes.LoadPersonsSuccess;
  constructor(public payload: { persons: AppPerson[] }) {}
}

export class LoadPersonsFailure implements Action {
  readonly type = PersonActionTypes.LoadPersonsFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadPersonLengthSuccess implements Action {
  readonly type = PersonActionTypes.LoadPersonLengthSuccess;
  constructor(public payload: { length: number }) {}
}

export class LoadPersonLengthFailure implements Action {
  readonly type = PersonActionTypes.LoadPersonLengthFailure;
  constructor(public payload: { error: any }) {}
}

export type PersonActions =
  | LoadPersons
  | LoadPersonsSuccess
  | LoadPersonsFailure
  | LoadPersonLengthSuccess
  | LoadPersonLengthFailure
  | UpdatePerson
  | UpdatePersonSuccess
  | UpdatePersonFailure;
