import { ImageActions, ImageActionTypes } from '../actions/image.actions';
import * as fromRoot from '@state/images/reducers/image.reducer';

export const imageFeatureKey = 'imageEditor';

interface ImageEditorState {
  isLoading: boolean;
}

export interface State extends fromRoot.State {
  imageEditor: ImageEditorState;
}

export const initialState: ImageEditorState = {
  isLoading: false,
};

export function reducer(state = initialState, action: ImageActions): ImageEditorState {
  switch (action.type) {
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
