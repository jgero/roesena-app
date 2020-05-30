import { ImageActions, ImageActionTypes } from '../actions/image.actions';
import * as fromRoot from '@state/images/reducers/image.reducer';
import { AppImage } from '@utils/interfaces';

export const imageFeatureKey = 'imageOverview';

interface ImageOverviewState {
  images: AppImage[];
  length: number;
  limit: number;
  pageLast: AppImage;
  pageFirst: AppImage;
}

export interface State extends fromRoot.State {
  imageOverview: ImageOverviewState;
}

export const initialState: ImageOverviewState = {
  images: [],
  length: 0,
  limit: 3,
  pageLast: null,
  pageFirst: null,
};

export function reducer(state = initialState, action: ImageActions): ImageOverviewState {
  switch (action.type) {
    case ImageActionTypes.LoadImages:
      return { ...state, limit: action.payload.limit };

    case ImageActionTypes.LoadImagesSuccess:
      return {
        ...state,
        images: action.payload.images,
        pageLast: action.payload.images[action.payload.images.length - 1] || null,
        pageFirst: action.payload.images[0] || null,
      };

    case ImageActionTypes.LoadImagesFailure:
      return state;

    case ImageActionTypes.LoadLengthSuccess:
      return { ...state, length: action.payload.length };

    default:
      return state;
  }
}
