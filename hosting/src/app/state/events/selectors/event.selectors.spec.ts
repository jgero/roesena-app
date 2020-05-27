import * as fromEvent from '../reducers/event.reducer';
import { selectEventState } from './event.selectors';

describe('Event Selectors', () => {
  it('should select the feature state', () => {
    const result = selectEventState({
      [fromEvent.eventFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
