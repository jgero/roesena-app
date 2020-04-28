import { Component, Input } from "@angular/core";

@Component({
  selector: "app-markdown-preview",
  templateUrl: "./markdown-preview.component.html",
  styleUrls: ["./markdown-preview.component.scss"],
})
export class MarkdownPreviewComponent {
  @Input()
  markdownText: string;
  isContentVisible = true;
  constructor() {}
}
