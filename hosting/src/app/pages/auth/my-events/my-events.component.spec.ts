import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MyEventsComponent } from "./my-events.component";
import { AuthServiceStub } from "src/app/testing";
import { EventDalStub } from "src/app/testing";
import { PersonDalStub } from "src/app/testing";
import { AuthService } from "src/app/services/auth.service";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";

xdescribe("MyEventsComponent", () => {
  let component: MyEventsComponent;
  let fixture: ComponentFixture<MyEventsComponent>;

  const authStub = new AuthServiceStub();
  const eventStub = new EventDalStub();
  const personStub = new PersonDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule, MatInputModule, MatButtonModule, MatProgressBarModule, MatTableModule],
      declarations: [MyEventsComponent],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: EventDALService, useValue: eventStub },
        { provide: PersonDalService, useValue: personStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
