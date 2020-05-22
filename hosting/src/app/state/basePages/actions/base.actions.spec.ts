import * as BaseActions from './base.actions';

describe('Base', () => {
  it('should create an instance', () => {
    expect(new BaseActions.LoadBases()).toBeTruthy();
  });
});
