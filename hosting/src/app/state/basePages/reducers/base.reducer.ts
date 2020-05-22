import { BaseActions, BaseActionTypes } from '../actions/base.actions';

import * as fromRoot from '@state/state.module';

export const baseFeatureKey = 'base';

interface BaseState {
  respondablesAmount: number;
}

export interface State extends fromRoot.State {
  base: BaseState;
}

export const initialState: BaseState = {
  respondablesAmount: 0,
};

export function reducer(state = initialState, action: BaseActions): BaseState {
  switch (action.type) {
    case BaseActionTypes.LoadRespondablesSuccess:
      return { ...state, respondablesAmount: action.payload.amount };

    case BaseActionTypes.LoadRespondablesFailure:
      return { ...state, respondablesAmount: 0 };

    default:
      return state;
  }
}
