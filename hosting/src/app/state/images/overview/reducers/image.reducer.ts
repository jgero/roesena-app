
import { ImageActions, ImageActionTypes } from '../actions/image.actions';

export const imageFeatureKey = 'image';

export interface State {

}

export const initialState: State = {

};

export function reducer(state = initialState, action: ImageActions): State {
  switch (action.type) {

    case ImageActionTypes.LoadImages:
      return state;

    case ImageActionTypes.LoadImagesSuccess:
      return state;

    case ImageActionTypes.LoadImagesFailure:
      return state;

    default:
      return state;
  }
}
