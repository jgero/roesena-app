
import { AuthActions, AuthActionTypes } from '../actions/auth.actions';

export const authFeatureKey = 'auth';

export interface State {

}

export const initialState: State = {

};

export function reducer(state = initialState, action: AuthActions): State {
  switch (action.type) {

    case AuthActionTypes.LoadAuths:
      return state;

    default:
      return state;
  }
}
