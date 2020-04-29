import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GardenComponent } from "./garden.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MatTabsModule } from "@angular/material/tabs";

xdescribe("GardenComponent", () => {
  let component: GardenComponent;
  let fixture: ComponentFixture<GardenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatTabsModule],
      declarations: [GardenComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GardenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
