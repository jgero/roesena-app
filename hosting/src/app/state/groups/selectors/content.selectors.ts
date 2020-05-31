import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromContent from '../reducers/content.reducer';

export const selectContentState = createFeatureSelector<fromContent.State>(
  fromContent.contentFeatureKey
);
