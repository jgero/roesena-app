import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEvent from '../reducers/event.reducer';

export const selectEventState = createFeatureSelector<fromEvent.State>(
  fromEvent.eventFeatureKey
);
