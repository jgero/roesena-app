import { Action } from '@ngrx/store';
import { AppArticle } from '@utils/interfaces';

export enum ArticleActionTypes {
  // load single article
  LoadSingleArticle = '[article] load article',
  LoadSingleArticleSuccess = '[article] load article success',
  LoadSingleArticleFailure = '[article] load article failure',
  // load articles for overveiw page
  LoadArticleSelection = '[article] load article selection',
  LoadArticleSelectionSuccess = '[article] load article selection success',
  LoadArticleSelectionFailure = '[article] load article selection failure',
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
  constructor(public payload?: { tags: string[] }) {}
}
export class LoadSingleArticleSuccess implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticleSuccess;
  constructor(public payload: { article: AppArticle }) {}
}
export class LoadSingleArticleFailure implements Action {
  readonly type = ArticleActionTypes.LoadSingleArticleFailure;
  constructor(public payload: { error: any }) {}
}

// load  article selection
export class LoadArticleSelection implements Action {
  readonly type = ArticleActionTypes.LoadArticleSelection;
  constructor(public payload?: { tags: string[]; limit: number }) {}
}
export class LoadArticleSelectionSuccess implements Action {
  readonly type = ArticleActionTypes.LoadArticleSelectionSuccess;
  constructor(public payload: { articles: AppArticle[] }) {}
}
export class LoadArticleSelectionFailure implements Action {
  readonly type = ArticleActionTypes.LoadArticleSelectionFailure;
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
  | LoadArticleSelection
  | LoadArticleSelectionSuccess
  | LoadArticleSelectionFailure
  | CreateArticle
  | CreateArticleSuccess
  | CreateArticleFailure
  | UpdateArticle
  | UpdateArticleSuccess
  | UpdateArticleFailure
  | DeleteArticle
  | DeleteArticleSuccess
  | DeleteArticleFailure;
