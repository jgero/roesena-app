import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventDetailsRoutingModule } from './event-details-routing.module';
import { DetailsComponent } from './details.component';
import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';
import { MatChipsModule } from '@angular/material/chips';
import { ConvertersModule } from '@shared/converters/converters.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    EventDetailsRoutingModule,
    MarkdownViewerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    ConvertersModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class EventDetailsModule {}
