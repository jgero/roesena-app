import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditorComponent } from "./editor.component";
import { EventDalStub, MarkdownPreviewStub, testingRoutes } from "src/app/testing";
import { ActivatedRouteStub } from "src/app/testing";
import { AuthServiceStub } from "src/app/testing";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { PersonDalStub } from "src/app/testing";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ConvertersModule } from "src/app/shared/converters/converters.module";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatChipsModule } from "@angular/material/chips";

describe("Events-EditorComponent", () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  const authStub = new AuthServiceStub();
  authStub.$user.next({ id: "asdf", isConfirmedMember: true, name: "John", groups: ["admins"] });
  const activatedRouteStub = {
    snapshot: {
      data: {
        event: {
          id: "",
          ownerId: "",
          ownerName: "",
          tags: [],
          description: "",
          deadline: null,
          startDate: new Date(),
          endDate: new Date(),
          title: "",
          participants: [],
        },
        persons: [],
      },
    },
  };
  new ActivatedRouteStub();
  const eventsStub = new EventDalStub();
  const personStub = new PersonDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(testingRoutes),
        ReactiveFormsModule,
        ConvertersModule,
        MatInputModule,
        MatButtonModule,
        MatExpansionModule,
        MatToolbarModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
      ],
      declarations: [EditorComponent, MarkdownPreviewStub],
      providers: [
        { provide: EventDALService, useValue: eventsStub },
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
