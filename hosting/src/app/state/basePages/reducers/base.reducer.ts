import { BaseActions, BaseActionTypes } from '../actions/base.actions';

import * as fromRoot from '@state/state.module';
import { AppArticle, AppEvent } from '@utils/interfaces';

export const baseFeatureKey = 'base';

interface BaseState {
  respondablesAmount: number;
  helpArticle: AppArticle;
  startpageArticles: AppArticle[];
  startpageEvents: AppEvent[];
}

export interface State extends fromRoot.State {
  base: BaseState;
}

export const initialState: BaseState = {
  respondablesAmount: 0,
  helpArticle: null,
  startpageArticles: [],
  startpageEvents: [],
};

export function reducer(state = initialState, action: BaseActions): BaseState {
  switch (action.type) {
    case BaseActionTypes.LoadRespondablesSuccess:
      return { ...state, respondablesAmount: action.payload.amount };

    case BaseActionTypes.LoadRespondablesFailure:
      return { ...state, respondablesAmount: 0 };

    case BaseActionTypes.LoadHelpArticleSuccess:
      return { ...state, helpArticle: action.payload.article };

    case BaseActionTypes.LoadStartpageArticlesSuccess:
      return { ...state, startpageArticles: action.payload.articles };

    case BaseActionTypes.LoadStartpageEventsSuccess:
      return { ...state, startpageEvents: action.payload.events };

    default:
      return state;
  }
}
