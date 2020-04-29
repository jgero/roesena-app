import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EventCardComponent } from "./event-card.component";
import { AuthService } from "src/app/services/auth.service";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { ConvertersModule } from "../../converters/converters.module";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterTestingModule } from "@angular/router/testing";

xdescribe("EventCardComponent", () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  const authStub = new AuthServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventCardComponent],
      providers: [{ provide: AuthService, useValue: authStub }],
      imports: [ConvertersModule, MatCardModule, MatChipsModule, MatButtonModule, MatIconModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    component.event = {
      id: "asdf",
      title: "test",
      description: "asdf",
      ownerId: "asdf",
      ownerName: "Max",
      startDate: new Date(2020, 10, 1),
      endDate: new Date(2020, 10, 3),
      participants: [],
      deadline: null,
      tags: ["test"],
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
