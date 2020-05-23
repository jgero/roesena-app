import { ArticleActions, ArticleActionTypes } from '../actions/article.actions';
import { AppArticle, AppImage } from '@utils/interfaces';

import * as fromRoot from '@state/state.module';

export const articleFeatureKey = 'article';

export interface ArticleState {
  pageIndex: number;
  articles: AppArticle[];
  article: AppArticle;
  image: AppImage;
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
  article: null,
  image: null,
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
    case ArticleActionTypes.LoadSingleArticle:
      return { ...state, isLoading: true, article: null, image: null };
    case ArticleActionTypes.LoadSingleArticleSuccess:
      return { ...state, isLoading: false, article: action.payload.article, image: action.payload.image };

    case ArticleActionTypes.LoadArticlesSuccess:
      return {
        ...state,
        articles: action.payload.articles,
        isLoading: false,
        pageFirst: action.payload.articles[0],
        pageLast: action.payload.articles[action.payload.articles.length - 1],
      };
    case ArticleActionTypes.DataFailure:
      return { ...state, isLoading: false };
    case ArticleActionTypes.LoadLengthSuccess:
      return { ...state, dataLength: action.payload.dataLength };

    default:
      return state;
  }
}
