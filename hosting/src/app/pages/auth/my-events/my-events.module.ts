import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyEventsRoutingModule } from './my-events-routing.module';
import { MyEventsComponent } from './my-events.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConvertersModule } from '@shared/converters/converters.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreModule } from '@ngrx/store';
import * as fromEvents from '../../../state/auth/my-events/reducers/events.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from '../../../state/auth/my-events/effects/events.effects';
import { HeadingsModule } from '@shared/headings/headings.module';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [MyEventsComponent],
  imports: [
    CommonModule,
    MyEventsRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule,
    MatInputModule,
    HeadingsModule,
    MatTableModule,
    ReactiveFormsModule,
    MatTooltipModule,
    ConvertersModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature(fromEvents.eventsFeatureKey, fromEvents.reducer),
    EffectsModule.forFeature([EventsEffects]),
  ],
})
export class MyEventsModule {}
