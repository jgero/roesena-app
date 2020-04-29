import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupManagerComponent } from "./group-manager.component";
import { PersonDalStub } from "src/app/testing/stubs/person-dal";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";

xdescribe("GroupManagerComponent", () => {
  let component: GroupManagerComponent;
  let fixture: ComponentFixture<GroupManagerComponent>;

  const personStub = new PersonDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatCheckboxModule,
        MatChipsModule,
        MatPaginatorModule,
        MatProgressBarModule,
      ],
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
