import { createAction, props } from '@ngrx/store';

export const addString = createAction('[search component] add search string', props<{ searchString: string }>());
export const removeString = createAction('[search component] remove search string', props<{ searchString: string }>());
export const search = createAction('[search component] run search');
