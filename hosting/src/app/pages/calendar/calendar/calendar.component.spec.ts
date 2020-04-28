import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalendarComponent } from "./calendar.component";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { EventDalServiceStub } from "src/app/testing/stubs/event-dal";
import { ActivatedRoute } from "@angular/router";
import { EventDALService } from "src/app/services/DAL/event-dal.service";

describe("CalendarComponent", () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  const routeStub = new ActivatedRouteStub();
  const eventStub = new EventDalServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: EventDALService, useValue: eventStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
