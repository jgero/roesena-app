import { Action } from '@ngrx/store';
import { AppArticle, AppImage } from '@utils/interfaces';

export enum ContentActionTypes {
  LoadContent = '[common group component] Load Content',
  LoadArticleSuccess = '[common group component] Load article Success',
  LoadArtcileFailure = '[common group component] Load article Failure',
  LoadImageSuccess = '[common group component] Load image Success',
  LoadImageFailure = '[common group component] Load image Failure',
}

export class LoadContent implements Action {
  readonly type = ContentActionTypes.LoadContent;
}

export class LoadArticleSuccess implements Action {
  readonly type = ContentActionTypes.LoadArticleSuccess;
  constructor(public payload: { article: AppArticle }) {}
}

export class LoadArtcileFailure implements Action {
  readonly type = ContentActionTypes.LoadArtcileFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadImageSuccess implements Action {
  readonly type = ContentActionTypes.LoadImageSuccess;
  constructor(public payload: { image: AppImage }) {}
}

export class LoadImageFailure implements Action {
  readonly type = ContentActionTypes.LoadImageFailure;
  constructor(public payload: { error: any }) {}
}

export type ContentActions = LoadContent | LoadArticleSuccess | LoadArtcileFailure | LoadImageSuccess | LoadImageFailure;
