import { SearchActions, SearchActionTypes } from '../actions/search.actions';
import { AppArticle, AppImage, AppEvent } from '@utils/interfaces';
import { Store } from '@ngrx/store';

export const searchFeatureKey = 'search';

export interface State {
  searchStrings: string[];
  dataTypes: string[];
  events: AppEvent[];
  articles: AppArticle[];
  images: AppImage[];
  limit: number;
}

export const initialState: State = {
  searchStrings: [],
  dataTypes: ['articles', 'events', 'images'],
  events: [],
  articles: [],
  images: [],
  limit: 3,
};

export function reducer(state = initialState, action: SearchActions): State {
  switch (action.type) {
    case SearchActionTypes.CleanSearch:
      return { ...state, searchStrings: [] };
    case SearchActionTypes.InitSearch:
      return { ...state, limit: action.payload.limit };

    case SearchActionTypes.AddSearchString: {
      const value = action.payload.searchString.trim();
      let searchStrings = [...state.searchStrings];

      const numberRegex = new RegExp('^[0-9]{4}$');
      // if the new search string is a number and the selection already has a number tag
      if (numberRegex.test(value) && searchStrings.some((el) => numberRegex.test(el))) {
        const yearTagIndex = searchStrings.findIndex((el) => numberRegex.test(el));
        searchStrings.splice(yearTagIndex, 1);
        searchStrings.push(value);
      } else if (new RegExp('^[0-9a-zA-ZäöüÄÖÜß -]+$').test(value) && !searchStrings.includes(value)) {
        // add if searchString matches regex and it's not already in the array
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

    case SearchActionTypes.ChangeDataType:
      return { ...state, dataTypes: action.payload.dataTypes };

    case SearchActionTypes.SearchContentLoaded:
      const { articles, images, events } = action.payload;
      return { ...state, articles, images, events };

    case SearchActionTypes.SearchContentLoadFailed:
      return { ...state, articles: [], images: [], events: [] };

    default:
      return state;
  }
}
