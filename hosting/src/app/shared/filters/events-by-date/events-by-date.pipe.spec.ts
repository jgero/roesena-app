import { EventsByDatePipe } from './events-by-date.pipe';

describe('EventsByDatePipe', () => {
  it('create an instance', () => {
    const pipe = new EventsByDatePipe();
    expect(pipe).toBeTruthy();
  });
});
