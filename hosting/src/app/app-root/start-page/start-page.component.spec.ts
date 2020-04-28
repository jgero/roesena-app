import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StartPageComponent } from "./start-page.component";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { EventDalServiceStub } from "src/app/testing/stubs/event-dal";
import { ArticleDalStub } from "src/app/testing/stubs/article-dal";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";

describe("StartPageComponent", () => {
  let component: StartPageComponent;
  let fixture: ComponentFixture<StartPageComponent>;

  const eventDalStub = new EventDalServiceStub();
  const articleDalStub = new ArticleDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StartPageComponent],
      providers: [
        { provide: EventDALService, useValue: eventDalStub },
        { provide: ArticleDalService, useValue: articleDalStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
