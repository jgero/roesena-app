import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalendarComponent } from "./calendar.component";
import { ActivatedRouteStub, DayStub, testingRoutes } from "src/app/testing";
import { EventDalStub } from "src/app/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatGridListModule } from "@angular/material/grid-list";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";

describe("CalendarComponent", () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  const routeStub = {
    paramMap: of(convertToParamMap({ date: new Date().toISOString() })),
  };
  const eventStub = new EventDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatGridListModule,
        RouterTestingModule.withRoutes(testingRoutes),
      ],
      declarations: [CalendarComponent, DayStub],
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

  it("should create titles for every month", () => {
    for (let i = 0; i < 12; i++) {
      expect(component.getTitle(new Date(2019, i, 1))).toBeTruthy();
    }
  });
});
