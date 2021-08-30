import { createSelector } from '@ngrx/store';
import { AppPerson, AppArticle } from '@utils/interfaces';
import { State } from '@state/state.module';

export const selectUser = (state: State) => state.persons.user;
export const selectActiveArticle = (state: State) => state.articles.activeArticle;

export const canEdit = createSelector(selectUser, selectActiveArticle, (selectedUser: AppPerson, article: AppArticle) => {
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
