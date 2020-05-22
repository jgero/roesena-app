import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCard from '../reducers/card.reducer';

export const selectCardState = createFeatureSelector<fromCard.State>(
  fromCard.cardFeatureKey
);
