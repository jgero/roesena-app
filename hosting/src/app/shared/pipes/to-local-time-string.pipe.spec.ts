import { ToLocalTimeStringPipe } from './to-local-time-string.pipe';

describe('ToLocalTimeStringPipe', () => {
  it('create an instance', () => {
    const pipe = new ToLocalTimeStringPipe();
    expect(pipe).toBeTruthy();
  });
});
