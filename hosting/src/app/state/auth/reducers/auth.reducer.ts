import { AuthActions, AuthActionTypes } from '../actions/auth.actions';

import * as fromRoot from '@state/state.module';

export const authFeatureKey = 'auth';

interface AuthState {
  isLoading: boolean;
}

export interface State extends fromRoot.State {
  auth: AuthState;
}

export const initialState: AuthState = {
  isLoading: false,
};

export function reducer(state = initialState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.DoLogin:
    case AuthActionTypes.DoLogout:
    case AuthActionTypes.DoRegister:
    case AuthActionTypes.DoChangeName:
    case AuthActionTypes.DoChangePasswordWithCode:
    case AuthActionTypes.DoDeleteUser:
    case AuthActionTypes.DoReset:
      return { ...state, isLoading: true };

    case AuthActionTypes.LoginLoaded:
    case AuthActionTypes.LoginFailed:
    case AuthActionTypes.LogoutLoaded:
    case AuthActionTypes.LogoutFailed:
    case AuthActionTypes.RegisterLoaded:
    case AuthActionTypes.RegisterFailed:
    case AuthActionTypes.ChangeNameLoaded:
    case AuthActionTypes.ChangeNameFailed:
    case AuthActionTypes.ChangePasswordWithCodeLoaded:
    case AuthActionTypes.ChangePasswordWithCodeFailed:
    case AuthActionTypes.DeleteUserLoaded:
    case AuthActionTypes.DeleteUserFailed:
    case AuthActionTypes.ResetLoaded:
    case AuthActionTypes.ResetFailed:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
