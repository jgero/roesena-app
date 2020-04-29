import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ParamMap, Params, convertToParamMap, Router, ActivatedRoute } from "@angular/router";
import { ReplaySubject } from "rxjs";

import { DetailsComponent } from "./details.component";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { ArticleDalStub } from "src/app/testing/stubs/article-dal";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ConvertersModule } from "src/app/shared/converters/converters.module";
import { Component } from "@angular/core";
import { AuthServiceStub } from "src/app/testing/stubs/auth";

xdescribe("DetailComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const activatedRouteStub = new ActivatedRouteStub({ id: "12341234" });
  const articleDalStub = new ArticleDalStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const authServiceStub = new AuthServiceStub();

  @Component({ selector: "app-markdown-viewer", template: "" })
  class MarkdownViewerComponentStub {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule, MatChipsModule, MatProgressBarModule, MatButtonModule, MatIconModule, ConvertersModule],
      declarations: [DetailsComponent, MarkdownViewerComponentStub],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ArticleDalService, useValue: articleDalStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    activatedRouteStub.setParamMap({ id: "12341234" });
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to startpage when no article is provided", () => {
    component.ngOnInit();
    expect(routerSpy.navigate.calls.count()).toBe(1);
  });

  it("should emit observable when article does exist", () => {
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
    component.ngOnInit();
    component.$article.subscribe((next) => {
      expect(next).toEqual(mock);
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
    component.ngOnInit();
    const owner = component.canEdit(mock);
    authServiceStub.$user.next({ id: "asdf", isConfirmedMember: true, name: "John Doe", groups: ["admin"] });
    const admin = component.canEdit(mock);
    authServiceStub.$user.next({ id: "asdf", isConfirmedMember: true, name: "John Doe", groups: [] });
    const pleb = component.canEdit(mock);
    expect(owner && admin && !pleb).toBeTrue();
  });
});
