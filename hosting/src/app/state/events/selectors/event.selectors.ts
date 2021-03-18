import { createSelector } from '@ngrx/store';
import { State } from '@state/state.module';
import { AppPerson, AppEvent } from '@utils/interfaces';

export const selectUser = (state: State) => state.persons.user;
export const selectActiveEvent = (state: State) => state.events.activeEvent;

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

//export const forStartpage = (state: State) => {
//return state.events.activePageEvents.length > 0 ? state.events.activePageEvents[0] : null;
//};

export const unrespondedAmount = (state: State) => state.events.unrespondedEvents.length;
