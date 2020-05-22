import * as fromCard from '../reducers/card.reducer';
import { selectCardState } from './card.selectors';

describe('Card Selectors', () => {
  it('should select the feature state', () => {
    const result = selectCardState({
      [fromCard.cardFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
