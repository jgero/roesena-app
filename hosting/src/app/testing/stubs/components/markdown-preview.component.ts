import { Component, Input } from '@angular/core';

@Component({ selector: 'app-markdown-preview', template: '' })
export class MarkdownPreviewStubComponent {
  @Input() markdownText: string;
}
