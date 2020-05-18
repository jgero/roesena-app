import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from '../reducers/search.reducer';

export const selectSearchState = createFeatureSelector<fromSearch.State>(
  fromSearch.searchFeatureKey
);
