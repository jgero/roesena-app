import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResetComponent } from "./reset.component";
import { AuthServiceStub } from "src/app/testing";
import { ActivatedRouteStub } from "src/app/testing";
import { AuthService } from "src/app/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

xdescribe("ResetComponent", () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;

  const authStub = new AuthServiceStub();
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatToolbarModule, MatInputModule, MatButtonModule],
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
