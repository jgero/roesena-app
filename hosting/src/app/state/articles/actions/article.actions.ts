import { Action } from '@ngrx/store';
import { AppArticle } from '@utils/interfaces';

export enum ArticleActionTypes {
  PageForward = '[Article] Move Page Forward',
  PageBackwards = '[Article] Move Page Backwards',
  LoadArticles = '[Article] Load Articles',
  LoadArticlesSuccess = '[Article] Load Articles Success',
  LoadArticlesFailure = '[Article] Load Articles Failure',
  LoadLengthSuccess = '[Article] Load Length Success',
  LoadLengthFailure = '[Article] Load Length Failure',
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
  constructor(
    public payload: {
      articles: AppArticle[];
      pageFirst: AppArticle;
      pageLast: AppArticle;
    }
  ) {}
}
export class LoadArticlesFailure implements Action {
  readonly type = ArticleActionTypes.LoadArticlesFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadLengthSuccess implements Action {
  readonly type = ArticleActionTypes.LoadLengthSuccess;
  constructor(
    public payload: {
      dataLength: number;
    }
  ) {}
}
export class LoadLengthFailure implements Action {
  readonly type = ArticleActionTypes.LoadLengthFailure;
  constructor(public payload: { error: any }) {}
}

export type ArticleActions =
  | PageForward
  | PageBackwards
  | LoadArticlesSuccess
  | LoadArticlesFailure
  | LoadLengthSuccess
  | LoadLengthFailure
  | LoadArticles;
