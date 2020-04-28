import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OverviewComponent } from "./overview.component";
import { EventDalServiceStub } from "src/app/testing/stubs/event-dal";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

describe("OverviewComponent", () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  const authStub = new AuthServiceStub();
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const eventStub = new EventDalServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [OverviewComponent],
      providers: [
        { provide: EventDALService, useValue: eventStub },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
