import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEvent from '../reducers/event.reducer';
import { AppPerson, AppEvent } from '@utils/interfaces';

export const selectEventState = createFeatureSelector<fromEvent.State>(fromEvent.eventFeatureKey);

export const selectUser = (state: fromEvent.State) => state.user.user;
export const selectActiveArticle = (state: fromEvent.State) => state.events.event;

export const canEdit = createSelector(selectUser, selectActiveArticle, (selectedUser: AppPerson, article: AppEvent) => {
  if (!selectedUser || !article) {
    return false;
  }
  if (selectedUser.groups.includes('admin')) {
    return true;
  }
  if (article.ownerId === selectedUser.id) {
    return true;
  }
  return false;
});
