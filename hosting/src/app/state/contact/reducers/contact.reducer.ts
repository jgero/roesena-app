import { ContactActions, ContactActionTypes } from '../actions/contact.actions';
import * as fromRoot from '@state/state.module';

export const contactFeatureKey = 'contact';

export interface ContactState {
  isLoading: boolean;
}

export interface State extends fromRoot.State {
  contact: ContactState;
}

export const initialState: ContactState = {
  isLoading: false,
};

export function reducer(state = initialState, action: ContactActions): ContactState {
  switch (action.type) {
    case ContactActionTypes.SendContactMail:
      return { isLoading: true };

    case ContactActionTypes.SendContactMailSuccess:
    case ContactActionTypes.SendContactMailFailure:
      return { isLoading: false };

    default:
      return state;
  }
}
