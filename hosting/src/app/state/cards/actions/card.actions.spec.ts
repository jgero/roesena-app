import * as CardActions from './card.actions';

describe('Card', () => {
  it('should create an instance', () => {
    expect(new CardActions.LoadCards()).toBeTruthy();
  });
});
