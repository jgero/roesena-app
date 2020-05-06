import { AuthServiceStub } from 'src/app/testing';
import { AuthService } from 'src/app/services/auth.service';
import { Card } from './card';

describe('Card components base', () => {
  let componentBase: A;

  const authServiceStub = new AuthServiceStub();

  class A extends Card {
    constructor() {
      super(authServiceStub as AuthService);
    }
  }

  beforeEach(() => {
    componentBase = new A();
    componentBase.data = {
      id: 'asdf',
      ownerName: 'JO',
      tags: [],
      ownerId: 'creativeUID',
    };
  });

  it('should create', () => {
    expect(componentBase).toBeTruthy();
  });

  it('should restrict edit access correctly', () => {
    authServiceStub.$user.next({ id: 'creativeUID', isConfirmedMember: true, name: 'John Doe', groups: ['Autor'] });
    const owner = componentBase.canEdit();
    authServiceStub.$user.next({ id: 'asdf', isConfirmedMember: true, name: 'John Doe', groups: ['admin'] });
    const admin = componentBase.canEdit();
    authServiceStub.$user.next({ id: 'asdf', isConfirmedMember: true, name: 'John Doe', groups: [] });
    const pleb = componentBase.canEdit();
    expect(owner && admin && !pleb).toBeTrue();
  });
});
