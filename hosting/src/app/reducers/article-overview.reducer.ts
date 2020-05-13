import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createReducer,
  on,
  Action,
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { AppArticle } from '../utils/interfaces';

import * as articleActions from '../actions/article-overview.actions';

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
  on(articleActions.pageForward, (state) => ({ ...state, articlePageNumber: state.articlePageNumber + 1 })),
  on(articleActions.pageBackwards, (state) => ({
    ...state,
    articlePageNumber: state.articlePageNumber === 0 ? 0 : state.articlePageNumber - 1,
  })),
  on(articleActions.updateSearchStrings, (state, { searchStrings }) => ({ ...state, searchStrings })),
  on(articleActions.articlesLoaded, (state, { articles }) => ({ ...state, articles }))
);

export function reducer(state: State | undefined, action: Action) {
  return articleReducer(state, action);
}
