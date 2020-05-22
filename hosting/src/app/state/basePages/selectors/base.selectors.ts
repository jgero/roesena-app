import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBase from '../reducers/base.reducer';

export const selectBaseState = createFeatureSelector<fromBase.State>(
  fromBase.baseFeatureKey
);
