import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromArticle from '../reducers/article.reducer';
import { AppPerson, AppArticle } from '@utils/interfaces';

export const selectArticleState = createFeatureSelector<fromArticle.State>(fromArticle.articleFeatureKey);

export const selectUser = (state: fromArticle.State) => state.user.user;
export const selectActiveArticle = (state: fromArticle.State) => state.article.article;

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
