import { Action } from '@ngrx/store';

export enum ImageActionTypes {
  LoadImages = '[Image] Load Images',
  LoadImagesSuccess = '[Image] Load Images Success',
  LoadImagesFailure = '[Image] Load Images Failure',
}

export class LoadImages implements Action {
  readonly type = ImageActionTypes.LoadImages;
}

export class LoadImagesSuccess implements Action {
  readonly type = ImageActionTypes.LoadImagesSuccess;
  constructor(public payload: { data: any }) { }
}

export class LoadImagesFailure implements Action {
  readonly type = ImageActionTypes.LoadImagesFailure;
  constructor(public payload: { error: any }) { }
}

export type ImageActions = LoadImages | LoadImagesSuccess | LoadImagesFailure;

