import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OverviewComponent } from "./overview.component";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { ImageDalStub } from "src/app/testing/stubs/image-dal";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

describe("OverviewComponent", () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  const authStub = new AuthServiceStub();
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const imageStub = new ImageDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [OverviewComponent],
      providers: [
        { provide: ImageDalService, useValue: imageStub },
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
