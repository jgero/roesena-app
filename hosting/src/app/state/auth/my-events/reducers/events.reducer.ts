import { EventsActions, EventsActionTypes } from '../actions/events.actions';
import { AppEvent } from '@utils/interfaces';

import * as fromRoot from '@state/state.module';

export const eventsFeatureKey = 'myEvents';

interface MyEventsState {
  events: AppEvent[];
  isLoading: boolean;
}

export interface State extends fromRoot.State {
  myEvents: MyEventsState;
}

export const initialState: MyEventsState = {
  events: [],
  isLoading: false,
};

export function reducer(state = initialState, action: EventsActions): MyEventsState {
  switch (action.type) {
    case EventsActionTypes.LoadEvents:
      return { ...state, isLoading: true };

    case EventsActionTypes.LoadEventsSuccess:
      return { ...state, events: action.payload.events, isLoading: false };

    case EventsActionTypes.LoadEventsFailure:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
