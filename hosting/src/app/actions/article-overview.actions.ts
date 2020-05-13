import { createAction, props } from '@ngrx/store';
import { AppArticle } from '../utils/interfaces';

export const updateSearchStrings = createAction(
  '[article-overview component] update search strings',
  props<{ searchStrings: string[] }>()
);

export const articlesLoaded = createAction('[Article DAL] articles loaded successfully', props<{ articles: AppArticle[] }>());

export const pageForward = createAction('[article-overview component] page forward');
export const pageBackwards = createAction('[article-overview component] page backwards');

export const search = createAction('[article-overview component] search');
