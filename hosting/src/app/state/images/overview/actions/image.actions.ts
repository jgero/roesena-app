import { Action } from '@ngrx/store';
import { AppImage } from '@utils/interfaces';

export enum ImageActionTypes {
  LoadImages = '[image overview] Load Images',
  LoadImagesSuccess = '[image overview] Load Images Success',
  LoadImagesFailure = '[image overview] Load Images Failure',
  LoadLengthSuccess = '[image overview] Load Images length Success',
  LoadLengthFailure = '[image overview] Load Images length Failure',
}

export class LoadImages implements Action {
  readonly type = ImageActionTypes.LoadImages;
  constructor(public payload: { limit: number }) {}
}

export class LoadImagesSuccess implements Action {
  readonly type = ImageActionTypes.LoadImagesSuccess;
  constructor(public payload: { images: AppImage[] }) {}
}

export class LoadImagesFailure implements Action {
  readonly type = ImageActionTypes.LoadImagesFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadLengthSuccess implements Action {
  readonly type = ImageActionTypes.LoadLengthSuccess;
  constructor(public payload: { length: number }) {}
}

export class LoadLengthFailure implements Action {
  readonly type = ImageActionTypes.LoadLengthFailure;
  constructor(public payload: { error: any }) {}
}

export type ImageActions = LoadImages | LoadImagesSuccess | LoadImagesFailure | LoadLengthSuccess | LoadLengthFailure;
