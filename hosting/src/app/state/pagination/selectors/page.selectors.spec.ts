import * as fromPage from '../reducers/page.reducer';
import { selectPageState } from './page.selectors';

describe('Page Selectors', () => {
  it('should select the feature state', () => {
    const result = selectPageState({
      [fromPage.pageFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
