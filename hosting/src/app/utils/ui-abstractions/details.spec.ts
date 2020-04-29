import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { ActivatedRouteStub, ArticleDalStub, AuthServiceStub } from "src/app/testing";
import { AuthService } from "src/app/services/auth.service";
import { appElementDAL } from "../interfaces";
import { Details } from "./details";

describe("Details components base", () => {
  let componentBase: a;

  const activatedRouteStub = new ActivatedRouteStub({ id: "12341234" });
  const articleDalStub = new ArticleDalStub();
  const authServiceStub = new AuthServiceStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

  class a extends Details {
    constructor() {
      super(
        "articles",
        (activatedRouteStub as unknown) as ActivatedRoute,
        routerSpy as Router,
        articleDalStub as appElementDAL,
        authServiceStub as AuthService
      );
    }
  }

  beforeEach(() => {
    componentBase = new a();
  });

  it("should create", () => {
    expect(componentBase).toBeTruthy();
  });

  describe("navigation", () => {
    let sub: Subscription;

    beforeEach(() => {
      componentBase = new a();
    });

    afterEach(() => {
      if (sub) sub.unsubscribe();
    });

    it("should go to overview when no article is provided", (done) => {
      articleDalStub.data = null;
      componentBase.ngOnInit();
      sub = componentBase.$data.subscribe((next) => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(["articles", "overview"]);
        expect(next).toBeNull();
        done();
      });
    });

    it("should emit observable when article does exist", (done) => {
      const mock = {
        id: "asdf",
        content: "asdf",
        ownerId: "test",
        created: new Date(),
        ownerName: "asdf",
        title: "asdf",
        tags: ["asdf", "test"],
      };
      articleDalStub.data = mock;
      componentBase.ngOnInit();
      componentBase.$data.subscribe((next) => {
        expect(next).toEqual(mock);
        done();
      });
    });
  });

  it("should restrict edit access correctly", () => {
    const mock = {
      id: "asdf",
      content: "asdf",
      ownerId: "myUID",
      created: new Date(),
      ownerName: "asdf",
      title: "asdf",
      tags: ["asdf", "test"],
    };
    authServiceStub.$user.next({ id: "myUID", isConfirmedMember: true, name: "John Doe", groups: [] });
    componentBase.ngOnInit();
    const owner = componentBase.canEdit(mock);
    authServiceStub.$user.next({ id: "asdf", isConfirmedMember: true, name: "John Doe", groups: ["admin"] });
    const admin = componentBase.canEdit(mock);
    authServiceStub.$user.next({ id: "asdf", isConfirmedMember: true, name: "John Doe", groups: [] });
    const pleb = componentBase.canEdit(mock);
    expect(owner && admin && !pleb).toBeTrue();
  });
});
