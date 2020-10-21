import * as fromContact from '../reducers/contact.reducer';
import { selectContactState } from './contact.selectors';

describe('Contact Selectors', () => {
  it('should select the feature state', () => {
    const result = selectContactState({
      [fromContact.contactFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
