import { ArticleDalStub, AuthServiceStub } from 'src/app/testing';
import { AuthService } from 'src/app/services/auth.service';
import { AppElementDAL } from '../interfaces';
import { SearchableOverview } from './searchable-overview';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('Overview search extension', () => {
  let componentBase: A;

  const articleDalStub = new ArticleDalStub();
  const activatedRouteStub = { snapshot: { paramMap: { get: (a: any) => null } }, paramMap: of({ get: (a: any) => null }) };
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const authServiceStub = new AuthServiceStub();

  class A extends SearchableOverview {
    constructor() {
      super(
        ['articles', 'overview'],
        articleDalStub as AppElementDAL,
        (activatedRouteStub as unknown) as ActivatedRoute,
        routerSpy,
        authServiceStub as AuthService
      );
    }
  }

  beforeEach(() => {
    componentBase = new A();
  });

  it('should create', () => {
    expect(componentBase).toBeTruthy();
  });

  describe('on search click', () => {
    beforeEach(() => {
      routerSpy.navigate.calls.reset();
    });

    it('should navigate to search route from input', () => {
      componentBase.searchString = 'asdf';
      componentBase.onSearchClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['articles', 'overview', 'asdf']);
    });

    it('should reset search route on empty search string', () => {
      componentBase.searchString = '';
      componentBase.onSearchClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['articles', 'overview']);
    });
  });

  it('should transform search string to tags', () => {
    componentBase.searchString = ' my Group  , 2020 ';
    expect(componentBase.searchTags).toEqual(['my Group', '2020']);
  });

  describe('on data request', () => {
    it('should get elements by tags if search string is present', () => {
      activatedRouteStub.snapshot.paramMap = { get: (a: any) => ' my Group  , 2020 ' };
      const spy = spyOn(articleDalStub, 'getBySearchStrings');
      componentBase.ngOnInit();
      const sub = componentBase.$searchTags.subscribe();
      expect(spy).toHaveBeenCalledWith(['my Group', '2020']);
      sub.unsubscribe();
    });

    it('should get all elements if search string is empty', () => {
      activatedRouteStub.snapshot.paramMap = { get: (a: any) => null };
      const spy = spyOn(articleDalStub, 'getAll');
      componentBase.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
