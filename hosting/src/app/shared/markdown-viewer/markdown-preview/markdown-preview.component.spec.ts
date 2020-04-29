import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MarkdownPreviewComponent } from "./markdown-preview.component";
import { MarkdownViewerStub } from "src/app/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

describe("MarkdownPreviewComponent", () => {
  let component: MarkdownPreviewComponent;
  let fixture: ComponentFixture<MarkdownPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule, MatIconModule],
      declarations: [MarkdownPreviewComponent, MarkdownViewerStub],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
