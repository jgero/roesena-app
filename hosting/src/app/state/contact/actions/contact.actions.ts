import { Action } from '@ngrx/store';
import { ContactMailData } from '@utils/interfaces/contact-mail-data';

export enum ContactActionTypes {
  SendContactMail = '[Contact] Send Mail',
  SendContactMailSuccess = '[Contact] Mail sent',
  SendContactMailFailure = '[Contact] Sending Mail failed',
}

export class SendContactMail implements Action {
  readonly type = ContactActionTypes.SendContactMail;
  constructor(public payload: ContactMailData) {}
}

export class SendContactMailSuccess implements Action {
  readonly type = ContactActionTypes.SendContactMailSuccess;
}

export class SendContactMailFailure implements Action {
  readonly type = ContactActionTypes.SendContactMailFailure;
  constructor(public payload: { error: any }) {}
}

export type ContactActions = SendContactMail | SendContactMailFailure | SendContactMailSuccess;
