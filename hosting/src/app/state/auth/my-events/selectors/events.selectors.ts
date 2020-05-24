import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEvents from '../reducers/events.reducer';

export const selectEventsState = createFeatureSelector<fromEvents.State>(
  fromEvents.eventsFeatureKey
);
