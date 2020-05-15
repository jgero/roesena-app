import * as fromArticleOverview from './article-overview.reducer';
import * as fromAuth from './auth.reducer';

export interface AppStore {
  articleOverviewState: fromArticleOverview.State;
  authState: fromAuth.State;
}

export const reducers = {
  articleOverviewState: fromArticleOverview.reducer,
  authState: fromAuth.reducer,
};
