import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterTestingModule } from "@angular/router/testing";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { DetailsComponent } from "./details.component";
import { AuthServiceStub, testingRoutes } from "src/app/testing";
import { ActivatedRouteStub } from "src/app/testing";
import { AuthService } from "src/app/services/auth.service";

describe("Images-DetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const authStub = new AuthServiceStub();
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule.withRoutes(testingRoutes),
        MatProgressBarModule,
      ],
      declarations: [DetailsComponent],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
