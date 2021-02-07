import { Action } from '@ngrx/store';
import { AppImage } from '@utils/interfaces';

export enum ImageActionTypes {
  LoadImage = '[Image] Load Image',
  LoadImageSuccess = '[Image] Load Image Success',
  LoadImageFailure = '[Image] Load Image Failure',
  CopyUrlToClipboard = '[Image] Copy Image URL to clipboard',
}

export class LoadImage implements Action {
  readonly type = ImageActionTypes.LoadImage;
}

export class LoadImageSuccess implements Action {
  readonly type = ImageActionTypes.LoadImageSuccess;
  constructor(public payload: { image: AppImage }) {}
}

export class LoadImageFailure implements Action {
  readonly type = ImageActionTypes.LoadImageFailure;
  constructor(public payload: { error: any }) {}
}

export class CopyUrlToClipboard implements Action {
  readonly type = ImageActionTypes.CopyUrlToClipboard;
}

export type ImageActions = LoadImage | LoadImageSuccess | LoadImageFailure | CopyUrlToClipboard;
