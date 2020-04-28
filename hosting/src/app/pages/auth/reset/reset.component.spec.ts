import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResetComponent } from "./reset.component";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { AuthService } from "src/app/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";

describe("ResetComponent", () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;

  const authStub = new AuthServiceStub();
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetComponent],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
