import { Action } from '@ngrx/store';
import { AppArticle, AppElement, AppEvent } from '@utils/interfaces';

export enum BaseActionTypes {
  LoadRespondablesSuccess = '[Base] respondable amount loaded',
  LoadRespondablesFailure = '[Base] respondable amount loading failed',
  LoadHelpArticle = '[Base] load help article',
  LoadHelpArticleSuccess = '[Base] load help article success',
  LoadHelpArticleFailed = '[Base] loading help article failed',
  LoadStartpageContent = '[Base] load startpage content',
  LoadStartpageArticlesSuccess = '[Base] startpage articles loaded',
  LoadStartpageArticlesFailure = '[Base] startpage articles loading failed',
  LoadStartpageEventsSuccess = '[Base] startpage events loaded',
  LoadStartpageEventsFailure = '[Base] startpage events loading failed',
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

export class LoadStartpageArticlesSuccess implements Action {
  readonly type = BaseActionTypes.LoadStartpageArticlesSuccess;
  constructor(public payload: { articles: AppArticle[] }) {}
}

export class LoadStartpageArticlesFailure implements Action {
  readonly type = BaseActionTypes.LoadStartpageArticlesFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadStartpageEventsSuccess implements Action {
  readonly type = BaseActionTypes.LoadStartpageEventsSuccess;
  constructor(public payload: { events: AppEvent[] }) {}
}

export class LoadStartpageEventsFailure implements Action {
  readonly type = BaseActionTypes.LoadStartpageEventsFailure;
  constructor(public payload: { error: any }) {}
}

export type BaseActions =
  | LoadRespondablesSuccess
  | LoadRespondablesFailure
  | LoadHelpArticle
  | LoadHelpArticleSuccess
  | LoadHelpArticleFailed
  | LoadStartpageContent
  | LoadStartpageArticlesSuccess
  | LoadStartpageArticlesFailure
  | LoadStartpageEventsSuccess
  | LoadStartpageEventsFailure;
