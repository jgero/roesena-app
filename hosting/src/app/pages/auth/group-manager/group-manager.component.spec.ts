import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupManagerComponent } from "./group-manager.component";
import { PersonDalStub } from "src/app/testing/stubs/person-dal";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";

describe("GroupManagerComponent", () => {
  let component: GroupManagerComponent;
  let fixture: ComponentFixture<GroupManagerComponent>;

  const personStub = new PersonDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupManagerComponent],
      providers: [{ provide: PersonDalService, useValue: personStub }],
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
