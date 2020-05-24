import * as PersonActions from './person.actions';

describe('Person', () => {
  it('should create an instance', () => {
    expect(new PersonActions.LoadPersons()).toBeTruthy();
  });
});
