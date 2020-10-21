import * as ContactActions from './contact.actions';

describe('Contact', () => {
  it('should create an instance', () => {
    expect(new ContactActions.LoadContacts()).toBeTruthy();
  });
});
