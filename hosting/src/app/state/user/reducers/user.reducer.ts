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
        isAuthor: action.payload.user.groups.includes('Autor'),
        isAdmin: action.payload.user.groups.includes('admin'),
      };

    case UserActionTypes.LoadUserFailure:
      return { ...state, user: null };

    default:
      return state;
  }
}
