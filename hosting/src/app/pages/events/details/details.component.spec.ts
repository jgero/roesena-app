import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";

import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatChipsModule } from "@angular/material/chips";
import { MatListModule } from "@angular/material/list";

import { DetailsComponent } from "./details.component";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { AuthService } from "src/app/services/auth.service";

import { AuthServiceStub, MarkdownViewerStub, ActivatedRouteStub, EventDalStub } from "src/app/testing";

describe("Event-DetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const authStub = new AuthServiceStub();
  const activatedRouteStub = new ActivatedRouteStub({ id: "test" });
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const eventsStub = new EventDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatProgressBarModule, MatToolbarModule, MatChipsModule, MatListModule],
      declarations: [DetailsComponent, MarkdownViewerStub],
      providers: [
        { provide: EventDALService, useValue: eventsStub },
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

  describe("on participant click", () => {
    beforeEach(() => {
      routerSpy.navigate.calls.reset();
    });

    it("should navigate to responding page on click on own name", () => {
      authStub.$user.next({ id: "asdfID", groups: [], isConfirmedMember: true, name: "John" });
      component.onParticipantClick("asdfID");
      expect(routerSpy.navigate).toHaveBeenCalledWith(["auth", "my-events"]);
    });

    it("should not navigate on click on other name", () => {
      authStub.$user.next({ id: "asdfID", groups: [], isConfirmedMember: true, name: "John" });
      component.onParticipantClick("test");
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe("stats calculation", () => {
    const ev = {
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

    it("should accumulate the amount of accepted persons", () => {
      expect(component.getAmountAccumulated(ev)).toEqual(2);
    });

    it("should calculate the amount of persons which have not responded yet", () => {
      expect(component.getPendingAmount(ev)).toEqual(1);
    });

    it("should calculate the percentage of persons which have not responded yet", () => {
      expect(component.getPendingPercent(ev)).toEqual(33);
    });
  });
});
