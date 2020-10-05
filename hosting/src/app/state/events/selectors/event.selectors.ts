import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEvent from '../reducers/event.reducer';
import { AppPerson, AppEvent } from '@utils/interfaces';

export const selectEventState = createFeatureSelector<fromEvent.State>(fromEvent.eventFeatureKey);

export const selectUser = (state: fromEvent.State) => state.user.user;
export const selectActiveEvent = (state: fromEvent.State) => state.events.event;

export const canEdit = createSelector(selectUser, selectActiveEvent, (selectedUser: AppPerson, ev: AppEvent) => {
  if (!selectedUser || !ev) {
    return false;
  }
  if (selectedUser.groups.includes('admin')) {
    return true;
  }
  if (ev.ownerId === selectedUser.id) {
    return true;
  }
  return false;
});

export const canReply = createSelector(selectUser, selectActiveEvent, (selectedUser: AppPerson, ev: AppEvent) => {
  if (!selectedUser || !ev) {
    return false;
  }
  return ev.participants.some((paricipant) => paricipant.id === selectedUser.id);
});
