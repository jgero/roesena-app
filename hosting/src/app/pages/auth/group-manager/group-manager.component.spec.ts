import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupManagerComponent } from "./group-manager.component";
import { PersonDalStub, testingRoutes } from "src/app/testing";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule, MatChipInputEvent } from "@angular/material/chips";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterTestingModule } from "@angular/router/testing";
import { BehaviorSubject, Subscription, of } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { appPerson } from "src/app/utils/interfaces";

describe("GroupManagerComponent", () => {
  let component: GroupManagerComponent;
  let fixture: ComponentFixture<GroupManagerComponent>;
  let sub: Subscription;

  const personStub = {
    getPage: (a: any, b: any) => of<appPerson[]>([]),
    getDocCount: () => of(1),
    getBySearchStrings: (a: any, b: any) => of<appPerson[]>([]),
    update: (a: any) => of(true),
  };
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
        ReactiveFormsModule,
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

  afterEach(() => {
    if (sub) sub.unsubscribe();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should init the data observable with a form", (done) => {
    spyOn(personStub, "getPage").and.returnValue(of([{ id: "asdf", name: "asdf", isConfirmedMember: true, groups: [] }]));
    component.ngOnInit();
    fixture.detectChanges();
    sub = component.$withForm.subscribe((el) => {
      expect(el[0].form).toBeTruthy();
      done();
    });
  });

  it("should update the data with a form on search", (done) => {
    spyOn(personStub, "getPage").and.returnValue(of([{ id: "asdf", name: "asdf", isConfirmedMember: true, groups: [] }]));
    component.onPage({ pageIndex: 1, previousPageIndex: 2 } as PageEvent);
    fixture.detectChanges();
    sub = component.$withForm.subscribe((el) => {
      expect(el[0].form).toBeTruthy();
      done();
    });
  });

  it("should call update correctly on submit", () => {
    const spy = spyOn(personStub, "update").and.returnValue(of(true));
    component.onSubmit("asdf", false, [], "test", new FormGroup({}));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({ id: "asdf", isConfirmedMember: false, groups: [], name: "test" });
  });
});
