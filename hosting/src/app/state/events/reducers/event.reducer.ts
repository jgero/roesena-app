import { EventActions, EventActionTypes } from '../actions/event.actions';
import { AppEvent } from '@utils/interfaces';

export const eventFeatureKey = 'events';

export interface State {
  activeEvent: AppEvent;
  activePageEvents: AppEvent[];
  isLoading: boolean;
  unrespondedEvents: AppEvent[];
}

export const initialState: State = {
  activeEvent: null,
  activePageEvents: [],
  isLoading: false,
  unrespondedEvents: [],
};

export function reducer(state = initialState, action: EventActions): State {
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
    // responding
    case EventActionTypes.RespondToEvent:
      return { ...state, isLoading: true };
    case EventActionTypes.RespondToEventSuccess:
      return { ...state, isLoading: false };
    case EventActionTypes.RespondToEventFailure:
      return { ...state, isLoading: false };
    case EventActionTypes.UpdateUnrespondedEventAmount:
      return { ...state, unrespondedEvents: action.payload.unrespondedEvents };

    default:
      return state;
  }
}
