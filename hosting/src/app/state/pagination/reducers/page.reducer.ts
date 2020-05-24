import { PageActions, PageActionTypes } from '../actions/page.actions';

export const pageFeatureKey = 'page';

export interface State {}

export const initialState: State = {};

export function reducer(state = initialState, action: PageActions): State {
  switch (action.type) {
    default:
      return state;
  }
}
