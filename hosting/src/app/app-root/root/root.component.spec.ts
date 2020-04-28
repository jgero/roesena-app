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
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterTestingModule } from "@angular/router/testing";

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
        MatExpansionModule,
        RouterTestingModule,
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

  it("should not do anything without user", () => {
    const spy = spyOn(matSnackBar, "open");
    component.ngOnInit();
    authService.$user.next(null);
    expect(spy).not.toHaveBeenCalled();
  });

  it("should not show anything when user has no unresponded events", () => {
    const spy = spyOn(matSnackBar, "open");
    component.ngOnInit();
    eventDALService.dataArray = [
      {
        id: "asdf",
        tags: ["asdf"],
        description: "asdf",
        ownerName: "John DOe",
        ownerId: "test",
        title: "event title",
        startDate: new Date(2020, 10, 2),
        endDate: new Date(2020, 10, 3),
        deadline: new Date(2020, 10, 1),
        participants: [{ id: "creativeUID", name: "John Doe", amount: 3 }],
      },
    ];
    authService.$user.next({ id: "creativeUID", groups: ["nothing special"], isConfirmedMember: true, name: "John Doe" });
    expect(spy).not.toHaveBeenCalled();
  });

  it("should show snackbar when user has unresponded events", () => {
    const spy = spyOn(matSnackBar, "open");
    component.ngOnInit();
    eventDALService.dataArray = [
      {
        id: "asdf",
        tags: ["asdf"],
        description: "asdf",
        ownerName: "John DOe",
        ownerId: "test",
        title: "event title",
        startDate: new Date(2020, 10, 2),
        endDate: new Date(2020, 10, 3),
        deadline: new Date(2020, 10, 1),
        participants: [{ id: "creativeUID", name: "John Doe", amount: -1 }],
      },
    ];
    authService.$user.next({ id: "creativeUID", groups: ["nothing special"], isConfirmedMember: true, name: "John Doe" });
    expect(spy).toHaveBeenCalled();
  });
});
