import { AuthServiceStub } from 'src/app/testing';
import { AuthService } from 'src/app/services/auth.service';
import { Details } from './details';

describe('Details components base', () => {
  let componentBase: A;

  const authServiceStub = new AuthServiceStub();

  class A extends Details {
    constructor() {
      super(authServiceStub as AuthService);
    }
  }

  beforeEach(() => {
    componentBase = new A();
  });

  it('should create', () => {
    expect(componentBase).toBeTruthy();
  });

  it('should restrict edit access correctly', () => {
    const mock = {
      id: 'asdf',
      content: 'asdf',
      ownerId: 'myUID',
      created: new Date(),
      ownerName: 'asdf',
      title: 'asdf',
      tags: ['asdf', 'test'],
    };
    authServiceStub.$user.next({ id: 'myUID', isConfirmedMember: true, name: 'John Doe', groups: [] });
    const owner = componentBase.canEdit(mock);
    authServiceStub.$user.next({ id: 'asdf', isConfirmedMember: true, name: 'John Doe', groups: ['admin'] });
    const admin = componentBase.canEdit(mock);
    authServiceStub.$user.next({ id: 'asdf', isConfirmedMember: true, name: 'John Doe', groups: [] });
    const pleb = componentBase.canEdit(mock);
    expect(owner && admin && !pleb).toBeTrue();
  });
});
