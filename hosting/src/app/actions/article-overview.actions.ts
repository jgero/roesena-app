import { createAction } from '@ngrx/store';

export const init = createAction('[article-overview component] init page');
export const pageForward = createAction('[article-overview component] page forward');
export const pageBackwards = createAction('[article-overview component] page backwards');
