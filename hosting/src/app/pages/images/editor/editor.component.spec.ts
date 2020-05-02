import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditorComponent } from "./editor.component";
import { ImageDalStub, testingRoutes } from "src/app/testing";
import { AuthServiceStub } from "src/app/testing";
import { ActivatedRouteStub } from "src/app/testing";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { ReactiveFormsModule } from "@angular/forms";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterTestingModule } from "@angular/router/testing";
import { MatChipsModule } from "@angular/material/chips";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("Images-EditorComponent", () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  const authStub = new AuthServiceStub();
  authStub.$user.next({ id: "asdf", isConfirmedMember: true, name: "John", groups: ["admins"] });
  const activatedRouteStub = {
    snapshot: {
      data: {
        url: "",
        image: {
          id: "",
          ownerId: "",
          ownerName: "",
          tags: [],
          created: new Date(),
        },
      },
    },
  };
  const imageStub = new ImageDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        RouterTestingModule.withRoutes(testingRoutes),
      ],
      declarations: [EditorComponent],
      providers: [
        { provide: ImageDalService, useValue: imageStub },
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
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
