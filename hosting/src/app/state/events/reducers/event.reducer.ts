import { EventActions, EventActionTypes } from '../actions/event.actions';
import { AppEvent } from '@utils/interfaces';
import * as fromRoot from '@state/state.module';

export const eventFeatureKey = 'events';

interface EventState {
  activeEvent: AppEvent;
  activePageEvents: AppEvent[];
  isLoading: boolean;
}

export interface State extends fromRoot.State {
  events: EventState;
}

export const initialState: EventState = {
  activeEvent: null,
  activePageEvents: [],
  isLoading: false,
};

export function reducer(state = initialState, action: EventActions): EventState {
  switch (action.type) {
    // single event
    case EventActionTypes.LoadSingleEvent:
      return { ...state, isLoading: true };
    case EventActionTypes.LoadSingleEventSuccess:
      return { ...state, isLoading: false, activeEvent: action.payload.event };
    case EventActionTypes.LoadSingleEventFailure:
      return { ...state, isLoading: false };
    // multiple events
    case EventActionTypes.LoadAllEvents:
      return { ...state, isLoading: true };
    case EventActionTypes.LoadAllEventsSuccess:
      return {
        ...state,
        isLoading: false,
        activePageEvents: action.payload.events || null,
      };
    case EventActionTypes.LoadAllEventsFailure:
      return { ...state, isLoading: false };
    // editor
    case EventActionTypes.CreateEvent:
    case EventActionTypes.UpdateEvent:
    case EventActionTypes.DeleteEvent:
      return { ...state, isLoading: true };
    case EventActionTypes.CreateEventSuccess:
    case EventActionTypes.CreateEventFailure:
    case EventActionTypes.UpdateEventSuccess:
    case EventActionTypes.UpdateEventFailure:
    case EventActionTypes.DeleteEventSuccess:
    case EventActionTypes.DeleteEventFailure:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
