import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  LoadAuths = '[Auth] Load Auths',
}

export class LoadAuths implements Action {
  readonly type = AuthActionTypes.LoadAuths;
}

export type AuthActions = LoadAuths;

// export const login = createAction('[login component] login', props<{ email: string; password: string }>());
// export const register = createAction('[register component] register', props<{ email: string; name: string; password: string }>());
// export const changeName = createAction('[profile component] change name', props<{ newName: string }>());
// export const logout = createAction('[profile component] logout');
// export const deleteUser = createAction('[profile component] delete user');

// export const loginLoaded = createAction('[Auth Endpoint] person login successful', props<{ person: AppPerson }>());
// export const loginFailed = createAction('[Auth Endpoint] login failed', props<{ error: Error }>());
// export const registerLoaded = createAction('[Auth Endpoint] person register successful');
// export const registerFailed = createAction('[Auth Endpoint] person register failed', props<{ error: Error }>());
// export const logoutLoaded = createAction('[Auth Endpoint] person logout successful');
// export const logoutFailed = createAction('[Auth Endpoint] person logout failed', props<{ error: Error }>());
// export const deleteLoaded = createAction('[Auth Endpoint] person delete successful');
// export const deleteFailed = createAction('[Auth Endpoint] person delete failed', props<{ error: Error }>());
// export const nameChangeLoaded = createAction('[Auth Endpoint] name change successful');
// export const nameChangeFailed = createAction('[Auth Endpoint] name change failed', props<{ error: Error }>());
