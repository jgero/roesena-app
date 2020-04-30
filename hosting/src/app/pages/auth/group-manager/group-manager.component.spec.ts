import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupManagerComponent } from "./group-manager.component";
import { PersonDalStub, testingRoutes } from "src/app/testing";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterTestingModule } from "@angular/router/testing";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("GroupManagerComponent", () => {
  let component: GroupManagerComponent;
  let fixture: ComponentFixture<GroupManagerComponent>;

  const personStub = new PersonDalStub();
  const authStub = { $user: new BehaviorSubject(null) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatCheckboxModule,
        MatChipsModule,
        MatPaginatorModule,
        MatProgressBarModule,
        RouterTestingModule.withRoutes(testingRoutes),
        MatGridListModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
      ],
      declarations: [GroupManagerComponent],
      providers: [
        { provide: PersonDalService, useValue: personStub },
        { provide: AuthService, useValue: authStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
