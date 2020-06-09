import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from '../reducers/user.reducer';
import { AppPerson } from '@utils/interfaces';
import { State } from '@state/state.module';

export const selectUserState = createFeatureSelector<fromUser.State>(fromUser.userFeatureKey);

export const selectUser = (state: State) => state.user.user;

export const canCreate = createSelector(selectUser, (selectedUser: AppPerson) => {
  if (!selectedUser) {
    return false;
  }
  if (selectedUser.groups.includes('admin') || selectedUser.groups.includes('Autor')) {
    return true;
  }
  return false;
});
