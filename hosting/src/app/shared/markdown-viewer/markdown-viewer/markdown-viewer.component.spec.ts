import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MarkdownViewerComponent } from "./markdown-viewer.component";
import { MarkdownService } from "ngx-markdown";

describe("MarkdownViewerComponent", () => {
  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;

  const markdownSpy = jasmine.createSpyObj("MarkdownService", ["compile"]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarkdownViewerComponent],
      providers: [{ provide: MarkdownService, useValue: markdownSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
