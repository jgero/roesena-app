import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromArticle from '../reducers/article.reducer';

export const selectArticleState = createFeatureSelector<fromArticle.State>(
  fromArticle.articleFeatureKey
);
