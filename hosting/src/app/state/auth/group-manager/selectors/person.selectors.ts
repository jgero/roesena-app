import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPerson from '../reducers/person.reducer';

export const selectPersonState = createFeatureSelector<fromPerson.State>(
  fromPerson.personFeatureKey
);
