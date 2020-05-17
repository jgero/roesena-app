import { createAction, props } from '@ngrx/store';

import { AppArticle, StoreableArticle } from '../utils/interfaces';
import { QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';

export const articlesLoaded = createAction(
  '[article endpoint] articles loaded successfully',
  props<{
    articles: AppArticle[];
    pageFirst: AppArticle;
    pageLast: AppArticle;
  }>()
);
export const lengthLoaded = createAction('[article endpoint] data length loaded', props<{ dataLength: number }>());
export const articlesLoadingError = createAction('[article endpoint] articles could not be loaded', props<{ error: Error }>());
