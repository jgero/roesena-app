import { BreakpointObserver } from "@angular/cdk/layout";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

import { RootComponent } from "./root.component";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BreakpointObserverStub, testingRoutes } from "src/app/testing";
import { AuthServiceStub } from "src/app/testing";
import { EventDalStub } from "src/app/testing";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterTestingModule } from "@angular/router/testing";
import { EmptyComponent } from "src/app/testing";
import { MatBadgeModule } from "@angular/material/badge";
import { Observable, Subscription, of } from "rxjs";
import { SwUpdate } from "@angular/service-worker";

describe("RootComponent", () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;
  let sub: Subscription;

  const eventDALService = new EventDalStub();
  const authService = new AuthServiceStub();
  const matSnackBar = jasmine.createSpyObj("MatSnackBar", {
    open: { onAction: () => new Observable<void>((obs) => obs.complete()) },
  });
  const breakpointObserver = new BreakpointObserverStub();
  const swUpdateStub = { isEnabled: true, available: of(true) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RootComponent],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatExpansionModule,
        MatBadgeModule,
        RouterTestingModule.withRoutes(testingRoutes),
      ],
      providers: [
        { provide: EventDALService, useValue: eventDALService },
        { provide: AuthService, useValue: authService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: BreakpointObserver, useValue: breakpointObserver },
        { provide: SwUpdate, useValue: swUpdateStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matSnackBar.open.calls.reset();
  });

  afterEach(() => {
    matSnackBar.open.calls.reset();
  });

  it("should compile", () => {
    expect(component).toBeTruthy();
  });

  describe("snackbar", () => {
    beforeEach(() => {
      matSnackBar.open.calls.reset();
    });
    afterEach(() => {
      if (sub) sub.unsubscribe();
      matSnackBar.open.calls.reset();
      fixture.destroy();
    });

    // it("should not show without user", () => {
    //   authService.$user.next(null);
    //   eventDALService.dataArray = [
    //     {
    //       id: "asdf",
    //       tags: ["asdf"],
    //       description: "asdf",
    //       ownerName: "John DOe",
    //       ownerId: "test",
    //       title: "event title",
    //       startDate: new Date(2020, 10, 2),
    //       endDate: new Date(2020, 10, 3),
    //       deadline: new Date(2020, 10, 1),
    //       participants: [{ id: "creativeUID", name: "John Doe", amount: -1 }],
    //     },
    //   ];
    //   component.ngOnInit();
    //   fixture.detectChanges();
    //   authService.$user.next(null);
    //   expect(matSnackBar.open.calls.count()).toBe(0);
    // });

    // it("should not show when user has no unresponded events", (done) => {
    //   eventDALService.dataArray = [
    //     {
    //       id: "asdf",
    //       tags: ["asdf"],
    //       description: "asdf",
    //       ownerName: "John DOe",
    //       ownerId: "test",
    //       title: "event title",
    //       startDate: new Date(2020, 10, 2),
    //       endDate: new Date(2020, 10, 3),
    //       deadline: new Date(2020, 10, 1),
    //       participants: [{ id: "creativeUID", name: "John Doe", amount: 3 }],
    //     },
    //   ];
    //   component.ngOnInit();
    //   fixture.detectChanges();
    //   sub = component.$badgeContentStream.subscribe((val) => {
    //     expect(matSnackBar.open).not.toHaveBeenCalled();
    //     done();
    //   });
    //   authService.$user.next({ id: "creativeUID", groups: ["nothing special"], isConfirmedMember: true, name: "John Doe" });
    // });

    it("should show when user has unresponded events", (done) => {
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
      component.ngOnInit();
      fixture.detectChanges();
      sub = component.$badgeContentStream.subscribe((val) => {
        expect(matSnackBar.open).toHaveBeenCalled();
        done();
      });
      authService.$user.next({ id: "creativeUID", groups: ["nothing special"], isConfirmedMember: true, name: "John Doe" });
    });
  });
});
