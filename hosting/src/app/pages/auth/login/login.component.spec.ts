import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { LocationStub } from "src/app/testing/stubs/location";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

xdescribe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authStub = new AuthServiceStub();
  const locationStub = new LocationStub(2);
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatToolbarModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
