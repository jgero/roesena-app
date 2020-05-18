import { SearchActions, SearchActionTypes } from '../actions/search.actions';

export const searchFeatureKey = 'search';

export interface State {
  searchStrings: string[];
}

export const initialState: State = {
  searchStrings: [],
};

export function reducer(state = initialState, action: SearchActions): State {
  switch (action.type) {
    case SearchActionTypes.AddSearchString: {
      let value = action.payload.searchString.trim();
      const searchStrings = [...state.searchStrings];
      // add if searchString matches regex and it's not already in the array
      if (new RegExp('^[0-9a-zA-ZäöüÄÖÜß -]+$').test(value) && !searchStrings.includes(value)) {
        searchStrings.push(value);
      }
      return { ...state, searchStrings };
    }

    case SearchActionTypes.RemoveSearchString: {
      const searchStrings = [...state.searchStrings];
      searchStrings.splice(
        searchStrings.findIndex((el) => el === action.payload.searchString.trim()),
        1
      );
      return { ...state, searchStrings };
    }

    case SearchActionTypes.InitSearch: {
      return { ...state, searchStrings: action.payload.searchStrings };
    }

    default:
      return state;
  }
}
