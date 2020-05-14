import { createAction, props } from '@ngrx/store';

import { AppArticle } from '../utils/interfaces';

export const articlesLoaded = createAction('[Article DAL] articles loaded successfully', props<{ articles: AppArticle[] }>());
export const articlesLoadingError = createAction('[Article DAL] articles could not be loaded', props<{ error: Error }>());
