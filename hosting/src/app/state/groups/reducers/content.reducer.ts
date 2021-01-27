import { ContentActions, ContentActionTypes } from '../actions/content.actions';
import * as fromRoot from '@state/state.module';
import { AppArticle, AppImage } from '@utils/interfaces';

export const contentFeatureKey = 'group';

interface GroupState {
  article: AppArticle;
  imageUrl: string;
}

export interface State extends fromRoot.State {
  group: GroupState;
}

export const initialState: GroupState = {
  article: null,
  imageUrl: '',
};

export function reducer(state = initialState, action: ContentActions): GroupState {
  switch (action.type) {
    case ContentActionTypes.LoadArticleSuccess:
      return { ...state, article: action.payload.article || null };

    case ContentActionTypes.LoadImageSuccess:
      return { ...state, imageUrl: action.payload.imageUrl || '' };

    case ContentActionTypes.LoadContent:
      return initialState;
    case ContentActionTypes.LoadArticleSuccess:
    case ContentActionTypes.LoadImageFailure:
      return state;

    default:
      return state;
  }
}
