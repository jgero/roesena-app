import { Action } from '@ngrx/store';
import { AppEvent } from '@utils/interfaces';

export enum EventActionTypes {
  // single event
  LoadSingleEvent = '[event] load event',
  LoadSingleEventSuccess = '[event] load event success',
  LoadSingleEventFailure = '[event] load event failure',
  // event page
  LoadAllEvents = '[event] load events',
  LoadAllEventsSuccess = '[event] load events success',
  LoadAllEventsFailure = '[event] load events failure',
  // seen marker
  MarkEventAsSeen = '[event] mark event as seen',
  // event mutations
  CreateEvent = '[event] create new event',
  CreateEventSuccess = '[event] create new event success',
  CreateEventFailure = '[event] create new event failure',
  UpdateEvent = '[event] update event',
  UpdateEventSuccess = '[event] update event success',
  UpdateEventFailure = '[event] update event failure',
  DeleteEvent = '[event] delete event',
  DeleteEventSuccess = '[event] delete event success',
  DeleteEventFailure = '[event] delete event failure',
}

// single event
export class LoadSingleEvent implements Action {
  readonly type = EventActionTypes.LoadSingleEvent;
  constructor(public payload: { id: string; loadFromRoute: boolean } = { id: '', loadFromRoute: true }) {}
}
export class LoadSingleEventSuccess implements Action {
  readonly type = EventActionTypes.LoadSingleEventSuccess;
  constructor(public payload: { event: AppEvent }) {}
}
export class LoadSingleEventFailure implements Action {
  readonly type = EventActionTypes.LoadSingleEventFailure;
  constructor(public payload: { error: any }) {}
}

// event page
export class LoadAllEvents implements Action {
  readonly type = EventActionTypes.LoadAllEvents;
}
export class LoadAllEventsSuccess implements Action {
  readonly type = EventActionTypes.LoadAllEventsSuccess;
  constructor(public payload: { events: AppEvent[] }) {}
}
export class LoadAllEventsFailure implements Action {
  readonly type = EventActionTypes.LoadAllEventsFailure;
  constructor(public payload: { error: any }) {}
}

// seen marker
export class MarkEventAsSeen implements Action {
  readonly type = EventActionTypes.MarkEventAsSeen;
}

// event mutations
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
  | LoadSingleEvent
  | LoadSingleEventSuccess
  | LoadSingleEventFailure
  | LoadAllEvents
  | LoadAllEventsSuccess
  | LoadAllEventsFailure
  | MarkEventAsSeen
  | CreateEvent
  | CreateEventSuccess
  | CreateEventFailure
  | UpdateEvent
  | UpdateEventSuccess
  | UpdateEventFailure
  | DeleteEvent
  | DeleteEventSuccess
  | DeleteEventFailure;
