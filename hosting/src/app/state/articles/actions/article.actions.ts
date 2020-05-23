import { Action } from '@ngrx/store';
import { AppArticle, AppImage } from '@utils/interfaces';

export enum ArticleActionTypes {
  PageForward = '[Article] Move Page Forward',
  PageBackwards = '[Article] Move Page Backwards',
  LoadArticles = '[Article] Load Articles',
  LoadArticlesSuccess = '[Article] Load Articles Success',
  LoadLengthSuccess = '[Article] Load Length Success',
  LoadSingleArticle = '[Article] Load Article',
  LoadSingleArticleSuccess = '[Article] Load Article Success',
  DataFailure = '[Article] error while interacting with database',
}

export class PageForward implements Action {
  readonly type = ArticleActionTypes.PageForward;
}
export class PageBackwards implements Action {
  readonly type = ArticleActionTypes.PageBackwards;
}
export class LoadArticles implements Action {
  readonly type = ArticleActionTypes.LoadArticles;
}
export class LoadArticlesSuccess implements Action {
  readonly type = ArticleActionTypes.LoadArticlesSuccess;
  constructor(public payload: { articles: AppArticle[] }) {}
}
export class LoadLengthSuccess implements Action {
  readonly type = ArticleActionTypes.LoadLengthSuccess;
  constructor(public payload: { dataLength: number }) {}
}
export class LoadSingleArticle implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticle;
  constructor(public payload: { withImage: boolean } = { withImage: true }) {}
}
export class LoadSingleArticleSuccess implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticleSuccess;
  constructor(public payload: { article: AppArticle; image: AppImage }) {}
}
export class DataFailure implements Action {
  readonly type = ArticleActionTypes.DataFailure;
  constructor(public payload: { error: any; source: string }) {}
}

export type ArticleActions =
  | PageForward
  | PageBackwards
  | LoadArticles
  | LoadArticlesSuccess
  | LoadLengthSuccess
  | LoadSingleArticle
  | LoadSingleArticleSuccess
  | DataFailure;
