import { PageActions, PageActionTypes } from '../actions/page.actions';

export const pageFeatureKey = 'page';

export const initialState = {};

export function reducer(state = initialState, action: PageActions) {
  switch (action.type) {
    default:
      return state;
  }
}
