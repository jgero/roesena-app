import { Component, OnInit, Input, HostBinding, SecurityContext } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-markdown-viewer',
  template: '',
  styleUrls: ['./markdown-viewer.component.scss'],
})
export class MarkdownViewerComponent implements OnInit {
  @Input()
  markdownText: string;
  constructor(private markdownService: MarkdownService, private sanitizer: DomSanitizer) {}

  @HostBinding('innerHTML')
  get text(): string {
    return this.markdownService.compile(this.markdownText);
  }

  ngOnInit() {
    // override link rendering to be able to add the target="_blank"
    this.markdownService.renderer.link = (href: string, title: string, text: string) => {
      const sanitizedText = this.sanitizer.sanitize(SecurityContext.HTML, text);
      const sanitizedHref = this.sanitizer.sanitize(SecurityContext.URL, href);
      return `<a href="${sanitizedHref}" ${sanitizedHref.startsWith('http') ? 'target="_blank"' : ''}>${sanitizedText}</a>`;
    };
  }
}
