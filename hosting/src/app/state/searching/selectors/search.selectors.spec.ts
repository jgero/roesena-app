import * as fromSearch from '../reducers/search.reducer';
import { selectSearchState } from './search.selectors';

describe('Search Selectors', () => {
  it('should select the feature state', () => {
    const result = selectSearchState({
      [fromSearch.searchFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
