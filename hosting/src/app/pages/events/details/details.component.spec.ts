import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatChipsModule } from "@angular/material/chips";
import { MatListModule } from "@angular/material/list";

import { DetailsComponent } from "./details.component";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { AuthService } from "src/app/services/auth.service";

import { MarkdownViewerStub, EventDalStub, testingRoutes } from "src/app/testing";
import { ConvertersModule } from "src/app/shared/converters/converters.module";
import { RouterTestingModule } from "@angular/router/testing";
import { MatIconModule } from "@angular/material/icon";
import { BehaviorSubject } from "rxjs";

describe("Event-DetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let router: Router;

  const authStub = { $user: new BehaviorSubject({ id: "asdfID", groups: [], isConfirmedMember: true, name: "John" }) };
  const activatedRouteStub = {
    snapshot: {
      data: {
        event: {
          id: "",
          ownerId: "",
          ownerName: "",
          tags: [],
          description: "",
          deadline: null,
          startDate: new Date(),
          endDate: new Date(),
          title: "",
          participants: [],
        },
      },
    },
  };
  const eventsStub = new EventDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatChipsModule,
        MatListModule,
        ConvertersModule,
        MatIconModule,
        RouterTestingModule.withRoutes(testingRoutes),
      ],
      declarations: [DetailsComponent, MarkdownViewerStub],
      providers: [
        { provide: EventDALService, useValue: eventsStub },
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("on participant click", () => {
    it("should navigate to responding page on click on own name", () => {
      const spy = spyOn(router, "navigate");
      component.onParticipantClick("asdfID");
      expect(spy).toHaveBeenCalledWith(["auth", "my-events"]);
    });

    it("should not navigate on click on other name", () => {
      const spy = spyOn(router, "navigate");
      component.onParticipantClick("test");
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("stats calculation", () => {
    beforeEach(() => {
      component.event = {
        id: "asdf",
        title: "asdf",
        description: "asdf",
        tags: [],
        startDate: new Date(),
        endDate: new Date(),
        ownerId: "asdf",
        ownerName: "john",
        deadline: new Date(),
        participants: [
          { id: "asdfTest", name: "john", amount: -1 },
          { id: "asdfTest", name: "john", amount: 2 },
          { id: "asdfTest", name: "john", amount: 0 },
        ],
      };
    });

    it("should accumulate the amount of accepted persons", () => {
      expect(component.amountAccumulated).toEqual(2);
    });

    it("should calculate the amount of persons which have not responded yet", () => {
      expect(component.pendingAmount).toEqual(1);
    });

    it("should calculate the percentage of persons which have not responded yet", () => {
      expect(component.pendingPercent).toEqual(33);
    });
  });
});
