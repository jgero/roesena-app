import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { of, BehaviorSubject } from "rxjs";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { LoginComponent } from "./login.component";
import { AuthService } from "src/app/services/auth.service";
import { appPerson } from "src/app/utils/interfaces";
import { ConvertersModule } from "src/app/shared/converters/converters.module";
import { testingRoutes } from "src/app/testing";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authStub = { login: (a: string, b: string) => of(null), $user: new BehaviorSubject<appPerson>(null) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes(testingRoutes),
        ReactiveFormsModule,
        ConvertersModule,
      ],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call dal on submit", () => {
    const spy = spyOn(authStub, "login").and.returnValue(of(null));
    component.loginForm.get("email").setValue("asdf@testmail.de");
    component.loginForm.get("password").setValue("123456");
    component.onSubmit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith("asdf@testmail.de", "123456");
  });

  describe("on successful login", () => {
    let router: Router;
    let location: Location;

    beforeEach(() => {
      router = TestBed.get(Router);
      location = TestBed.get(Location);
      location.replaceState("/reset", "", { navigationId: 1 });
      component.ngOnInit();
      fixture.detectChanges();
    });

    it("should go to startpage when needed", () => {
      const spy = spyOn(router, "navigate");
      location.replaceState("/test", "", { navigationId: 1 });
      authStub.$user.next({ id: "asdf", name: "asdf", isConfirmedMember: true, groups: [] });
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith([""]);
    });

    it("should go location back when possible", () => {
      const spy = spyOn(location, "back");
      location.replaceState("/asdf", "", { navigationId: 3 });
      authStub.$user.next({ id: "asdf", name: "asdf", isConfirmedMember: true, groups: [] });
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
});
