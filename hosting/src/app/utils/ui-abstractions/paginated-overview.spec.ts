import { ActivatedRoute } from "@angular/router";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";

import { ArticleDalStub, AuthServiceStub, ActivatedRouteStub } from "src/app/testing";
import { AuthService } from "src/app/services/auth.service";
import { PaginatedOverview } from "./paginated-overview";
import { paginatedDAL } from "../interfaces";
import { Direction } from "../enums";

describe("Overview pagination extension", () => {
  let componentBase: a;
  let sub: Subscription;

  const articleDalStub = new ArticleDalStub();
  const activatedRouteStub = new ActivatedRouteStub({ id: "12341234" });
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const authServiceStub = new AuthServiceStub();

  class a extends PaginatedOverview {
    constructor() {
      super(
        ["articles", "overview"],
        articleDalStub as paginatedDAL,
        (activatedRouteStub as unknown) as ActivatedRoute,
        routerSpy,
        authServiceStub as AuthService
      );
    }
  }

  beforeEach(() => {
    componentBase = new a();
  });

  afterEach(() => {
    if (sub) sub.unsubscribe();
  });

  it("should create", () => {
    expect(componentBase).toBeTruthy();
  });

  describe("init", () => {
    it("should init data length", (done) => {
      articleDalStub.length = 4;
      componentBase.ngOnInit();
      sub = componentBase.$dataLength.subscribe((next) => {
        expect(next).toBe(4);
        done();
      });
    });

    it("should init a page when there is no search string", () => {
      activatedRouteStub.setParamMap({ searchString: "" });
      const spy = spyOn(articleDalStub, "getPage");
      componentBase.ngOnInit();
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.allArgs()[0][1]).toBe(Direction.initial);
    });

    it("should init by tags when there is a search string", () => {
      activatedRouteStub.setParamMap({ searchString: " my Group  , 2020 " });
      const spy = spyOn(articleDalStub, "getBySearchStrings");
      componentBase.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("on page navigation click", () => {
    beforeEach(() => {
      componentBase.pageIndex = 2;
    });

    it("should correctly move forward", () => {
      const spy = spyOn(articleDalStub, "getPage");
      componentBase.onPage({ pageIndex: 3, previousPageIndex: 2 } as PageEvent);
      expect(componentBase.pageIndex).toBe(3);
      expect(spy.calls.allArgs()[0][1]).toBe(Direction.forward);
    });

    it("should correctly move back", () => {
      const spy = spyOn(articleDalStub, "getPage");
      componentBase.onPage({ pageIndex: 1, previousPageIndex: 2 } as PageEvent);
      expect(componentBase.pageIndex).toBe(1);
      expect(spy.calls.allArgs()[0][1]).toBe(Direction.back);
    });
  });
});
