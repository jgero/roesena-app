import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromImage from '../reducers/image.reducer';
import { AppPerson, AppImage } from '@utils/interfaces';

export const selectImageState = createFeatureSelector<fromImage.State>(fromImage.imageFeatureKey);

export const selectUser = (state: fromImage.State) => state.user.user;
export const selectActiveArticle = (state: fromImage.State) => state.image.activeImage;

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
