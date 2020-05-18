import * as SearchActions from './search.actions';

describe('Search', () => {
  it('should create an instance', () => {
    expect(new SearchActions.LoadSearchs()).toBeTruthy();
  });
});
