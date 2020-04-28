import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ParamMap, Params, convertToParamMap, Router, ActivatedRoute } from "@angular/router";
import { ReplaySubject } from "rxjs";

import { DetailsComponent } from "./details.component";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { ArticleDalStub } from "src/app/testing/stubs/article-dal";

describe("DetailComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const activatedRouteStub = new ActivatedRouteStub({ id: "12341234" });
  const articleDalStub = new ArticleDalStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const authServiceSpy = jasmine.createSpyObj("AuthService", ["$user"]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ArticleDalService, useValue: articleDalStub },
        { provide: AuthService, useValue: authServiceSpy },
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
});
