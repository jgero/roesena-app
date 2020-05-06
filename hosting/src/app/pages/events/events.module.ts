import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';

import { EventsRoutingModule } from './events-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { CardsModule } from 'src/app/shared/cards/cards.module';
import { DetailsComponent } from './details/details.component';
import { ConvertersModule } from 'src/app/shared/converters/converters.module';
import { EditorComponent } from './editor/editor.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MarkdownViewerModule } from 'src/app/shared/markdown-viewer/markdown-viewer.module';
import { SearchModule } from 'src/app/shared/search/search.module';

@NgModule({
  declarations: [OverviewComponent, DetailsComponent, EditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EventsRoutingModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatListModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTooltipModule,
    CardsModule,
    ConvertersModule,
    MarkdownViewerModule,
    SearchModule,
  ],
})
export class EventsModule {}
