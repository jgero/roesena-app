import { ImageActions, ImageActionTypes } from '../actions/image.actions';
import { AppImage } from '@utils/interfaces';
import { PageActions, PageActionTypes } from '@state/pagination/actions/page.actions';

export const imageFeatureKey = 'images';

export interface State {
  activeImage: AppImage;
  activeImageFullUrl: string;
  activePageImages: AppImage[];
  imageAmount: number;
  isLoading: boolean;
  pageLimit: number;
  pageIndex: number;
  pageFirst: AppImage;
  pageLast: AppImage;
}

export const initialState: State = {
  activeImage: null,
  activeImageFullUrl: '',
  activePageImages: [],
  imageAmount: 0,
  isLoading: false,
  pageLimit: 3,
  pageIndex: 0,
  pageFirst: null,
  pageLast: null,
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
    // multiple images
    case ImageActionTypes.LoadImagePage:
      return { ...state, isLoading: true, pageLimit: action.payload.limit };
    case ImageActionTypes.LoadImagePageSuccess:
      return {
        ...state,
        isLoading: false,
        activePageImages: action.payload.images || null,
        pageFirst: action.payload.images[0] || null,
        pageLast: action.payload.images[action.payload.images.length - 1] || null,
      };
    case ImageActionTypes.LoadImagePageFailure:
      return { ...state, isLoading: false };
    // image amount
    case ImageActionTypes.LoadImageAmountSuccess:
      return { ...state, imageAmount: action.payload.amount };
    // clear images on page action
    case PageActionTypes.PageForward:
      return { ...state, pageIndex: state.pageIndex + 1 };
    case PageActionTypes.PageBackwards:
      return { ...state, pageIndex: state.pageIndex - 1 };
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
