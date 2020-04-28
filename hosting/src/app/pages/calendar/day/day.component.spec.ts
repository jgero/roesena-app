import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DayComponent } from "./day.component";
import { ElementRef } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

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
      imports: [NoopAnimationsModule],
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
});
