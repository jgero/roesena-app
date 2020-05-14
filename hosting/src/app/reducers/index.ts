import * as fromArticleOverview from './article-overview.reducer';

export interface AppStore {
  articleOverviewState: fromArticleOverview.State;
}

export const reducers = {
  articleOverviewState: fromArticleOverview.reducer,
};
