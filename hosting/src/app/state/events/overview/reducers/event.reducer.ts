import { EventActions, EventActionTypes } from '../actions/event.actions';
import { AppEvent } from '@utils/interfaces';
import * as fromRoot from '@state/state.module';

export const eventFeatureKey = 'eventOverview';

interface EventOverviewState {
  events: AppEvent[];
  isLoading: boolean;
}

export interface State extends fromRoot.State {
  eventOverview: EventOverviewState;
}

export const initialState: EventOverviewState = {
  events: null,
  isLoading: false,
};

export function reducer(state = initialState, action: EventActions): EventOverviewState {
  switch (action.type) {
    case EventActionTypes.LoadEvents:
      return { ...state, isLoading: true, events: null };

    case EventActionTypes.LoadEventsSuccess:
      return { ...state, events: action.payload.events, isLoading: false };

    case EventActionTypes.LoadEventsFailure:
      return { ...state, events: null, isLoading: false };

    default:
      return state;
  }
}
