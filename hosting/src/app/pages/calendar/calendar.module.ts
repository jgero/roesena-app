import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { DayComponent } from './day/day.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { StoreModule } from '@ngrx/store';
import * as fromEvent from '../../state/calendar/reducers/event.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventEffects } from '../../state/calendar/effects/event.effects';

@NgModule({
  declarations: [CalendarComponent, DayComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    MatBadgeModule,
    StoreModule.forFeature(fromEvent.eventFeatureKey, fromEvent.reducer),
    EffectsModule.forFeature([EventEffects]),
  ],
})
export class CalendarModule {}
