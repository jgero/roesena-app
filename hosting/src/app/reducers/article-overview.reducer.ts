import { createReducer, on, Action } from '@ngrx/store';
import { AppArticle, StoreableArticle } from '../utils/interfaces';

import * as articleOverviewActions from '../actions/article-overview.actions';
import * as articleEndpointActions from '../actions/article-endpoint.actions';
import { QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';

export interface State {
  pageIndex: number;
  articles: AppArticle[];
  dataLength: number;
  isLoading: boolean;
  columns: number;
  limit: number;
  pageFirst: QueryDocumentSnapshot<StoreableArticle>;
  pageLast: QueryDocumentSnapshot<StoreableArticle>;
}

const initialState: State = {
  pageIndex: 0,
  articles: [],
  dataLength: 0,
  isLoading: false,
  columns: Math.ceil(window.innerWidth / 500),
  limit: Math.ceil(window.innerWidth / 500) * 5,
  pageFirst: null,
  pageLast: null,
};

const articleReducer = createReducer(
  initialState,
  on(articleOverviewActions.pageForward, (state) => ({ ...state, pageIndex: state.pageIndex + 1 })),
  on(articleOverviewActions.pageBackwards, (state) => ({
    ...state,
    articlePageNumber: state.pageIndex === 0 ? 0 : state.pageIndex - 1,
  })),
  on(articleEndpointActions.articlesLoaded, (state, { articles, pageLast, pageFirst }) => ({
    ...state,
    articles,
    isLoading: false,
    pageFirst,
    pageLast,
  })),
  on(articleEndpointActions.lengthLoaded, (state, { dataLength }) => ({ ...state, dataLength })),
  on(articleEndpointActions.articlesLoadingError, (state) => ({ ...state, isLoading: false }))
);

export function reducer(state: State | undefined, action: Action) {
  return articleReducer(state, action);
}
