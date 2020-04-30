import { Subscription } from "rxjs";

import { ArticleDalStub, AuthServiceStub, ActivatedRouteStub } from "src/app/testing";
import { AuthService } from "src/app/services/auth.service";
import { appElementDAL } from "../interfaces";
import { SearchableOverview } from "./searchable-overview";
import { ActivatedRoute } from "@angular/router";

describe("Overview search extension", () => {
  let componentBase: a;
  let sub: Subscription;

  const articleDalStub = new ArticleDalStub();
  const activatedRouteStub = new ActivatedRouteStub({ id: "12341234" });
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const authServiceStub = new AuthServiceStub();

  class a extends SearchableOverview {
    constructor() {
      super(
        ["articles", "overview"],
        articleDalStub as appElementDAL,
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

  describe("on search click", () => {
    beforeEach(() => {
      routerSpy.navigate.calls.reset();
    });

    it("should navigate to search route from input", () => {
      componentBase.searchString = "asdf";
      componentBase.onSearchClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(["articles", "overview", "asdf"]);
    });

    it("should reset search route on empty search string", () => {
      componentBase.searchString = "";
      componentBase.onSearchClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(["articles", "overview"]);
    });
  });

  it("should transform search string to tags", () => {
    componentBase.searchString = " my Group  , 2020 ";
    expect(componentBase.searchTags).toEqual(["my Group", "2020"]);
  });

  describe("on data request", () => {
    it("should get elements by tags if search string is present", () => {
      const spy = spyOn(articleDalStub, "getBySearchStrings");
      activatedRouteStub.setParamMap({ searchString: " my Group  , 2020 " });
      componentBase.ngOnInit();
      expect(spy).toHaveBeenCalledWith(["my Group", "2020"]);
    });

    it("should get all elements if search string is empty", () => {
      const spy = spyOn(articleDalStub, "getAll");
      activatedRouteStub.setParamMap({ searchString: "" });
      componentBase.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
