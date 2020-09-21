import { BaseActions, BaseActionTypes } from '../actions/base.actions';

import * as fromRoot from '@state/state.module';
import { AppArticle, AppEvent } from '@utils/interfaces';

export const baseFeatureKey = 'base';

interface BaseState {
  respondablesAmount: number;
  helpArticle: AppArticle;
  startpageArticle: AppArticle;
  startpageEvent: AppEvent;
}

export interface State extends fromRoot.State {
  base: BaseState;
}

export const initialState: BaseState = {
  respondablesAmount: 0,
  helpArticle: null,
  startpageArticle: null,
  startpageEvent: null,
};

export function reducer(state = initialState, action: BaseActions): BaseState {
  switch (action.type) {
    case BaseActionTypes.LoadRespondablesSuccess:
      return { ...state, respondablesAmount: action.payload.amount };

    case BaseActionTypes.LoadRespondablesFailure:
      return { ...state, respondablesAmount: 0 };

    case BaseActionTypes.LoadHelpArticleSuccess:
      return { ...state, helpArticle: action.payload.article };

    case BaseActionTypes.LoadStartpageArticleSuccess:
      return { ...state, startpageArticle: action.payload.article };

    case BaseActionTypes.LoadStartpageEventSuccess:
      return { ...state, startpageEvent: action.payload.event };

    default:
      return state;
  }
}
