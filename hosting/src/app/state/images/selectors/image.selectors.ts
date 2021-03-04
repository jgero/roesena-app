import { createSelector } from '@ngrx/store';
import { AppPerson, AppImage } from '@utils/interfaces';
import { State } from '@state/state.module';

export const selectUser = (state: State) => state.persons.user;
export const selectActiveArticle = (state: State) => state.images.activeImage;

export const canEdit = createSelector(selectUser, selectActiveArticle, (selectedUser: AppPerson, image: AppImage) => {
  if (!selectedUser || !image) {
    return false;
  }
  if (selectedUser.groups.includes('admin')) {
    return true;
  }
  if (image.ownerId === selectedUser.id) {
    return true;
  }
  return false;
});
