import { Subscription } from 'rxjs';

import { ArticleDalStub, AuthServiceStub } from 'src/app/testing';
import { AuthService } from 'src/app/services/auth.service';
import { AppElementDAL } from '../interfaces';
import { Overview } from './overview';

describe('Overview components base', () => {
  let componentBase: A;
  let sub: Subscription;

  const articleDalStub = new ArticleDalStub();
  const authServiceStub = new AuthServiceStub();

  class A extends Overview {
    constructor() {
      super(articleDalStub as AppElementDAL, authServiceStub as AuthService);
    }
  }

  beforeEach(() => {
    componentBase = new A();
  });

  afterEach(() => {
    if (sub) {
      sub.unsubscribe();
    }
  });

  it('should create', () => {
    expect(componentBase).toBeTruthy();
  });

  it('should restrict create access correctly', () => {
    authServiceStub.$user.next({ id: 'myUID', isConfirmedMember: true, name: 'John Doe', groups: ['Autor'] });
    const author = componentBase.canCreate();
    authServiceStub.$user.next({ id: 'asdf', isConfirmedMember: true, name: 'John Doe', groups: ['admin'] });
    const admin = componentBase.canCreate();
    authServiceStub.$user.next({ id: 'asdf', isConfirmedMember: true, name: 'John Doe', groups: [] });
    const pleb = componentBase.canCreate();
    expect(author && admin && !pleb).toBeTrue();
  });

  it('should init data', (done) => {
    articleDalStub.dataArray = [];
    componentBase.ngOnInit();
    sub = componentBase.$data.subscribe((next) => {
      expect(next).toEqual([]);
      done();
    });
  });
});
