import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NotFoundComponent } from "./not-found.component";
import { Location } from "@angular/common";
import { LocationStub } from "src/app/testing";
import { Router } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { RouterTestingModule } from "@angular/router/testing";

describe("NotFoundComponent", () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  const locationStub = new LocationStub(2);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule, MatButtonModule, RouterTestingModule],
      declarations: [NotFoundComponent],
      providers: [{ provide: Location, useValue: locationStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should go to startpage when needed", () => {
    const router = TestBed.get(Router);
    const spy = spyOn(router, "navigate");
    locationStub.navigationId = 1;
    component.goBack();
    expect(spy).toHaveBeenCalled();
  });

  it("should go location back when possible", () => {
    locationStub.navigationId = 3;
    const spy = spyOn(locationStub, "back");
    component.goBack();
    expect(spy).toHaveBeenCalled();
  });
});
