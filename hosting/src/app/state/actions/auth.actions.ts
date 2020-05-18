import { createAction, props } from '@ngrx/store';

export const login = createAction('[login component] login', props<{ email: string; password: string }>());
export const register = createAction('[register component] register', props<{ email: string; name: string; password: string }>());
export const changeName = createAction('[profile component] change name', props<{ newName: string }>());
export const logout = createAction('[profile component] logout');
export const deleteUser = createAction('[profile component] delete user');
