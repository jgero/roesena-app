import * as fromBase from '../reducers/base.reducer';
import { selectBaseState } from './base.selectors';

describe('Base Selectors', () => {
  it('should select the feature state', () => {
    const result = selectBaseState({
      [fromBase.baseFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
