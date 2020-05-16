import * as fromArticleOverview from './article-overview.reducer';
import * as fromAuth from './auth.reducer';
import * as fromSearch from './search.reducer';

export interface AppStore {
  articleOverviewState: fromArticleOverview.State;
  authState: fromAuth.State;
  router: any;
  search: fromSearch.State;
}

export const reducers = {
  articleOverviewState: fromArticleOverview.reducer,
  authState: fromAuth.reducer,
  search: fromSearch.reducer,
};
