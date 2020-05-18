import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownPreviewComponent } from './markdown-preview/markdown-preview.component';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [MarkdownPreviewComponent, MarkdownViewerComponent],
  exports: [MarkdownPreviewComponent, MarkdownViewerComponent],
  imports: [CommonModule, MarkdownModule.forRoot(), MatButtonModule, MatIconModule],
})
export class MarkdownViewerModule {}
