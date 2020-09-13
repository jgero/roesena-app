import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventDetailsRoutingModule } from './event-details-routing.module';
import { DetailsComponent } from './details.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { ConvertersModule } from '@shared/converters/converters.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    EventDetailsRoutingModule,
    MatToolbarModule,
    MarkdownViewerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatListModule,
    ConvertersModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class EventDetailsModule {}
