import * as ArticleActions from './article.actions';

describe('Article', () => {
  it('should create an instance', () => {
    expect(new ArticleActions.LoadArticles()).toBeTruthy();
  });
});
