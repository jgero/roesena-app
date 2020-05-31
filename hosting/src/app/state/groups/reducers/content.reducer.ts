import { ContentActions, ContentActionTypes } from '../actions/content.actions';
import * as fromRoot from '@state/state.module';
import { AppArticle, AppImage } from '@utils/interfaces';

export const contentFeatureKey = 'group';

interface GroupState {
  article: AppArticle;
  image: AppImage;
}

export interface State extends fromRoot.State {
  group: GroupState;
}

export const initialState: GroupState = {
  article: null,
  image: null,
};

export function reducer(state = initialState, action: ContentActions): GroupState {
  switch (action.type) {
    case ContentActionTypes.LoadArticleSuccess:
      return { ...state, article: action.payload.article || null };

    case ContentActionTypes.LoadImageSuccess:
      return { ...state, image: action.payload.image || null };

    case ContentActionTypes.LoadContent:
      return initialState;
    case ContentActionTypes.LoadArticleSuccess:
    case ContentActionTypes.LoadImageFailure:
      return state;

    default:
      return state;
  }
}
