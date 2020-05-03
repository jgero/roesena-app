import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HelpComponent } from "./help.component";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { of } from "rxjs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MarkdownViewerStub } from "src/app/testing";

describe("HelpComponent", () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  const articleStub = {
    getBySearchStrings: (a: any, b: any) =>
      of([
        {
          id: "",
          ownerId: "",
          ownerName: "",
          tags: [],
          title: "",
          content: "",
          created: new Date(),
        },
      ]),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule],
      declarations: [HelpComponent, MarkdownViewerStub],
      providers: [{ provide: ArticleDalService, useValue: articleStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
