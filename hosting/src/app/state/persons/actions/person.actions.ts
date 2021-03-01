import { Action } from '@ngrx/store';
import { AppPerson } from '@utils/interfaces';

export enum PersonActionTypes {
  // load persons
  LoadPersons = '[person] load all persons',
  LoadPersonsSuccess = '[person] load all persons success',
  LoadPersonsFailure = '[person] load all persons failure',
  LoadPersonAmount = '[person] Load person length',
  LoadPersonAmountSuccess = '[person] Load person length success',
  LoadPersonAmountFailure = '[person] Load person length failure',
  LoadUser = '[person] load current user',
  LoadUserSuccess = '[person] load current user success',
  LoadUserFailure = '[person] load current user failure',
  // auth actions
  Login = '[person] log in with credentials',
  LoginSuccess = '[person] login success',
  LoginFailure = '[person] login failure',
  Register = '[person] register with given name and credentials',
  RegisterSuccess = '[person] new user was registered success',
  RegisterFailure = '[person] user registering failure',
  Logout = '[person] logout current user',
  LogoutSuccess = '[person] user logout success',
  LogoutFailure = '[person] user logout failure',
  Reset = '[person] reset password',
  ResetSuccess = '[person] reset success',
  ResetFailure = '[person] reset failure',
  ChangePasswordWithCode = '[person] change the password with reset code',
  ChangePasswordWithCodeSuccess = '[person] password change success',
  ChangePasswordWithCodeFailure = '[person] password change failure',
  // person mutations
  ChangeName = '[person] change name of current user',
  ChangeNameSuccess = '[person] name change success',
  ChangeNameFailure = '[person] name change failure',
  ConfirmPerson = '[person] confirm person',
  ConfirmPersonSuccess = '[person] confirm person success',
  ConfirmPersonFailure = '[person] confirm person failure',
  DeletePerson = '[person] delete person',
  DeletePersonSuccess = '[person] delete person success',
  DeletePersonFailure = '[person] delete person failure',
  AddGroup = '[person] add group to person',
  AddGroupSuccess = '[person] add group to person success',
  AddGroupFailure = '[person] add group to person failure',
  RemoveGroup = '[person] remove group from person',
  RemoveGroupSuccess = '[person] remove group from person success',
  RemoveGroupFailure = '[person] remove group from person failure',
}

// request persons
export class LoadPersons implements Action {
  readonly type = PersonActionTypes.LoadPersons;
  constructor(public payload: { limit: number; onlyUnconfirmed?: boolean }) {}
}
export class LoadPersonsSuccess implements Action {
  readonly type = PersonActionTypes.LoadPersonsSuccess;
  constructor(public payload: { persons: AppPerson[] }) {}
}
export class LoadPersonsFailure implements Action {
  readonly type = PersonActionTypes.LoadPersonsFailure;
  constructor(public payload: { error: any }) {}
}
export class LoadPersonAmount implements Action {
  readonly type = PersonActionTypes.LoadPersonAmount;
}
export class LoadPersonAmountSuccess implements Action {
  readonly type = PersonActionTypes.LoadPersonAmountSuccess;
  constructor(public payload: { amount: number }) {}
}
export class LoadPersonAmountFailure implements Action {
  readonly type = PersonActionTypes.LoadPersonAmountFailure;
  constructor(public payload: { error: any }) {}
}
export class LoadUser implements Action {
  readonly type = PersonActionTypes.LoadUser;
  constructor(public payload: { id: string }) {}
}
export class LoadUserSuccess implements Action {
  readonly type = PersonActionTypes.LoadUserSuccess;
  constructor(public payload: { user: AppPerson }) {}
}
export class LoadUserFailure implements Action {
  readonly type = PersonActionTypes.LoadUserFailure;
  constructor(public payload: { error: any }) {}
}

// auth actions
export class Login implements Action {
  readonly type = PersonActionTypes.Login;
  constructor(public payload: { email: string; password: string }) {}
}
export class LoginSuccess implements Action {
  readonly type = PersonActionTypes.LoginSuccess;
}
export class LoginFailure implements Action {
  readonly type = PersonActionTypes.LoginFailure;
  constructor(public payload: { error: any }) {}
}
export class Register implements Action {
  readonly type = PersonActionTypes.Register;
  constructor(public payload: { email: string; password: string }) {}
}
export class RegisterSuccess implements Action {
  readonly type = PersonActionTypes.RegisterSuccess;
}
export class RegisterFailure implements Action {
  readonly type = PersonActionTypes.RegisterFailure;
  constructor(public payload: { error: any }) {}
}
export class Logout implements Action {
  readonly type = PersonActionTypes.Logout;
}
export class LogoutSuccess implements Action {
  readonly type = PersonActionTypes.LogoutSuccess;
}
export class LogoutFailure implements Action {
  readonly type = PersonActionTypes.LogoutFailure;
  constructor(public payload: { error: any }) {}
}
export class Reset implements Action {
  readonly type = PersonActionTypes.Reset;
  constructor(public payload: { email: string }) {}
}
export class ResetSuccess implements Action {
  readonly type = PersonActionTypes.ResetSuccess;
}
export class ResetFailure implements Action {
  readonly type = PersonActionTypes.ResetFailure;
  constructor(public payload: { error: any }) {}
}
export class ChangePasswordWithCode implements Action {
  readonly type = PersonActionTypes.ChangePasswordWithCode;
  constructor(public payload: { password: string }) {}
}
export class ChangePasswordWithCodeSuccess implements Action {
  readonly type = PersonActionTypes.ChangePasswordWithCodeSuccess;
}
export class ChangePasswordWithCodeFailure implements Action {
  readonly type = PersonActionTypes.ChangePasswordWithCodeFailure;
  constructor(public payload: { error: any }) {}
}

// person mutations
export class ChangeName implements Action {
  readonly type = PersonActionTypes.ChangeName;
  constructor(public payload: { newName: string; id: string }) {}
}
export class ChangeNameSuccess implements Action {
  readonly type = PersonActionTypes.ChangeNameSuccess;
}
export class ChangeNameFailure implements Action {
  readonly type = PersonActionTypes.ChangeNameFailure;
  constructor(public payload: { error: any }) {}
}
export class AddGroup implements Action {
  readonly type = PersonActionTypes.AddGroup;
  constructor(public payload: { id: string; group: string }) {}
}
export class AddGroupSuccess implements Action {
  readonly type = PersonActionTypes.AddGroupSuccess;
}
export class AddGroupFailure implements Action {
  readonly type = PersonActionTypes.AddGroupFailure;
  constructor(public payload: { error: any }) {}
}
export class RemoveGroup implements Action {
  readonly type = PersonActionTypes.RemoveGroup;
  constructor(public payload: { id: string; group: string }) {}
}
export class RemoveGroupSuccess implements Action {
  readonly type = PersonActionTypes.RemoveGroupSuccess;
}
export class RemoveGroupFailure implements Action {
  readonly type = PersonActionTypes.RemoveGroupFailure;
  constructor(public payload: { error: any }) {}
}
export class DeletePerson implements Action {
  readonly type = PersonActionTypes.DeletePerson;
  constructor(public payload: { id: string }) {}
}
export class DeletePersonSuccess implements Action {
  readonly type = PersonActionTypes.DeletePersonSuccess;
}
export class DeletePersonFailure implements Action {
  readonly type = PersonActionTypes.DeletePersonFailure;
  constructor(public payload: { error: any }) {}
}
export class ConfirmPerson implements Action {
  readonly type = PersonActionTypes.ConfirmPerson;
  constructor(public payload: { id: string }) {}
}
export class ConfirmPersonSuccess implements Action {
  readonly type = PersonActionTypes.ConfirmPersonSuccess;
}
export class ConfirmPersonFailure implements Action {
  readonly type = PersonActionTypes.ConfirmPersonFailure;
  constructor(public payload: { error: any }) {}
}

export type PersonActions =
  | LoadPersons
  | LoadPersonsSuccess
  | LoadPersonsFailure
  | LoadPersonAmount
  | LoadPersonAmountSuccess
  | LoadPersonAmountFailure
  | LoadUser
  | LoadUserSuccess
  | LoadUserFailure
  | Login
  | LoginSuccess
  | LoginFailure
  | Register
  | RegisterSuccess
  | RegisterFailure
  | Logout
  | LogoutSuccess
  | LogoutFailure
  | Reset
  | ResetSuccess
  | ResetFailure
  | ChangePasswordWithCode
  | ChangePasswordWithCodeSuccess
  | ChangePasswordWithCodeFailure
  | ChangeName
  | ChangeNameSuccess
  | ChangeNameFailure
  | ConfirmPerson
  | ConfirmPersonSuccess
  | ConfirmPersonFailure
  | DeletePerson
  | DeletePersonSuccess
  | DeletePersonFailure
  | AddGroup
  | AddGroupSuccess
  | AddGroupFailure
  | RemoveGroup
  | RemoveGroupSuccess
  | RemoveGroupFailure;
