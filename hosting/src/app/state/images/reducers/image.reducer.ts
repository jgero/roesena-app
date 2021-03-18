import { ImageActions, ImageActionTypes } from '../actions/image.actions';
import { AppImage, TileElement } from '@utils/interfaces';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';

export const imageFeatureKey = 'images';

export interface State {
  activeImage: AppImage;
  activeImageFullUrl: string;
  startpageTiles: TileElement[];
  isLoading: boolean;
}

export const initialState: State = {
  activeImage: null,
  activeImageFullUrl: '',
  startpageTiles: [],
  isLoading: false,
};

export function reducer(state = initialState, action: ImageActions | PageActions): State {
  switch (action.type) {
    // single image
    case ImageActionTypes.LoadSingleImage:
      return { ...state, isLoading: true, activeImage: null, activeImageFullUrl: '' };
    case ImageActionTypes.LoadSingleImageSuccess:
      return { ...state, isLoading: false, activeImage: action.payload.image, activeImageFullUrl: action.payload.fullUrl };
    case ImageActionTypes.LoadSingleImageFailure:
      return { ...state, isLoading: false };
    // starpage
    case ImageActionTypes.LoadStartPage:
      return { ...state, isLoading: true };
    case ImageActionTypes.LoadStartPageSuccess:
      return { ...state, isLoading: false, startpageTiles: action.payload.tiles };
    case ImageActionTypes.LoadStartPage:
      return { ...state, isLoading: false };
    // editor
    case ImageActionTypes.CreateImage:
    case ImageActionTypes.UpdateImage:
    case ImageActionTypes.DeleteImage:
      return { ...state, isLoading: true };
    case ImageActionTypes.CreateImageSuccess:
    case ImageActionTypes.CreateImageFailure:
    case ImageActionTypes.UpdateImageSuccess:
    case ImageActionTypes.UpdateImageFailure:
    case ImageActionTypes.DeleteImageSuccess:
    case ImageActionTypes.DeleteImageFailure:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
