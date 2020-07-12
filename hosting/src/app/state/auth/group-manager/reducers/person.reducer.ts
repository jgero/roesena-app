import { PersonActions, PersonActionTypes } from '../actions/person.actions';
import { AppPerson } from '@utils/interfaces';
import * as fromRoot from '@state/state.module';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';

export const personFeatureKey = 'person';

interface PerosonState {
  length: number;
  persons: AppPerson[];
  limit: number;
  pageFirst: AppPerson;
  pageLast: AppPerson;
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

    case PersonActionTypes.LoadPersonsFailure:
      return state;

    case PersonActionTypes.LoadPersonLengthSuccess:
      return { ...state, length: action.payload.length };

    case PersonActionTypes.LoadPersonLengthFailure:
      return state;

    default:
      return state;
  }
}
