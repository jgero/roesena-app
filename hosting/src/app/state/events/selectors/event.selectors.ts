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

export const forStartpage = (state: State) => {
  return state.events.upcomingEvents.length > 0 ? state.events.upcomingEvents[0] : null;
};

export const unrespondedAmount = (state: State) => {
    const unresponded = state.events.respondableEvents.filter((ev) => {
        if (ev.participants.find((participant) => participant.id === state.persons.user.id && participant.amount >= 0)) {
          // if user is participant and has already responded the event does not count
          return false;
        }
    });
    return unresponded.length;
};
