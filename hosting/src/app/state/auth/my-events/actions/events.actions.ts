import { Action } from '@ngrx/store';
import { AppEvent } from '@utils/interfaces';

export enum EventsActionTypes {
  LoadEvents = '[my events] Load Events',
  LoadEventsSuccess = '[my events] Load Events Success',
  LoadEventsFailure = '[my events] Load Events Failure',
  RespondToEvent = '[my events] respond to event',
  RespondToEventSuccess = '[my events] respond to event success',
  RespondToEventFailure = '[my events] responding to event failed',
}

export class LoadEvents implements Action {
  readonly type = EventsActionTypes.LoadEvents;
}

export class LoadEventsSuccess implements Action {
  readonly type = EventsActionTypes.LoadEventsSuccess;
  constructor(public payload: { events: AppEvent[] }) {}
}

export class LoadEventsFailure implements Action {
  readonly type = EventsActionTypes.LoadEventsFailure;
  constructor(public payload: { error: any }) {}
}

export class RespondToEvent implements Action {
  readonly type = EventsActionTypes.RespondToEvent;
  constructor(public payload: { amount: number; id: string }) {}
}

export class RespondToEventSuccess implements Action {
  readonly type = EventsActionTypes.RespondToEventSuccess;
}

export class RespondToEventFailure implements Action {
  readonly type = EventsActionTypes.RespondToEventFailure;
  constructor(public payload: { error: any }) {}
}

export type EventsActions =
  | LoadEvents
  | LoadEventsSuccess
  | LoadEventsFailure
  | RespondToEvent
  | RespondToEventSuccess
  | RespondToEventFailure;
