import { Action } from '@ngrx/store';
import { AppEvent, AppPerson } from '@utils/interfaces';

export enum EventActionTypes {
  LoadPersons = '[Event Editor] load Persons',
  LoadPersonsSuccess = '[Event Editor] load Persons success',
  LoadPersonsFailure = '[Event Editor] load Persons failure',
  CreateEvent = '[Event Editor] create new event',
  CreateEventSuccess = '[Event Editor] create new event success',
  CreateEventFailure = '[Event Editor] create new event failure',
  UpdateEvent = '[Event Editor] update event',
  UpdateEventSuccess = '[Event Editor] update event success',
  UpdateEventFailure = '[Event Editor] update event failure',
  DeleteEvent = '[Event Editor] delete event',
  DeleteEventSuccess = '[Event Editor] delete event success',
  DeleteEventFailure = '[Event Editor] delete event failure',
}

export class LoadPersons implements Action {
  readonly type = EventActionTypes.LoadPersons;
}
export class LoadPersonsSuccess implements Action {
  readonly type = EventActionTypes.LoadPersonsSuccess;
  constructor(public payload: { persons: AppPerson[] }) {}
}
export class LoadPersonsFailure implements Action {
  readonly type = EventActionTypes.LoadPersonsFailure;
  constructor(public payload: { error: any }) {}
}
export class CreateEvent implements Action {
  readonly type = EventActionTypes.CreateEvent;
  constructor(public payload: { event: AppEvent }) {}
}
export class CreateEventSuccess implements Action {
  readonly type = EventActionTypes.CreateEventSuccess;
}
export class CreateEventFailure implements Action {
  readonly type = EventActionTypes.CreateEventFailure;
  constructor(public payload: { error: any }) {}
}
export class UpdateEvent implements Action {
  readonly type = EventActionTypes.UpdateEvent;
  constructor(public payload: { event: AppEvent }) {}
}
export class UpdateEventSuccess implements Action {
  readonly type = EventActionTypes.UpdateEventSuccess;
}
export class UpdateEventFailure implements Action {
  readonly type = EventActionTypes.UpdateEventFailure;
  constructor(public payload: { error: any }) {}
}
export class DeleteEvent implements Action {
  readonly type = EventActionTypes.DeleteEvent;
}
export class DeleteEventSuccess implements Action {
  readonly type = EventActionTypes.DeleteEventSuccess;
}
export class DeleteEventFailure implements Action {
  readonly type = EventActionTypes.DeleteEventFailure;
  constructor(public payload: { error: any }) {}
}

export type EventActions =
  | LoadPersons
  | LoadPersonsSuccess
  | LoadPersonsFailure
  | CreateEvent
  | CreateEventSuccess
  | CreateEventFailure
  | UpdateEvent
  | UpdateEventSuccess
  | UpdateEventFailure
  | DeleteEvent
  | DeleteEventSuccess
  | DeleteEventFailure;
