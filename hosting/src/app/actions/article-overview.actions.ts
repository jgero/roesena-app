import { createAction, props } from '@ngrx/store';

export const updateSearchStrings = createAction(
  '[article-overview component] update search strings',
  props<{ searchStrings: string[] }>()
);
export const pageForward = createAction('[article-overview component] page forward');
export const pageBackwards = createAction('[article-overview component] page backwards');
export const search = createAction('[article-overview component] search');
