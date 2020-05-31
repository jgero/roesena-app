import * as fromContent from '../reducers/content.reducer';
import { selectContentState } from './content.selectors';

describe('Content Selectors', () => {
  it('should select the feature state', () => {
    const result = selectContentState({
      [fromContent.contentFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
