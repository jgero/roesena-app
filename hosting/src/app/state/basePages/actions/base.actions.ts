import { Action } from '@ngrx/store';
import { AppArticle, AppElement, AppEvent } from '@utils/interfaces';

export enum BaseActionTypes {
  LoadRespondablesSuccess = '[Base] respondable amount loaded',
  LoadRespondablesFailure = '[Base] respondable amount loading failed',
  LoadHelpArticle = '[Base] load help article',
  LoadHelpArticleSuccess = '[Base] load help article success',
  LoadHelpArticleFailed = '[Base] loading help article failed',
  LoadStartpageContent = '[Base] load startpage content',
  LoadStartpageArticleSuccess = '[Base] startpage article loaded',
  LoadStartpageArticleFailure = '[Base] startpage article loading failed',
  LoadStartpageEventSuccess = '[Base] startpage event loaded',
  LoadStartpageEventFailure = '[Base] startpage event loading failed',
}

export class LoadRespondablesSuccess implements Action {
  readonly type = BaseActionTypes.LoadRespondablesSuccess;
  constructor(public payload: { amount: number }) {}
}

export class LoadRespondablesFailure implements Action {
  readonly type = BaseActionTypes.LoadRespondablesFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadHelpArticle implements Action {
  readonly type = BaseActionTypes.LoadHelpArticle;
}

export class LoadHelpArticleSuccess implements Action {
  readonly type = BaseActionTypes.LoadHelpArticleSuccess;
  constructor(public payload: { article: AppArticle }) {}
}

export class LoadHelpArticleFailed implements Action {
  readonly type = BaseActionTypes.LoadHelpArticleFailed;
  constructor(public payload: { error: any }) {}
}

export class LoadStartpageContent implements Action {
  readonly type = BaseActionTypes.LoadStartpageContent;
}

export class LoadStartpageArticleSuccess implements Action {
  readonly type = BaseActionTypes.LoadStartpageArticleSuccess;
  constructor(public payload: { article: AppArticle }) {}
}

export class LoadStartpageArticleFailure implements Action {
  readonly type = BaseActionTypes.LoadStartpageArticleFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadStartpageEventSuccess implements Action {
  readonly type = BaseActionTypes.LoadStartpageEventSuccess;
  constructor(public payload: { event: AppEvent }) {}
}

export class LoadStartpageEventFailure implements Action {
  readonly type = BaseActionTypes.LoadStartpageEventFailure;
  constructor(public payload: { error: any }) {}
}

export type BaseActions =
  | LoadRespondablesSuccess
  | LoadRespondablesFailure
  | LoadHelpArticle
  | LoadHelpArticleSuccess
  | LoadHelpArticleFailed
  | LoadStartpageContent
  | LoadStartpageArticleSuccess
  | LoadStartpageArticleFailure
  | LoadStartpageEventSuccess
  | LoadStartpageEventFailure;
