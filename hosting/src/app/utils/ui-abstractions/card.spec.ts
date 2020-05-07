import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { Card } from './card';

describe('Card components base', () => {
  let componentBase: A;

  const authServiceStub = { $user: new BehaviorSubject(null) };
  const routerStub = { navigate: (a: any) => {} };

  class A extends Card {
    constructor() {
      super(authServiceStub as AuthService, routerStub as Router, 'article');
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

  describe('on tag click', () => {
    it('should navigate if flag is not set', () => {
      const spy = spyOn(routerStub, 'navigate');
      componentBase.onTagClick('asdf');
      expect(spy).toHaveBeenCalledWith(['article', 'overview', 'asdf']);
    });

    it('should not navigate if flag is set', () => {
      const spy = spyOn(routerStub, 'navigate');
      componentBase.navigateOnTagClick = false;
      componentBase.onTagClick('asdf');
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
