import { EventActions, EventActionTypes } from '../actions/event.actions';
import { AppPerson } from '@utils/interfaces';
import * as fromEvent from '@state/events/reducers/event.reducer';

export const eventFeatureKey = 'eventEditor';

interface EventEditorState {
  persons: AppPerson[];
  isLoading: boolean;
}

export interface State extends fromEvent.State {
  eventEditor: EventEditorState;
}

export const initialState: EventEditorState = {
  persons: [],
  isLoading: false,
};

export function reducer(state = initialState, action: EventActions): EventEditorState {
  switch (action.type) {
    case EventActionTypes.CreateEvent:
    case EventActionTypes.DeleteEvent:
    case EventActionTypes.UpdateEvent:
      return { ...state, isLoading: true };
    case EventActionTypes.UpdateEventSuccess:
    case EventActionTypes.UpdateEventFailure:
    case EventActionTypes.CreateEventFailure:
    case EventActionTypes.CreateEventSuccess:
    case EventActionTypes.DeleteEventSuccess:
    case EventActionTypes.DeleteEventFailure:
      return { ...state, isLoading: false };

    case EventActionTypes.LoadPersonsSuccess:
      return { ...state, persons: action.payload.persons, isLoading: false };

    default:
      return state;
  }
}
