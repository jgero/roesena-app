import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DetailsComponent } from "./details.component";
import { AuthServiceStub, testingRoutes } from "src/app/testing";
import { ActivatedRouteStub } from "src/app/testing";
import { ImageDalStub } from "src/app/testing";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterTestingModule } from "@angular/router/testing";
import { MatProgressBarModule } from "@angular/material/progress-bar";

describe("Images-DetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const authStub = new AuthServiceStub();
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const imageStub = new ImageDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule.withRoutes(testingRoutes),
        MatProgressBarModule,
      ],
      declarations: [DetailsComponent],
      providers: [
        { provide: ImageDalService, useValue: imageStub },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch download url", () => {
    const spy = spyOn(imageStub, "getDownloadURL");
    component.ngOnInit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
