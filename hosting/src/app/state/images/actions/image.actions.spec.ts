import * as ImageActions from './image.actions';

describe('Image', () => {
  it('should create an instance', () => {
    expect(new ImageActions.LoadImages()).toBeTruthy();
  });
});
