import { Action } from '@ngrx/store';
import { AppArticle } from '@utils/interfaces';

export enum ArticleActionTypes {
  // load single article
  LoadSingleArticle = '[article] load article',
  LoadSingleArticleSuccess = '[article] load article success',
  LoadSingleArticleFailure = '[article] load article failure',
  // load articles for overveiw page
  LoadArticlePage = '[article] load articles for an entire page',
  LoadArticlePageSuccess = '[article] load articles for an entire page success',
  LoadArticlePageFailure = '[article] load articles for an entire page failure',
  // load amout of articles in the system
  LoadArticleAmount = '[article] load amount of articles in the database',
  LoadArticleAmountSuccess = '[article] load amount of articles in the database success',
  LoadArticleAmountFailure = '[article] load amount of articles in the database failure',
  // article mutation operations
  CreateArticle = '[article] create a new article',
  CreateArticleSuccess = '[article] create a new article success',
  CreateArticleFailure = '[article] create a new article failure',
  UpdateArticle = '[article] update an existing article',
  UpdateArticleSuccess = '[article] update an existing article success',
  UpdateArticleFailure = '[article] update an existing article failure',
  DeleteArticle = '[article] delete an article',
  DeleteArticleSuccess = '[article] delete an article success',
  DeleteArticleFailure = '[article] delete an article failure',
}

// load single article
export class LoadSingleArticle implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticle;
  constructor(public payload: { withImage: boolean } = { withImage: true }) {}
}
export class LoadSingleArticleSuccess implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticleSuccess;
  constructor(public payload: { article: AppArticle; imageUrl: string }) {}
}
export class LoadSingleArticleFailure implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticleFailure;
  constructor(public payload: { error: any }) {}
}

// load articles for overveiw page
export class LoadArticlePage implements Action {
  readonly type = ArticleActionTypes.LoadArticlePage;
  constructor(public payload: { limit: number }) {}
}
export class LoadArticlePageSuccess implements Action {
  readonly type = ArticleActionTypes.LoadArticlePageSuccess;
  constructor(public payload: { articles: AppArticle[] }) {}
}
export class LoadArticlePageFailure implements Action {
  readonly type = ArticleActionTypes.LoadArticlePageFailure;
  constructor(public payload: { error: any }) {}
}

// load amount of articles in the database
export class LoadArticleAmount implements Action {
  readonly type = ArticleActionTypes.LoadArticleAmount;
}
export class LoadArticleAmountSuccess implements Action {
  readonly type = ArticleActionTypes.LoadArticleAmountSuccess;
  constructor(public payload: { amount: number }) {}
}
export class LoadArticleAmountFailure implements Action {
  readonly type = ArticleActionTypes.LoadArticleAmountFailure;
  constructor(public payload: { error: any }) {}
}

// article mutation operations
export class CreateArticle implements Action {
  readonly type = ArticleActionTypes.CreateArticle;
  constructor(public payload: { article: AppArticle }) {}
}
export class CreateArticleSuccess implements Action {
  readonly type = ArticleActionTypes.CreateArticleSuccess;
}
export class CreateArticleFailure implements Action {
  readonly type = ArticleActionTypes.CreateArticleFailure;
  constructor(public payload: { error: any }) {}
}
export class UpdateArticle implements Action {
  readonly type = ArticleActionTypes.UpdateArticle;
  constructor(public payload: { article: AppArticle }) {}
}
export class UpdateArticleSuccess implements Action {
  readonly type = ArticleActionTypes.UpdateArticleSuccess;
}
export class UpdateArticleFailure implements Action {
  readonly type = ArticleActionTypes.UpdateArticleFailure;
  constructor(public payload: { error: any }) {}
}
export class DeleteArticle implements Action {
  readonly type = ArticleActionTypes.DeleteArticle;
  constructor(public payload: { article: AppArticle }) {}
}
export class DeleteArticleSuccess implements Action {
  readonly type = ArticleActionTypes.DeleteArticleSuccess;
}
export class DeleteArticleFailure implements Action {
  readonly type = ArticleActionTypes.DeleteArticleFailure;
  constructor(public payload: { error: any }) {}
}

export type ArticleActions =
  | LoadSingleArticle
  | LoadSingleArticleSuccess
  | LoadSingleArticleFailure
  | LoadArticlePage
  | LoadArticlePageSuccess
  | LoadArticlePageFailure
  | LoadArticleAmount
  | LoadArticleAmountSuccess
  | LoadArticleAmountFailure
  | CreateArticle
  | CreateArticleSuccess
  | CreateArticleFailure
  | UpdateArticle
  | UpdateArticleSuccess
  | UpdateArticleFailure
  | DeleteArticle
  | DeleteArticleSuccess
  | DeleteArticleFailure;
