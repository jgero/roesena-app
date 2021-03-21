import { ArticleActions, ArticleActionTypes } from '../actions/article.actions';
import { AppArticle } from '@utils/interfaces';

import { PageActions } from '@state/pagination/actions/page.actions';

export const articleFeatureKey = 'articles';

export interface State {
  activeArticle: AppArticle;
  activeArticleSelection: AppArticle[];
  isLoading: boolean;
}

export const initialState: State = {
  activeArticle: null,
  activeArticleSelection: [],
  isLoading: false,
};

export function reducer(state = initialState, action: ArticleActions | PageActions): State {
  switch (action.type) {
    // single article
    case ArticleActionTypes.LoadSingleArticle:
      return { ...state, isLoading: true };
    case ArticleActionTypes.LoadSingleArticleSuccess:
      return { ...state, isLoading: false, activeArticle: action.payload.article };
    case ArticleActionTypes.LoadSingleArticleFailure:
      return { ...state, isLoading: false };
    // article selection
    case ArticleActionTypes.LoadArticleSelection:
      return { ...state, isLoading: true };
    case ArticleActionTypes.LoadArticleSelectionSuccess:
      return { ...state, isLoading: false, activeArticleSelection: action.payload.articles };
    case ArticleActionTypes.LoadArticleSelectionFailure:
      return { ...state, isLoading: false };
    // editor
    case ArticleActionTypes.CreateArticle:
    case ArticleActionTypes.UpdateArticle:
    case ArticleActionTypes.DeleteArticle:
      return { ...state, isLoading: true };
    case ArticleActionTypes.CreateArticleSuccess:
    case ArticleActionTypes.CreateArticleFailure:
    case ArticleActionTypes.UpdateArticleSuccess:
    case ArticleActionTypes.UpdateArticleFailure:
    case ArticleActionTypes.DeleteArticleSuccess:
    case ArticleActionTypes.DeleteArticleFailure:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
