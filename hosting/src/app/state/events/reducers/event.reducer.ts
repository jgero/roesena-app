import { EventActions, EventActionTypes } from '../actions/event.actions';
import { AppEvent } from '@utils/interfaces';
import * as fromRoot from '@state/state.module';

export const eventFeatureKey = 'events';

interface EventState {
  event: AppEvent;
  isLoading: boolean;
}

export interface State extends fromRoot.State {
  events: EventState;
}

export const initialState: EventState = {
  event: null,
  isLoading: false,
};

export function reducer(state = initialState, action: EventActions): EventState {
  switch (action.type) {
    case EventActionTypes.LoadEvent:
      return { ...state, isLoading: true };

    case EventActionTypes.LoadEventSuccess:
      return { ...state, event: action.payload.event, isLoading: false };

    case EventActionTypes.LoadEventFailure:
      return { ...state, event: null, isLoading: false };

    default:
      return state;
  }
}
