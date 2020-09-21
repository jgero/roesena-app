import { Action } from '@ngrx/store';
import { AppPerson } from '@utils/interfaces';

export enum PersonActionTypes {
  LoadPersons = '[Person] Load Persons',
  LoadPersonsSuccess = '[Person] Load Persons Success',
  LoadPersonsFailure = '[Person] Load Persons Failure',
  LoadPersonLengthSuccess = '[Person] Load Person length success',
  LoadPersonLengthFailure = '[Person] Load Person length failure',
  ConfirmPerson = '[Person] confirm person',
  ConfirmPersonSuccess = '[Person] confirm person success',
  ConfirmPersonFailure = '[Person] confirm person failure',
  DeletePerson = '[Person] delete person',
  DeletePersonSuccess = '[Person] delete person success',
  DeletePersonFailure = '[Person] delete person failure',
  AddGroup = '[Person] add group to person',
  AddGroupSuccess = '[Person] add group to person success',
  AddGroupFailure = '[Person] add group to person failure',
  RemoveGroup = '[Person] remove group from person',
  RemoveGroupSuccess = '[Person] remove group from person success',
  RemoveGroupFailure = '[Person] remove group from person failure',
}
export class AddGroup implements Action {
  readonly type = PersonActionTypes.AddGroup;
  constructor(public payload: { id: string; group: string }) {}
}

export class AddGroupSuccess implements Action {
  readonly type = PersonActionTypes.AddGroupSuccess;
}

export class AddGroupFailure implements Action {
  readonly type = PersonActionTypes.AddGroupFailure;
  constructor(public payload: { error: any }) {}
}
export class RemoveGroup implements Action {
  readonly type = PersonActionTypes.RemoveGroup;
  constructor(public payload: { id: string; group: string }) {}
}

export class RemoveGroupSuccess implements Action {
  readonly type = PersonActionTypes.RemoveGroupSuccess;
}

export class RemoveGroupFailure implements Action {
  readonly type = PersonActionTypes.RemoveGroupFailure;
  constructor(public payload: { error: any }) {}
}

export class DeletePerson implements Action {
  readonly type = PersonActionTypes.DeletePerson;
  constructor(public payload: { id: string }) {}
}

export class DeletePersonSuccess implements Action {
  readonly type = PersonActionTypes.DeletePersonSuccess;
}

export class DeletePersonFailure implements Action {
  readonly type = PersonActionTypes.DeletePersonFailure;
  constructor(public payload: { error: any }) {}
}

export class ConfirmPerson implements Action {
  readonly type = PersonActionTypes.ConfirmPerson;
  constructor(public payload: { id: string }) {}
}

export class ConfirmPersonSuccess implements Action {
  readonly type = PersonActionTypes.ConfirmPersonSuccess;
}

export class ConfirmPersonFailure implements Action {
  readonly type = PersonActionTypes.ConfirmPersonFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadPersons implements Action {
  readonly type = PersonActionTypes.LoadPersons;
  constructor(public payload: { limit: number; onlyUnconfirmed?: boolean }) {}
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
  | ConfirmPerson
  | ConfirmPersonSuccess
  | ConfirmPersonFailure
  | DeletePerson
  | DeletePersonSuccess
  | DeletePersonFailure
  | AddGroup
  | AddGroupSuccess
  | AddGroupFailure
  | RemoveGroup
  | RemoveGroupSuccess
  | RemoveGroupFailure;
