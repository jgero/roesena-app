import { CardActions, CardActionTypes } from '../actions/card.actions';
import * as fromRoot from '@state/state.module';

export const cardFeatureKey = 'card';

interface CardState {}

export interface State extends fromRoot.State {
  cards: CardState;
}

export const initialState: CardState = {};

export function reducer(state = initialState, action: CardActions): CardState {
  switch (action.type) {
    case CardActionTypes.TagClick:
      return state;

    default:
      return state;
  }
}
