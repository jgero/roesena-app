import { EventActions, EventActionTypes } from '../actions/event.actions';
import { AppEvent } from '@utils/interfaces';

export const eventFeatureKey = 'events';

export interface State {
  upcomingEvents: AppEvent[];
  activeEvent: AppEvent;
  activeMonth: AppEvent[][];
  isLoading: boolean;
  respondableEvents: AppEvent[];
}

export const initialState: State = {
  upcomingEvents: [],
  activeEvent: null,
  activeMonth: [],
  isLoading: false,
  respondableEvents: [],
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
    // upcoming events
    case EventActionTypes.LoadUpcomingEvents:
      return { ...state, isLoading: true };
    case EventActionTypes.LoadUpcomingEventsSuccess:
      return { ...state, isLoading: false, upcomingEvents: action.payload.events };
    case EventActionTypes.LoadSingleEventFailure:
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
    case EventActionTypes.UpdateRespondableEventAmount:
      return { ...state, respondableEvents: action.payload.respondableEvents };
    // calendar
    case EventActionTypes.LoadEventsForMonth:
      return { ...state, isLoading: true };
    case EventActionTypes.LoadEventsForMonthSuccess:
      return { ...state, activeMonth: action.payload.days, isLoading: false };
    case EventActionTypes.LoadEventsForMonthSuccess:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
