import { createReducer, on, Action } from '@ngrx/store';
import { AppArticle } from '../utils/interfaces';
import { ROUTER_NAVIGATED, ROUTER_NAVIGATION } from '@ngrx/router-store';

import * as articleOverviewActions from '../actions/article-overview.actions';
import * as articleEndpointActions from '../actions/article-endpoint.actions';

export interface State {
  articlePageNumber: number;
  searchStrings: string[];
  articles: AppArticle[];
  isLoading: boolean;
}

const initialState: State = {
  articlePageNumber: 1,
  searchStrings: [],
  articles: [],
  isLoading: false,
};

const articleReducer = createReducer(
  initialState,
  on(articleOverviewActions.pageForward, (state) => ({ ...state, articlePageNumber: state.articlePageNumber + 1 })),
  on(articleOverviewActions.pageBackwards, (state) => ({
    ...state,
    articlePageNumber: state.articlePageNumber === 0 ? 0 : state.articlePageNumber - 1,
  })),
  on(articleOverviewActions.updateSearchStrings, (state, { searchStrings }) => ({ ...state, searchStrings })),
  on(articleOverviewActions.addSearchString, (state, { searchString }) => ({
    ...state,
    searchStrings: [...state.searchStrings, searchString],
  })),
  on(articleOverviewActions.search, (state) => ({ ...state, isLoading: true })),
  on(articleEndpointActions.articlesLoaded, (state, { articles }) => ({ ...state, articles, isLoading: false })),
  on(articleEndpointActions.articlesLoadingError, (state) => ({ ...state, isLoading: false })),
  on({ type: ROUTER_NAVIGATED } as any, (state, action) => {
    // if navigation was not to article overview do nothing
    if (!(action.payload.routerState.url as string).includes('/articles/overview')) {
      return state;
    }
    // split the params into the separate strings
    let searchStrings = [];
    if (action.payload.routerState.params.searchString) {
      searchStrings = action.payload.routerState.params.searchString.split(',');
    }
    return { ...state, searchStrings };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return articleReducer(state, action);
}
