import { EditorActions, EditorActionTypes } from '../actions/editor.actions';

import * as fromArticles from '@state/articles/reducers/article.reducer';

export const editorFeatureKey = 'editor';

interface EditorState {
  isLoading: boolean;
}

export interface State extends fromArticles.State {
  articleEditor: EditorState;
}

export const initialState: EditorState = {
  isLoading: false,
};

export function reducer(state = initialState, action: EditorActions): EditorState {
  switch (action.type) {
    case EditorActionTypes.CreateArticle:
    case EditorActionTypes.UpdateArticle:
    case EditorActionTypes.DeleteArticle:
      return { ...state, isLoading: true };

    case EditorActionTypes.CreateArticleSuccess:
    case EditorActionTypes.CreateArticleFailure:
    case EditorActionTypes.UpdateArticleSuccess:
    case EditorActionTypes.UpdateArticleFailure:
    case EditorActionTypes.DeleteArticleSuccess:
    case EditorActionTypes.DeleteArticleFailure:
      return { ...state, isLoading: false };
    default:
      return state;
  }
}
