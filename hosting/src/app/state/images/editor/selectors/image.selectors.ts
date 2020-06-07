import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromImage from '../reducers/image.reducer';

export const selectImageState = createFeatureSelector<fromImage.State>(
  fromImage.imageFeatureKey
);
