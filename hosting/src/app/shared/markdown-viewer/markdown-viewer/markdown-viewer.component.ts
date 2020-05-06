import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-viewer',
  template: '',
  styleUrls: ['./markdown-viewer.component.scss'],
})
export class MarkdownViewerComponent {
  @Input()
  markdownText: string;
  constructor(private markdownService: MarkdownService) {}

  @HostBinding('innerHTML')
  get text(): string {
    return this.markdownService.compile(this.markdownText);
  }
}
