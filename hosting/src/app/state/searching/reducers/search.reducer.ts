import { SearchActions, SearchActionTypes } from '../actions/search.actions';
import { AppArticle, AppImage, AppEvent } from '@utils/interfaces';
import { Store } from '@ngrx/store';

export const searchFeatureKey = 'search';

export interface State {
  searchStrings: string[];
  dataType: string;
  events: AppEvent[];
  articles: AppArticle[];
  images: AppImage[];
  limit: number;
}

export const initialState: State = {
  searchStrings: [],
  dataType: 'events',
  events: [],
  articles: [],
  images: [],
  limit: 3,
};

export function reducer(state = initialState, action: SearchActions): State {
  switch (action.type) {
    case SearchActionTypes.InitSearch:
      return { ...state, limit: action.payload.limit };

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

    case SearchActionTypes.ChangeDataType:
      return { ...state, dataType: action.payload.dataType };

    case SearchActionTypes.SearchContentLoaded:
      const { articles, images, events } = action.payload;
      return { ...state, articles, images, events };

    case SearchActionTypes.SearchContentLoadFailed:
      return { ...state, articles: [], images: [], events: [] };

    default:
      return state;
  }
}
