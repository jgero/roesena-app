import { EventActions, EventActionTypes } from '../actions/event.actions';
import { AppEvent } from '@utils/interfaces';
import * as fromRoot from '@state/state.module';

export const eventFeatureKey = 'events';

interface EventState {
  event: AppEvent;
}

export interface State extends fromRoot.State {
  events: EventState;
}

export const initialState: EventState = {
  event: null,
};

export function reducer(state = initialState, action: EventActions): EventState {
  switch (action.type) {
    case EventActionTypes.LoadEvent:
      return state;

    case EventActionTypes.LoadEventSuccess:
      return { ...state, event: action.payload.event };

    case EventActionTypes.LoadEventFailure:
      return state;

    default:
      return state;
  }
}
