import { LayoutModule, BreakpointObserver } from "@angular/cdk/layout";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

import { RootComponent } from "./root.component";
import { Router } from "@angular/router";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BreakpointObserverStub } from "src/app/testing/stubs/breakpoint-observer";
import { MatSnackBarStub } from "src/app/testing/stubs/snackbar";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { EventDalServiceStub } from "src/app/testing/stubs/event-dal";

describe("RootComponent", () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const eventDALService = new EventDalServiceStub();
  const authService = new AuthServiceStub();
  const matSnackBar = new MatSnackBarStub();
  const breakpointObserver = new BreakpointObserverStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RootComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: EventDALService, useValue: eventDALService },
        { provide: AuthService, useValue: authService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: BreakpointObserver, useValue: breakpointObserver },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should compile", () => {
    expect(component).toBeTruthy();
  });
});
