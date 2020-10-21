import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromContact from '../reducers/contact.reducer';

export const selectContactState = createFeatureSelector<fromContact.State>(
  fromContact.contactFeatureKey
);
