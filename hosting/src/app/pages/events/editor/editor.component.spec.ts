import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditorComponent } from "./editor.component";
import { EventDalServiceStub } from "src/app/testing/stubs/event-dal";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { PersonDalStub } from "src/app/testing/stubs/person-dal";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";

xdescribe("EditorComponent", () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  const authStub = new AuthServiceStub();
  authStub.$user.next({ id: "asdf", isConfirmedMember: true, name: "John", groups: ["admins"] });
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const eventsStub = new EventDalServiceStub();
  const personStub = new PersonDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent],
      providers: [
        { provide: EventDALService, useValue: eventsStub },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: PersonDalService, useValue: personStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
