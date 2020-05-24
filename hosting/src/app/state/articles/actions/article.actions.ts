import { Action } from '@ngrx/store';
import { AppArticle, AppImage } from '@utils/interfaces';

export enum ArticleActionTypes {
  LoadSingleArticle = '[Article] Load Article',
  LoadSingleArticleSuccess = '[Article] Load Article Success',
  LoadSingleArticleFailure = '[Article] Load Article Failed',
}

export class LoadSingleArticle implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticle;
  constructor(public payload: { withImage: boolean } = { withImage: true }) {}
}
export class LoadSingleArticleSuccess implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticleSuccess;
  constructor(public payload: { article: AppArticle; image: AppImage }) {}
}
export class LoadSingleArticleFailure implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticleFailure;
  constructor(public payload: { error: any }) {}
}

export type ArticleActions = LoadSingleArticle | LoadSingleArticleSuccess | LoadSingleArticleFailure;
