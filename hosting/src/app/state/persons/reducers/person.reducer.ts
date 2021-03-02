import { PersonActions, PersonActionTypes } from '../actions/person.actions';
import { AppPerson } from '@utils/interfaces';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';

export const personFeatureKey = 'persons';

export interface State {
  isLoading: boolean;
  amount: number;
  persons: AppPerson[];
  user: AppPerson;
  limit: number;
  pageIndex: number;
  pageFirst: AppPerson;
  pageLast: AppPerson;
}

export const initialState: State = {
  isLoading: false,
  amount: 0,
  persons: [],
  user: null,
  limit: 3,
  pageIndex: 1,
  pageFirst: null,
  pageLast: null,
};

export function reducer(state = initialState, action: PersonActions | PageActions): State {
  switch (action.type) {
    case PersonActionTypes.Login:
    case PersonActionTypes.Logout:
    case PersonActionTypes.Register:
    case PersonActionTypes.ChangeName:
    case PersonActionTypes.ChangePasswordWithCode:
    case PersonActionTypes.DeletePerson:
    case PersonActionTypes.Reset:
      return { ...state, isLoading: true };

    case PersonActionTypes.LoginSuccess:
    case PersonActionTypes.LoginFailure:
    case PersonActionTypes.LogoutFailure:
    case PersonActionTypes.RegisterSuccess:
    case PersonActionTypes.RegisterFailure:
    case PersonActionTypes.ChangeNameSuccess:
    case PersonActionTypes.ChangeNameFailure:
    case PersonActionTypes.ChangePasswordWithCodeSuccess:
    case PersonActionTypes.ChangePasswordWithCodeFailure:
    case PersonActionTypes.DeletePersonSuccess:
    case PersonActionTypes.DeletePersonFailure:
    case PersonActionTypes.ResetSuccess:
    case PersonActionTypes.ResetFailure:
      return { ...state, isLoading: false };

    case PersonActionTypes.LoadPersons:
      return { ...state, limit: action.payload.limit, isLoading: true };
    case PersonActionTypes.LoadPersonsSuccess:
      return { ...state, isLoading: false, persons: action.payload.persons };
    case PersonActionTypes.LoadPersonsFailure:
      return { ...state, isLoading: false, persons: [] };

    case PersonActionTypes.LoadUser:
      return state;
    case PersonActionTypes.LoadUserSuccess:
      return { ...state, user: action.payload.user };
    case PersonActionTypes.LoadUserFailure:
      return { ...state, user: null };
    // user is reset when logged out
    case PersonActionTypes.LogoutSuccess:
      return { ...state, user: null, isLoading: null };

    case PersonActionTypes.LoadPersonsSuccess:
      return {
        ...state,
        persons: action.payload.persons,
        pageFirst: action.payload.persons[0] || null,
        pageLast: action.payload.persons[action.payload.persons.length - 1] || null,
      };

    case PersonActionTypes.LoadPersonAmountSuccess:
      return { ...state, amount: action.payload.amount };

    case PageActionTypes.PageForward:
      return { ...state, pageIndex: state.pageIndex + 1 };
    case PageActionTypes.PageBackwards:
      return { ...state, pageIndex: state.pageIndex - 1 };

    default:
      return state;
  }
}