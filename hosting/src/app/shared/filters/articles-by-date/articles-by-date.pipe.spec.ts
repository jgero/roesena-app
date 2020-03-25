import { ArticlesByDatePipe } from './articles-by-date.pipe';

describe('ArticlesByDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ArticlesByDatePipe();
    expect(pipe).toBeTruthy();
  });
});
