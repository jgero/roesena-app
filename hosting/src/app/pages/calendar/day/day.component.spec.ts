import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DayComponent } from "./day.component";
import { ElementRef } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterTestingModule } from "@angular/router/testing";
import { MatBadgeModule } from "@angular/material/badge";
import { testingRoutes } from "src/app/testing";

export class MockElementRef extends ElementRef {
  constructor() {
    super(null);
  }
}

describe("DayComponent", () => {
  let component: DayComponent;
  let fixture: ComponentFixture<DayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule.withRoutes(testingRoutes),
        MatBadgeModule,
      ],
      declarations: [DayComponent],
      providers: [{ provide: ElementRef, useValue: MockElementRef }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayComponent);
    component = fixture.componentInstance;
    component.day = 1;
    component.events = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("popup toggle", () => {
    it("should open on day card click", () => {
      component.isPopupVisible = false;
      component.onCardClick();
      expect(component.isPopupVisible).toBe(true);
      component.onCardClick();
      expect(component.isPopupVisible).toBe(true);
    });

    it("should close on button click", () => {
      component.isPopupVisible = true;
      component.onClose(new MouseEvent("click"));
      expect(component.isPopupVisible).toBe(false);
      component.onClose(new MouseEvent("click"));
      expect(component.isPopupVisible).toBe(false);
    });
  });
});
