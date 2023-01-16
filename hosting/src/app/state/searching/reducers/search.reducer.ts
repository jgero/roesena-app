import { SearchActions, SearchActionTypes } from '../actions/search.actions';
import { AppArticle, AppImage, AppEvent } from '@utils/interfaces';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';

export const maxResultsPerPage = 30;

export const searchFeatureKey = 'search';

export interface State {
  searchStrings: string[];
  dataTypes: string[];
  events: AppEvent[];
  articles: AppArticle[];
  images: AppImage[];
  pageIndex: number;
  searchLength: number;
}

export const initialState: State = {
  searchStrings: [],
  dataTypes: [],
  events: [],
  articles: [],
  images: [],
  pageIndex: 0,
  searchLength: 0,
};

export function reducer(state = initialState, action: SearchActions | PageActions): State {
  switch (action.type) {
    case SearchActionTypes.CleanSearch:
      return { ...state, searchStrings: [] };
    case SearchActionTypes.InitSearch:
      // always start pagination on page 0
      return { ...state, searchStrings: action.payload.tags, dataTypes: action.payload.types, pageIndex: 0 };

    case SearchActionTypes.AddSearchString: {
      const value = action.payload.searchString.trim();
      const searchStrings = [...state.searchStrings];

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
      return { ...state, dataTypes: action.payload.dataTypes, pageIndex: 0, searchLength: 0 };

    case SearchActionTypes.SearchContentLoaded:
      const { articles, images, events } = action.payload;
      return { ...state, articles, images, events };

    case SearchActionTypes.SearchContentLoadFailed:
      return { ...state, articles: [], images: [], events: [] };

    case PageActionTypes.PageForward:
      return { ...state, pageIndex: state.pageIndex + 1 };
    case PageActionTypes.PageBackwards:
      return { ...state, pageIndex: state.pageIndex - 1 };
    case SearchActionTypes.SearchLengthLoaded:
      return { ...state, searchLength: action.payload.amount };

    default:
      return state;
  }
}
