import * as ContentActions from './content.actions';

describe('Content', () => {
  it('should create an instance', () => {
    expect(new ContentActions.LoadContents()).toBeTruthy();
  });
});
