import { Action } from '@ngrx/store';
import { AppEvent } from '@utils/interfaces';

export enum EventActionTypes {
  LoadEvent = '[Event] Load Event',
  LoadEventSuccess = '[Event] Load Event Success',
  LoadEventFailure = '[Event] Load Event Failure',
  MarkEventAsSeen = '[Event] mark event as seen',
}

export class LoadEvent implements Action {
  readonly type = EventActionTypes.LoadEvent;
}

export class LoadEventSuccess implements Action {
  readonly type = EventActionTypes.LoadEventSuccess;
  constructor(public payload: { event: AppEvent }) {}
}

export class LoadEventFailure implements Action {
  readonly type = EventActionTypes.LoadEventFailure;
  constructor(public payload: { error: any }) {}
}

export class MarkEventAsSeen implements Action {
  readonly type = EventActionTypes.MarkEventAsSeen;
}

export type EventActions = LoadEvent | LoadEventSuccess | LoadEventFailure | MarkEventAsSeen;
