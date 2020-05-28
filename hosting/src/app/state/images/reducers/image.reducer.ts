import { ImageActions, ImageActionTypes } from '../actions/image.actions';
import * as fromRoot from '@state/state.module';
import { AppImage } from '@utils/interfaces';

export const imageFeatureKey = 'image';

interface ImageState {
  image: AppImage;
}

export interface State extends fromRoot.State {
  image: ImageState;
}

export const initialState: ImageState = {
  image: null,
};

export function reducer(state = initialState, action: ImageActions): ImageState {
  switch (action.type) {
    case ImageActionTypes.LoadImage:
      return state;

    case ImageActionTypes.LoadImageSuccess:
      return { ...state, image: action.payload.image };

    case ImageActionTypes.LoadImageFailure:
      return state;

    default:
      return state;
  }
}
