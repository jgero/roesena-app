import { createReducer, on, Action } from '@ngrx/store';
import { AppArticle } from '../utils/interfaces';

import * as articleOverviewActions from '../actions/article-overview.actions';
import * as articleDalActions from '../actions/article-endpoint.actions';

export interface State {
  articlePageNumber: number;
  searchStrings: string[];
  articles: AppArticle[];
}

const initialState: State = {
  articlePageNumber: 0,
  searchStrings: [],
  articles: [],
};

const articleReducer = createReducer(
  initialState,
  on(articleOverviewActions.pageForward, (state) => ({ ...state, articlePageNumber: state.articlePageNumber + 1 })),
  on(articleOverviewActions.pageBackwards, (state) => ({
    ...state,
    articlePageNumber: state.articlePageNumber === 0 ? 0 : state.articlePageNumber - 1,
  })),
  on(articleOverviewActions.updateSearchStrings, (state, { searchStrings }) => ({ ...state, searchStrings })),
  on(articleDalActions.articlesLoaded, (state, { articles }) => ({ ...state, articles }))
);

export function reducer(state: State | undefined, action: Action) {
  return articleReducer(state, action);
}
