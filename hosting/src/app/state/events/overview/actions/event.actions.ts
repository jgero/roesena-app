import { Action } from '@ngrx/store';
import { AppEvent } from '@utils/interfaces';

export enum EventActionTypes {
  LoadEvents = '[event overview] Load Events',
  LoadEventsSuccess = '[event overview] Load Events Success',
  LoadEventsFailure = '[event overview] Load Events Failure',
}

export class LoadEvents implements Action {
  readonly type = EventActionTypes.LoadEvents;
}

export class LoadEventsSuccess implements Action {
  readonly type = EventActionTypes.LoadEventsSuccess;
  constructor(public payload: { events: AppEvent[] }) {}
}

export class LoadEventsFailure implements Action {
  readonly type = EventActionTypes.LoadEventsFailure;
  constructor(public payload: { error: any }) {}
}

export type EventActions = LoadEvents | LoadEventsSuccess | LoadEventsFailure;
