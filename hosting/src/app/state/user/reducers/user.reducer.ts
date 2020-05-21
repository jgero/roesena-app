import { UserActions, UserActionTypes } from '../actions/user.actions';
import { AppPerson } from '@utils/interfaces';

export const userFeatureKey = 'user';

export interface State {
  user: AppPerson | null;
  isInitialized: boolean;
  isAuthor: boolean;
  isAdmin: boolean;
}

export const initialState: State = {
  user: null,
  isInitialized: false,
  isAuthor: false,
  isAdmin: false,
};

export function reducer(state = initialState, action: UserActions): State {
  switch (action.type) {
    case UserActionTypes.LoadUserSuccess:
      return {
        ...state,
        user: action.payload.user,
        isInitialized: true,
        isAuthor: action.payload.user ? action.payload.user.groups.includes('Autor') : false,
        isAdmin: action.payload.user ? action.payload.user.groups.includes('admin') : false,
      };

    case UserActionTypes.LoadUserFailure:
      return { ...state, user: null };

    default:
      return state;
  }
}
