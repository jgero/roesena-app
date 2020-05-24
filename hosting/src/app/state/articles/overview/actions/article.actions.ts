import { Action } from '@ngrx/store';
import { AppArticle } from '@utils/interfaces';

export enum ArticleActionTypes {
  LoadArticles = '[article overview] Load Articles',
  LoadArticlesSuccess = '[article overview] Load Articles Success',
  LoadArticlesFailure = '[article overview] Load Articles Failure',
  LoadLengthSuccess = '[article overview] Load Articles length Success',
  LoadLengthFailure = '[article overview] Load Articles length Failure',
}

export class LoadArticles implements Action {
  readonly type = ArticleActionTypes.LoadArticles;
  constructor(public payload: { limit: number }) {}
}

export class LoadArticlesSuccess implements Action {
  readonly type = ArticleActionTypes.LoadArticlesSuccess;
  constructor(public payload: { articles: AppArticle[] }) {}
}

export class LoadArticlesFailure implements Action {
  readonly type = ArticleActionTypes.LoadArticlesFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadLengthSuccess implements Action {
  readonly type = ArticleActionTypes.LoadLengthSuccess;
  constructor(public payload: { length: number }) {}
}

export class LoadLengthFailure implements Action {
  readonly type = ArticleActionTypes.LoadLengthFailure;
  constructor(public payload: { error: any }) {}
}

export type ArticleOverviewActions =
  | LoadArticles
  | LoadArticlesSuccess
  | LoadArticlesFailure
  | LoadLengthSuccess
  | LoadLengthFailure;
