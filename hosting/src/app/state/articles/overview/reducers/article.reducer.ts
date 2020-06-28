import { ArticleOverviewActions, ArticleActionTypes } from '../actions/article.actions';
import * as fromRoot from '@state/state.module';
import { AppArticle } from '@utils/interfaces';

export const articleFeatureKey = 'articleOverview';

interface ArticleOverviewState {
  articles: AppArticle[];
  length: number;
  pageFirst: AppArticle;
  pageLast: AppArticle;
  limit: number;
  isLoading: boolean;
}

export interface State extends fromRoot.State {
  articleOverview: ArticleOverviewState;
}

export const initialState: ArticleOverviewState = {
  articles: null,
  length: 0,
  pageFirst: null,
  pageLast: null,
  limit: 3,
  isLoading: false,
};

export function reducer(state = initialState, action: ArticleOverviewActions): ArticleOverviewState {
  switch (action.type) {
    case ArticleActionTypes.LoadArticles:
      return { ...state, limit: action.payload.limit, isLoading: true, articles: null };

    case ArticleActionTypes.LoadArticlesSuccess:
      return {
        ...state,
        articles: action.payload.articles || null,
        pageFirst: action.payload.articles[0] || null,
        pageLast: action.payload.articles[action.payload.articles.length - 1] || null,
        isLoading: false,
      };

    case ArticleActionTypes.LoadArticlesFailure:
      return { ...state, isLoading: false };

    case ArticleActionTypes.LoadLengthSuccess:
      return { ...state, length: action.payload.length };

    case ArticleActionTypes.LoadLengthFailure:
      return state;

    default:
      return state;
  }
}
