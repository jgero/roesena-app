import { Action } from '@ngrx/store';
import { AppImage } from '@utils/interfaces';

export enum ImageActionTypes {
  CreateImage = '[image editor] create image',
  CreateImageSuccess = '[image editor] create image success',
  CreateImageFailure = '[image editor] create image failure',
  UpdateImage = '[image editor] update image',
  UpdateImageSuccess = '[image editor] update image success',
  UpdateImageFailure = '[image editor] update image failure',
  DeleteImage = '[image editor] delete image',
  DeleteImageSuccess = '[image editor] delete image success',
  DeleteImageFailure = '[image editor] delete image failure',
}

export class CreateImage implements Action {
  readonly type = ImageActionTypes.CreateImage;
  constructor(public payload: { image: AppImage; file: string }) {}
}

export class CreateImageSuccess implements Action {
  readonly type = ImageActionTypes.CreateImageSuccess;
}

export class CreateImageFailure implements Action {
  readonly type = ImageActionTypes.CreateImageFailure;
  constructor(public payload: { error: any }) {}
}

export class UpdateImage implements Action {
  readonly type = ImageActionTypes.UpdateImage;
  constructor(public payload: { image: AppImage; file?: string }) {}
}

export class UpdateImageSuccess implements Action {
  readonly type = ImageActionTypes.UpdateImageSuccess;
}

export class UpdateImageFailure implements Action {
  readonly type = ImageActionTypes.UpdateImageFailure;
  constructor(public payload: { error: any }) {}
}

export class DeleteImage implements Action {
  readonly type = ImageActionTypes.DeleteImage;
}

export class DeleteImageSuccess implements Action {
  readonly type = ImageActionTypes.DeleteImageSuccess;
}

export class DeleteImageFailure implements Action {
  readonly type = ImageActionTypes.DeleteImageFailure;
  constructor(public payload: { error: any }) {}
}

export type ImageActions =
  | CreateImage
  | CreateImageSuccess
  | CreateImageFailure
  | UpdateImage
  | UpdateImageSuccess
  | UpdateImageFailure
  | DeleteImage
  | DeleteImageSuccess
  | DeleteImageFailure;
