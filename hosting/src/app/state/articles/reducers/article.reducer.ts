import { ArticleActions, ArticleActionTypes } from '../actions/article.actions';
import { AppArticle } from '@utils/interfaces';

import * as fromRoot from '@state/state.module';

export const articleFeatureKey = 'article';

interface ArticleState {
  pageIndex: number;
  articles: AppArticle[];
  dataLength: number;
  isLoading: boolean;
  columns: number;
  limit: number;
  pageFirst: AppArticle;
  pageLast: AppArticle;
}

export interface State extends fromRoot.State {
  article: ArticleState;
}

export const initialState: ArticleState = {
  pageIndex: 0,
  articles: [],
  dataLength: 0,
  isLoading: false,
  columns: Math.ceil(window.innerWidth / 500),
  limit: Math.ceil(window.innerWidth / 500) * 5,
  pageFirst: null,
  pageLast: null,
};

export function reducer(state = initialState, action: ArticleActions): ArticleState {
  switch (action.type) {
    case ArticleActionTypes.PageForward:
      return { ...state, pageIndex: state.pageIndex + 1 };
    case ArticleActionTypes.PageBackwards:
      return { ...state, pageIndex: state.pageIndex === 0 ? 0 : state.pageIndex - 1 };

    case ArticleActionTypes.LoadArticles:
      return { ...state, pageIndex: 0, isLoading: true };

    case ArticleActionTypes.LoadArticlesSuccess:
      return {
        ...state,
        articles: action.payload.articles,
        isLoading: false,
        pageFirst: action.payload.pageFirst,
        pageLast: action.payload.pageLast,
      };
    case ArticleActionTypes.LoadArticlesFailure:
      return { ...state, isLoading: false };
    case ArticleActionTypes.LoadLengthSuccess:
      return { ...state, dataLength: action.payload.dataLength };

    default:
      return state;
  }
}
