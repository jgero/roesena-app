import * as EventActions from './event.actions';

describe('Event', () => {
  it('should create an instance', () => {
    expect(new EventActions.LoadEvents()).toBeTruthy();
  });
});
