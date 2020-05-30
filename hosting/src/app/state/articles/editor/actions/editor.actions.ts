import { Action } from '@ngrx/store';
import { AppArticle } from '@utils/interfaces';

export enum EditorActionTypes {
  CreateArticle = '[Article Editor] create article',
  CreateArticleSuccess = '[Article Editor] create article success',
  CreateArticleFailure = '[Article Editor] create article failure',
  UpdateArticle = '[Article Editor] update article',
  UpdateArticleSuccess = '[Article Editor] update article success',
  UpdateArticleFailure = '[Article Editor] update article failure',
  DeleteArticle = '[Article Editor] delete articel',
  DeleteArticleSuccess = '[Article Editor] delete article success',
  DeleteArticleFailure = '[Article Editor] delete article failure',
}

export class CreateArticle implements Action {
  readonly type = EditorActionTypes.CreateArticle;
  constructor(public payload: { article: AppArticle }) {}
}
export class CreateArticleSuccess implements Action {
  readonly type = EditorActionTypes.CreateArticleSuccess;
}
export class CreateArticleFailure implements Action {
  readonly type = EditorActionTypes.CreateArticleFailure;
  constructor(public payload: { error: any }) {}
}
export class UpdateArticle implements Action {
  readonly type = EditorActionTypes.UpdateArticle;
  constructor(public payload: { article: AppArticle }) {}
}
export class UpdateArticleSuccess implements Action {
  readonly type = EditorActionTypes.UpdateArticleSuccess;
}
export class UpdateArticleFailure implements Action {
  readonly type = EditorActionTypes.UpdateArticleFailure;
  constructor(public payload: { error: any }) {}
}
export class DeleteArticle implements Action {
  readonly type = EditorActionTypes.DeleteArticle;
  constructor(public payload: { article: AppArticle }) {}
}
export class DeleteArticleSuccess implements Action {
  readonly type = EditorActionTypes.DeleteArticleSuccess;
}
export class DeleteArticleFailure implements Action {
  readonly type = EditorActionTypes.DeleteArticleFailure;
  constructor(public payload: { error: any }) {}
}

export type EditorActions =
  | CreateArticle
  | CreateArticleSuccess
  | CreateArticleFailure
  | UpdateArticle
  | UpdateArticleSuccess
  | UpdateArticleFailure
  | DeleteArticle
  | DeleteArticleSuccess
  | DeleteArticleFailure;
