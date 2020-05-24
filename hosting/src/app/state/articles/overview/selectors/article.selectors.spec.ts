import * as fromArticle from '../reducers/article.reducer';
import { selectArticleState } from './article.selectors';

describe('Article Selectors', () => {
  it('should select the feature state', () => {
    const result = selectArticleState({
      [fromArticle.articleFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
