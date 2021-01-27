import { ArticleActions, ArticleActionTypes } from '../actions/article.actions';
import { AppArticle } from '@utils/interfaces';

import * as fromRoot from '@state/state.module';

export const articleFeatureKey = 'article';

export interface ArticleState {
  article: AppArticle;
  imageUrl: string;
  isLoading: boolean;
}

export interface State extends fromRoot.State {
  article: ArticleState;
}

export const initialState: ArticleState = {
  article: null,
  imageUrl: '',
  isLoading: false,
};

export function reducer(state = initialState, action: ArticleActions): ArticleState {
  switch (action.type) {
    case ArticleActionTypes.LoadSingleArticle:
      return { ...state, isLoading: true };

    case ArticleActionTypes.LoadSingleArticleSuccess:
      return { ...state, isLoading: false, article: action.payload.article, imageUrl: action.payload.imageUrl };

    case ArticleActionTypes.LoadSingleArticleFailure:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
