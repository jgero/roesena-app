import { createReducer, on, Action } from '@ngrx/store';

import * as searchActions from '../actions/search.actions';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

export interface State {
  searchStrings: string[];
}

const initialState: State = {
  searchStrings: [],
};

const searchReducer = createReducer(
  initialState,
  on(searchActions.addString, (state, { searchString }) => {
    let value = searchString.trim();
    const searchStrings = [...state.searchStrings];
    // add if searchString matches regex and it's not already in the array
    if (new RegExp('^[0-9a-zA-ZäöüÄÖÜß -]+$').test(value) && !searchStrings.includes(value)) {
      searchStrings.push(value);
    }
    return { ...state, searchStrings };
  }),
  on(searchActions.removeString, (state, { searchString }) => {
    const searchStrings = [...state.searchStrings];
    searchStrings.splice(
      searchStrings.findIndex((el) => el === searchString.trim()),
      1
    );
    return { ...state, searchStrings };
  }),
  on({ type: ROUTER_NAVIGATION } as any, (state, action) => {
    // split the params into the separate strings
    let searchStrings: string[] = [];
    if (action.payload.routerState.params.searchString) {
      searchStrings = action.payload.routerState.params.searchString.split(',');
    }
    return { ...state, searchStrings };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return searchReducer(state, action);
}
