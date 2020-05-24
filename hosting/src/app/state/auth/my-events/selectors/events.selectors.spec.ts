import * as fromEvents from '../reducers/events.reducer';
import { selectEventsState } from './events.selectors';

describe('Events Selectors', () => {
  it('should select the feature state', () => {
    const result = selectEventsState({
      [fromEvents.eventsFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
