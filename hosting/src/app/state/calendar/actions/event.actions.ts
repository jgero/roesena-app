import { Action } from '@ngrx/store';
import { AppEvent } from '@utils/interfaces';

export enum EventActionTypes {
  LoadEvents = '[calendar] Load Events',
  DateLoaded = '[calendar] date loaded',
  LoadEventsSuccess = '[calendar] Load Events Success',
  LoadEventsFailure = '[calendar] Load Events Failure',
  GoNextMonth = '[calendar] go to next month',
  GoPreviousMonth = '[calendar] go to previous month',
}

export class LoadEvents implements Action {
  readonly type = EventActionTypes.LoadEvents;
}

export class DateLoaded implements Action {
  readonly type = EventActionTypes.DateLoaded;
  constructor(public payload: { currentDate: Date }) {}
}

export class LoadEventsSuccess implements Action {
  readonly type = EventActionTypes.LoadEventsSuccess;
  constructor(public payload: { events: AppEvent[] }) {}
}

export class LoadEventsFailure implements Action {
  readonly type = EventActionTypes.LoadEventsFailure;
  constructor(public payload: { error: any }) {}
}

export class GoNextMonth implements Action {
  readonly type = EventActionTypes.GoNextMonth;
}

export class GoPreviousMonth implements Action {
  readonly type = EventActionTypes.GoPreviousMonth;
}

export type EventActions = LoadEvents | DateLoaded | LoadEventsSuccess | LoadEventsFailure | GoNextMonth | GoPreviousMonth;
