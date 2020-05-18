import { createReducer, on, Action } from '@ngrx/store';
import { AppPerson } from '@utils/interfaces';

import * as authEndpointActions from '../actions/auth-endpoint.actions';

export interface State {
  person: AppPerson;
  isAuthor: boolean;
  isAdmin: boolean;
}

const initialState: State = {
  person: null,
  isAuthor: false,
  isAdmin: false,
};

const articleReducer = createReducer(
  initialState,
  on(authEndpointActions.loginLoaded, (state, { person }) => ({
    person,
    isAuthor: person.groups.includes('Autor'),
    isAdmin: person.groups.includes('admin'),
  })),
  on(authEndpointActions.logoutLoaded, (state) => ({ person: null, isAdmin: false, isAuthor: false }))
);

export function reducer(state: State | undefined, action: Action) {
  return articleReducer(state, action);
}
