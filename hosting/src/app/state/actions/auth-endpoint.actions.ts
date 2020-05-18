import { createAction, props } from '@ngrx/store';
import { AppPerson } from '@utils/interfaces';

export const loginLoaded = createAction('[Auth Endpoint] person login successful', props<{ person: AppPerson }>());
export const loginFailed = createAction('[Auth Endpoint] login failed', props<{ error: Error }>());
export const registerLoaded = createAction('[Auth Endpoint] person register successful');
export const registerFailed = createAction('[Auth Endpoint] person register failed', props<{ error: Error }>());
export const logoutLoaded = createAction('[Auth Endpoint] person logout successful');
export const logoutFailed = createAction('[Auth Endpoint] person logout failed', props<{ error: Error }>());
export const deleteLoaded = createAction('[Auth Endpoint] person delete successful');
export const deleteFailed = createAction('[Auth Endpoint] person delete failed', props<{ error: Error }>());
export const nameChangeLoaded = createAction('[Auth Endpoint] name change successful');
export const nameChangeFailed = createAction('[Auth Endpoint] name change failed', props<{ error: Error }>());
