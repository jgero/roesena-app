import { ArticleActions, ArticleActionTypes } from '../actions/article.actions';
import { AppArticle } from '@utils/interfaces';

import * as fromRoot from '@state/state.module';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';

export const articleFeatureKey = 'article';

export interface ArticleState {
  activeArticle: AppArticle;
  activePageArticles: AppArticle[];
  articleAmount: number;
  isLoading: boolean;
  pageLimit: number;
  pageFirst: AppArticle;
  pageLast: AppArticle;
}

export interface State extends fromRoot.State {
  article: ArticleState;
}

export const initialState: ArticleState = {
  activeArticle: null,
  activePageArticles: [],
  articleAmount: 0,
  isLoading: false,
  pageLimit: 3,
  pageFirst: null,
  pageLast: null,
};

export function reducer(state = initialState, action: ArticleActions | PageActions): ArticleState {
  switch (action.type) {
    // single article
    case ArticleActionTypes.LoadSingleArticle:
      return { ...state, isLoading: true };
    case ArticleActionTypes.LoadSingleArticleSuccess:
      return { ...state, isLoading: false, activeArticle: action.payload.article };
    case ArticleActionTypes.LoadSingleArticleFailure:
      return { ...state, isLoading: false };
    // multiple articles
    case ArticleActionTypes.LoadArticlePage:
      return { ...state, isLoading: true, pageLimit: action.payload.limit };
    case ArticleActionTypes.LoadArticlePageSuccess:
      return {
        ...state,
        isLoading: false,
        activePageArticles: action.payload.articles || null,
        pageFirst: action.payload.articles[0] || null,
        pageLast: action.payload.articles[action.payload.articles.length - 1] || null,
      };
    case ArticleActionTypes.LoadArticlePageFailure:
      return { ...state, isLoading: false };
    // article amount
    case ArticleActionTypes.LoadArticleAmountSuccess:
      return { ...state, articleAmount: action.payload.amount };
    // clear articles on page action
    case PageActionTypes.PageForward:
    case PageActionTypes.PageBackwards:
      return { ...state, activePageArticles: [] };

    default:
      return state;
  }
}
