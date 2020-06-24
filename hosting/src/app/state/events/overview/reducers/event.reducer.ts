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
  events: [],
  isLoading: false,
};

export function reducer(state = initialState, action: EventActions): EventOverviewState {
  switch (action.type) {
    case EventActionTypes.LoadEvents:
      return { ...state, isLoading: true };

    case EventActionTypes.LoadEventsSuccess:
      return { ...state, events: action.payload.events, isLoading: false };

    case EventActionTypes.LoadEventsFailure:
      return { ...state, events: [], isLoading: false };

    default:
      return state;
  }
}
