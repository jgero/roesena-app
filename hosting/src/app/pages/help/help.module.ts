import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';
import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule, HelpRoutingModule, MarkdownViewerModule],
})
export class HelpModule {}
