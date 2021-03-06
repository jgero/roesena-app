import { Action } from '@ngrx/store';
import { AppImage, TileElement } from '@utils/interfaces';

export enum ImageActionTypes {
  // load single image
  LoadSingleImage = '[image] load image',
  LoadSingleImageSuccess = '[image] load image success',
  LoadSingleImageFailure = '[image] load image failure',
  // load images for overveiw page
  LoadImagePage = '[image] load images for an entire page',
  LoadImagePageSuccess = '[image] load images for an entire page success',
  LoadImagePageFailure = '[image] load images for an entire page failure',
  // load images for start page
  LoadStartPage = '[image] load images for the startpage',
  LoadStartPageSuccess = '[image] load images for the startpage success',
  LoadStartPageFailure = '[image] load images for the startpage failure',
  // load amout of images in the system
  LoadImageAmount = '[image] load amount of images in the database',
  LoadImageAmountSuccess = '[image] load amount of images in the database success',
  LoadImageAmountFailure = '[image] load amount of images in the database failure',
  // image mutation operations
  CreateImage = '[image] create a new image',
  CreateImageSuccess = '[image] create a new image success',
  CreateImageFailure = '[image] create a new image failure',
  UpdateImage = '[image] update an existing image',
  UpdateImageSuccess = '[image] update an existing image success',
  UpdateImageFailure = '[image] update an existing image failure',
  DeleteImage = '[image] delete an image',
  DeleteImageSuccess = '[image] delete an image success',
  DeleteImageFailure = '[image] delete an image failure',
  // other acitons
  CopyUrlToClipboard = '[image] copy image URL to clipboard',
}

// load single image
export class LoadSingleImage implements Action {
  readonly type = ImageActionTypes.LoadSingleImage;
  constructor(public payload?: { tags: string[] }) {}
}
export class LoadSingleImageSuccess implements Action {
  readonly type = ImageActionTypes.LoadSingleImageSuccess;
  constructor(public payload: { image: AppImage; fullUrl: string }) {}
}
export class LoadSingleImageFailure implements Action {
  readonly type = ImageActionTypes.LoadSingleImageFailure;
  constructor(public payload: { error: any }) {}
}

// load images for overveiw page
export class LoadImagePage implements Action {
  readonly type = ImageActionTypes.LoadImagePage;
  constructor(public payload: { limit: number }) {}
}
export class LoadImagePageSuccess implements Action {
  readonly type = ImageActionTypes.LoadImagePageSuccess;
  constructor(public payload: { images: AppImage[] }) {}
}
export class LoadImagePageFailure implements Action {
  readonly type = ImageActionTypes.LoadImagePageFailure;
  constructor(public payload: { error: any }) {}
}

// load images for startpage
export class LoadStartPage implements Action {
  readonly type = ImageActionTypes.LoadStartPage;
  constructor(public payload: { tileAmount: number }) {}
}
export class LoadStartPageSuccess implements Action {
  readonly type = ImageActionTypes.LoadStartPageSuccess;
  constructor(public payload: { tiles: TileElement[] }) {}
}
export class LoadStartPageFailure implements Action {
  readonly type = ImageActionTypes.LoadStartPageFailure;
  constructor(public payload: { error: any }) {}
}

// load amount of images in the database
export class LoadImageAmount implements Action {
  readonly type = ImageActionTypes.LoadImageAmount;
}
export class LoadImageAmountSuccess implements Action {
  readonly type = ImageActionTypes.LoadImageAmountSuccess;
  constructor(public payload: { amount: number }) {}
}
export class LoadImageAmountFailure implements Action {
  readonly type = ImageActionTypes.LoadImageAmountFailure;
  constructor(public payload: { error: any }) {}
}

// image mutation operations
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
  constructor(public payload: { image: AppImage }) {}
}
export class DeleteImageSuccess implements Action {
  readonly type = ImageActionTypes.DeleteImageSuccess;
}
export class DeleteImageFailure implements Action {
  readonly type = ImageActionTypes.DeleteImageFailure;
  constructor(public payload: { error: any }) {}
}

// other actions
export class CopyUrlToClipboard implements Action {
  readonly type = ImageActionTypes.CopyUrlToClipboard;
}

export type ImageActions =
  | LoadSingleImage
  | LoadSingleImageSuccess
  | LoadSingleImageFailure
  | LoadImagePage
  | LoadImagePageSuccess
  | LoadImagePageFailure
  | LoadStartPage
  | LoadStartPageSuccess
  | LoadStartPageFailure
  | LoadImageAmount
  | LoadImageAmountSuccess
  | LoadImageAmountFailure
  | CreateImage
  | CreateImageSuccess
  | CreateImageFailure
  | UpdateImage
  | UpdateImageSuccess
  | UpdateImageFailure
  | DeleteImage
  | DeleteImageSuccess
  | DeleteImageFailure
  | CopyUrlToClipboard;
