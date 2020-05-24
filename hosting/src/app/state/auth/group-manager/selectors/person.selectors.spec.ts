import * as fromPerson from '../reducers/person.reducer';
import { selectPersonState } from './person.selectors';

describe('Person Selectors', () => {
  it('should select the feature state', () => {
    const result = selectPersonState({
      [fromPerson.personFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
