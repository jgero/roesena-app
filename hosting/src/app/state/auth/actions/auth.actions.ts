import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  DoLogin = '[Auth] log in with credentials',
  DoRegister = '[Auth] register with given name and credentials',
  DoLogout = '[Auth] logout current user',
  DoReset = '[Auth] reset password',
  DoChangePasswordWithCode = '[Auth] change the password with reset code',
  DoChangeName = '[Auth] change name of current user',
  DoDeleteUser = '[Auth] delete current user',
  LoginLoaded = '[Auth] login loaded',
  LoginFailed = '[Auth] login failed',
  RegisterLoaded = '[Auth] new user was registered',
  RegisterFailed = '[Auth] user registering failed',
  LogoutLoaded = '[Auth] user logout loaded',
  LogoutFailed = '[Auth] user logout failed',
  ResetLoaded = '[Auth] reset loaded',
  ResetFailed = '[Auth] reset failed',
  ChangePasswordWithCodeLoaded = '[Auth] password change loaded',
  ChangePasswordWithCodeFailed = '[Auth] password change failed',
  ChangeNameLoaded = '[Auth] name change loaded',
  ChangeNameFailed = '[Auth] name change failed',
  DeleteUserLoaded = '[Auth] user deleted',
  DeleteUserFailed = '[Auth] deleting user failed',
}

export class DoLogin implements Action {
  readonly type = AuthActionTypes.DoLogin;
  constructor(public payload: { email: string; password: string }) {}
}
export class LoginLoaded implements Action {
  readonly type = AuthActionTypes.LoginLoaded;
}
export class LoginFailed implements Action {
  readonly type = AuthActionTypes.LoginFailed;
  constructor(public payload: { error: any }) {}
}
export class DoRegister implements Action {
  readonly type = AuthActionTypes.DoRegister;
  constructor(public payload: { email: string; password: string }) {}
}
export class RegisterLoaded implements Action {
  readonly type = AuthActionTypes.RegisterLoaded;
}
export class RegisterFailed implements Action {
  readonly type = AuthActionTypes.RegisterFailed;
  constructor(public payload: { error: any }) {}
}

export class DoLogout implements Action {
  readonly type = AuthActionTypes.DoLogout;
}
export class LogoutLoaded implements Action {
  readonly type = AuthActionTypes.LogoutLoaded;
}
export class LogoutFailed implements Action {
  readonly type = AuthActionTypes.LogoutFailed;
  constructor(public payload: { error: any }) {}
}
export class DoReset implements Action {
  readonly type = AuthActionTypes.DoReset;
  constructor(public payload: { email: string }) {}
}
export class ResetLoaded implements Action {
  readonly type = AuthActionTypes.ResetLoaded;
}
export class ResetFailed implements Action {
  readonly type = AuthActionTypes.ResetFailed;
  constructor(public payload: { error: any }) {}
}
export class DoChangePasswordWithCode implements Action {
  readonly type = AuthActionTypes.DoChangePasswordWithCode;
  constructor(public payload: { password: string }) {}
}
export class ChangePasswordWithCodeLoaded implements Action {
  readonly type = AuthActionTypes.ChangePasswordWithCodeLoaded;
}
export class ChangePasswordWithCodeFailed implements Action {
  readonly type = AuthActionTypes.ChangePasswordWithCodeFailed;
  constructor(public payload: { error: any }) {}
}
export class DoChangeName implements Action {
  readonly type = AuthActionTypes.DoChangeName;
  constructor(public payload: { newName: string; id: string }) {}
}
export class ChangeNameLoaded implements Action {
  readonly type = AuthActionTypes.ChangeNameLoaded;
}
export class ChangeNameFailed implements Action {
  readonly type = AuthActionTypes.ChangeNameFailed;
  constructor(public payload: { error: any }) {}
}
export class DoDeleteUser implements Action {
  readonly type = AuthActionTypes.DoDeleteUser;
}
export class DeleteUserLoaded implements Action {
  readonly type = AuthActionTypes.DeleteUserLoaded;
}
export class DeleteUserFailed implements Action {
  readonly type = AuthActionTypes.DeleteUserFailed;
  constructor(public payload: { error: any }) {}
}

export type AuthActions =
  | DoLogin
  | LoginLoaded
  | LoginFailed
  | DoRegister
  | RegisterLoaded
  | RegisterFailed
  | DoLogout
  | LogoutLoaded
  | LogoutFailed
  | DoReset
  | ResetLoaded
  | ResetFailed
  | DoChangePasswordWithCode
  | ChangePasswordWithCodeLoaded
  | ChangePasswordWithCodeFailed
  | DoChangeName
  | ChangeNameLoaded
  | ChangeNameFailed
  | DoDeleteUser
  | DeleteUserLoaded
  | DeleteUserFailed;
