import { PersonActions, PersonActionTypes } from '../actions/person.actions';
import { AppPerson } from '@utils/interfaces';
import * as fromRoot from '@state/state.module';

export const personFeatureKey = 'person';

interface PerosonState {
  length: number;
  persons: AppPerson[];
  limit: number;
  pageFirst: AppPerson;
  pageLast: AppPerson;
  loadingAction: boolean;
}

export interface State extends fromRoot.State {
  person: PerosonState;
}

export const initialState: PerosonState = {
  length: 0,
  persons: [],
  limit: 3,
  pageFirst: null,
  pageLast: null,
  loadingAction: false,
};

export function reducer(state = initialState, action: PersonActions): PerosonState {
  switch (action.type) {
    case PersonActionTypes.LoadPersons:
      return { ...state, limit: action.payload.limit };

    case PersonActionTypes.LoadPersonsSuccess:
      return {
        ...state,
        persons: action.payload.persons,
        pageFirst: action.payload.persons[0] || null,
        pageLast: action.payload.persons[action.payload.persons.length - 1] || null,
      };

    case PersonActionTypes.LoadPersonLengthSuccess:
      return { ...state, length: action.payload.length };

    case PersonActionTypes.ConfirmPerson:
    case PersonActionTypes.DeletePerson:
    case PersonActionTypes.AddGroup:
    case PersonActionTypes.RemoveGroup:
      return { ...state, loadingAction: true };

    case PersonActionTypes.ConfirmPersonSuccess:
    case PersonActionTypes.DeletePersonSuccess:
    case PersonActionTypes.AddGroupSuccess:
    case PersonActionTypes.RemoveGroupSuccess:
    case PersonActionTypes.ConfirmPersonFailure:
    case PersonActionTypes.DeletePersonFailure:
    case PersonActionTypes.AddGroupFailure:
    case PersonActionTypes.RemoveGroupFailure:
      return { ...state, loadingAction: false };

    default:
      return state;
  }
}
