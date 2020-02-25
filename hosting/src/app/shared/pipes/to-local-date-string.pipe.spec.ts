import { ToLocalDateStringPipe } from './to-local-date-string.pipe';

describe('ToLocalDateStringPipe', () => {
  it('create an instance', () => {
    const pipe = new ToLocalDateStringPipe();
    expect(pipe).toBeTruthy();
  });
});
